---
title: ".NET 11: Runtime, Kütüphaneler ve SDK Yenilikleri"
description: ".NET 11'de Runtime Async nedir, yeni Process API'leri ve LINQ FullJoin ne kazandırır, System.Text.Json ve SDK tarafında neler değişti? Sorularına cevap arıyoruz."
date: 2026-11-14
topic: dotnet
tags: [dotnet, dotnet-11, runtime, linq, system-text-json, sdk]
draft: false
---

Bir .NET sürümünün etkisi çoğu zaman yeni dil özelliklerinden çok, **altta çalışan runtime ve her gün kullandığımız kütüphanelerde** hissedilir. .NET 11'de de durum böyle: bazı kazançlar hiç kod değiştirmeden geliyor, bazıları ise yıllardır elle çözdüğümüz problemlere hazır çözüm sunuyor.

Önceki yazıda [C# 15 yeniliklerini](/blog/csharp-15-yenilikleri) konuşmuştuk. Bu yazıda dilin altındaki katmana iniyoruz: runtime, temel kütüphaneler ve SDK.

> **Bu yazının kapsamı:** Bu katmandaki değişiklik listesi oldukça uzun. Burada yalnızca günlük kodu en çok etkileyecek olanları seçtim. Sayısal tipler, kriptografi ve ağ tarafındaki ayrıntılar için kaynaklardaki resmi dokümantasyona göz atabilirsiniz.

## Runtime Async (önizleme)

Sürümün en büyük mimari değişikliği. Bugüne kadar `async`/`await` dönüşümünü **C# derleyicisi** yapıyordu: her async metot için bir state machine tipi üretiliyordu. Runtime Async bu işi **runtime'a ve JIT'e** taşıyor.

Programlama modeli değişmiyor; `await`, exception ve iptal davranışı aynı kalıyor. Değişen, arka planda üretilen kod. Bunun üç somut kazancı var:

- **Daha temiz çağrı yığını:** Profiler ve debugger artık state machine altyapısını değil, gerçek metotları görüyor. Resmi örnekte 13 çerçeveden 5 çerçeveye iniliyor.
- **Daha küçük binary:** Birbirini çağıran on async metotluk örnekte DLL boyutu neredeyse yarıya düşüyor.
- **Daha az bellek tahsisi:** Ara `Task` nesneleri büyük ölçüde ortadan kalkıyor.

.NET 11'de bu özellik **önizleme** ve isteğe bağlı. Denemek için proje dosyasına şunu eklemek yeterli:

```xml
<PropertyGroup>
  <Features>$(Features);runtime-async=on</Features>
</PropertyGroup>
```

İlginç bir detay: .NET'in kendi kütüphaneleri zaten bu modla derlenmiş durumda. Yani siz açmasanız bile framework çağrılarında dolaylı olarak kullanıyorsunuz. Üretimde açmadan önce bağımlılıklarınızı ve tanılama araçlarınızı ayrı bir dalda test etmenizi öneririm.

## JIT ve runtime iyileştirmeleri

Bu başlıktaki kazançlar için kod değiştirmenize gerek yok:

- Daha fazla gereksiz sınır kontrolü (bounds check) kaldırılıyor.
- Generic sanal metotlar artık **devirtualize** edilebiliyor.
- Native AOT'ta interface dispatch daha hızlı ve çağrı noktalarındaki kod daha küçük.
- Linux ve macOS'ta süreç çökmeden önce managed stack trace yakalanabiliyor.

## Process: tek satırda süreç çalıştırma

Bir süreç başlatıp çıktısını deadlock'a düşmeden yakalamak, şaşırtıcı derecede zor işlerdendi. Artık tek satır:

```csharp
using System.Diagnostics;

ProcessTextOutput result = await Process.RunAndCaptureTextAsync(
    "git", ["status", "--porcelain"]);

if (result.ExitStatus.ExitCode != 0)
{
    Console.Error.WriteLine(result.StandardError);
    return;
}

Console.WriteLine(result.StandardOutput);
```

Bu örnekte:

- `RunAndCaptureTextAsync`, süreci başlatır, bitmesini bekler ve stdout ile stderr'i birlikte toplar.
- `ExitStatus`, sürecin nasıl sonlandığını (çıkış kodu, sinyal, iptal) taşır.
- Zaman aşımı ya da iptal durumunda süreç otomatik olarak sonlandırılmaya çalışılır.

Çıktıya ihtiyaç yoksa `Process.Run`, başlatıp unutmak için `Process.StartAndForget` kullanılabilir. Ebeveyn süreç ölünce çocuğu da sonlandırmak için ise yeni `ProcessStartInfo.KillOnParentExit` özelliği var.

## LINQ: `FullJoin`

.NET 10, `LeftJoin` ve `RightJoin`'i getirmişti; .NET 11 seti `FullJoin` ile tamamlıyor. Ayrıca join metotlarının artık result selector istemeyen, doğrudan tuple döndüren overload'ları var.

Tipik kullanım alanı mutabakat: iki listeyi karşılaştırıp her iki tarafta eksik olanı görmek.

```csharp
foreach (var (inErp, inWarehouse) in erp.FullJoin(warehouse, e => e.Sku, w => w.Sku))
{
    string sku = inErp?.Sku ?? inWarehouse!.Sku;
    Console.WriteLine($"{sku}: ERP={inErp?.Qty}, Depo={inWarehouse?.Qty}");
}
```

Eşleşmeyen taraf `default` olarak gelir. Bu yüzden "yok" ile "sıfır"ı ayırt edebilmek için referans tipi ya da nullable kullanmak önemli. Elle yazılmış `GroupJoin` + `Concat` çözümüne göre ciddi bir performans farkı da var: resmi ölçümde 27,6 ms'den 1,7 ms'ye.

Benzer bir sadeleşme eşitlik karşılaştırıcılarında da var. Bir anahtara göre eşitlik için artık sınıf yazmaya gerek yok:

```csharp
var byEmail = EqualityComparer<User>.Create(u => u.Email);
HashSet<User> users = [with(byEmail), .. source];
```

## System.Text.Json

**C# union desteği.** C# 15 union'ları doğrudan serileştirilebiliyor. JSON'da sarmalayıcı ya da `$type` alanı yok; içerik neyse o yazılıyor:

```csharp
public union Reading(int, string);

Reading reading = "hello";
string json = JsonSerializer.Serialize(reading); // "hello"
```

Birden fazla case aynı JSON şekline (örneğin nesne) sahipse, hangisinin seçileceğine karar vermek için `[JsonUnion]` ile bir sınıflandırıcı tanımlamak gerekiyor. Hazır gelen yapısal sınıflandırıcı, özellik adlarına bakarak doğru tipi seçebiliyor.

**JSON Lines (JSONL).** `IAsyncEnumerable<T>`'yi tek bir dizi yerine satır başına bir değer olarak yazmak artık mümkün:

```csharp
await JsonSerializer.SerializeAsyncEnumerable(
    writer,
    ReadEventsAsync(),
    topLevelValues: true);
```

Log akışları ve LLM eğitim/çıktı dosyaları gibi senaryolar için oldukça pratik.

## Asenkron doğrulama

Veritabanına ya da uzak bir servise bakması gereken doğrulama kuralları artık thread bloklamak zorunda değil. `AsyncValidationAttribute`'ten türeyerek asenkron bir kural yazabiliyoruz:

```csharp
public sealed class UniqueEmailAttribute : AsyncValidationAttribute
{
    protected override async Task<ValidationResult?> IsValidAsync(
        object? value, ValidationContext context, CancellationToken cancellationToken)
    {
        var users = context.GetRequiredService<IUserService>();

        if (value is string email && await users.EmailExistsAsync(email, cancellationToken))
            return new ValidationResult("Bu e-posta zaten kayıtlı.");

        return ValidationResult.Success;
    }
}
```

Bu altyapıyı ASP.NET Core Minimal API'ler ve Blazor formları otomatik olarak kullanıyor; bir sonraki yazıda bu entegrasyona bakacağız.

## Diğer kütüphane yenilikleri

| Alan | Yenilik |
|---|---|
| Sıkıştırma | `ZstandardStream` artık `System.IO.Compression` içinde; ZIP'te CRC32 doğrulaması |
| Stream | `StringStream`, `ReadOnlyMemoryStream` gibi kopyasız stream adaptörleri |
| Sayısal tipler | `Decimal32/64/128`, `BFloat16`, generic `Complex<T>` |
| Güvenlik | X25519 anahtar değişimi, TLS sertleştirmeleri |
| Gözlemlenebilirlik | `MemoryCache` için yerleşik OpenTelemetry metrikleri |

## SDK ve araçlar

### Daha hızlı CLI

İki değişiklik varsayılan olarak açık: **Native AOT ile derlenmiş CLI host** sayesinde `dotnet --version` gibi komutlar anında yanıt veriyor ve **MSBuild sunucusu** çağrılar arasında sıcak kalıyor.

### Dosya tabanlı uygulamalar büyüyor

.NET 10'da gelen tek dosyalık uygulamalar artık `#:include` ile birden fazla dosyaya yayılabiliyor:

```csharp
#:include helpers.cs
#:include models/customer.cs
#:package Spectre.Console@0.50.0

using Spectre.Console;

AnsiConsole.MarkupLine(Helpers.Format(new Customer("Taha")));
```

```bash
dotnet run Program.cs
```

Küçük araçlar ve script'ler için proje dosyası olmadan çalışmak artık çok daha gerçekçi.

### Tedarik zinciri: minimum paket yaşı

NuGet kaynağına "yeni yayınlanan sürümleri belirli bir süre bekle" diyebiliyoruz. Ele geçirilmiş bir paketin yayınlanır yayınlanmaz build'e girmesine karşı basit ama etkili bir önlem:

```bash
dotnet nuget add source https://api.nuget.org/v3/index.json \
  --name public --min-publish-age-hours 24 --configfile nuget.config
```

### Küçük ama kullanışlı

- `dotnet run -e KEY=VALUE` ile ortam değişkeni geçmek.
- `dotnet test --timeout 90s` ve `--maximum-failed-tests 5` gibi çalıştırma seviyesi seçenekler.
- `dotnet new mcpserver` ile resmi MCP C# SDK'sını kullanan sunucu şablonu.

## Kapanış

Bu katmandaki değişikliklerin çoğu "kod yazmadan kazanç" türünden: daha akıllı JIT, daha hızlı CLI, daha az bellek tahsisi. Kod tarafında hemen işe yarayacak üç şey seçmem gerekse `Process.RunAndCaptureTextAsync`, `FullJoin` ve asenkron doğrulamayı seçerdim. Runtime Async'i ise denemeye değer buluyorum; varsayılan hâle gelmesi muhtemelen bir sonraki sürümün konusu.

Bir sonraki ve serinin son yazısında web ve veri katmanına bakıyoruz: [ASP.NET Core 11 ve EF Core 11](/blog/aspnet-core-11-ve-ef-core-11). Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Önizleme durumundaki özellikler (özellikle Runtime Async) sonraki sürümlerde değişebilir. Üretim ortamına taşımadan önce resmi dokümantasyondan doğrulamanız iyi bir alışkanlıktır.

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/runtime) – Runtime Async, JIT ve runtime değişiklikleri
- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/libraries) – Process, LINQ, System.Text.Json ve diğer kütüphaneler
- [What's new in the SDK and tooling for .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk) – CLI, dosya tabanlı uygulamalar ve NuGet
- [Performance Improvements in .NET 11](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-11/) – Performans iyileştirmelerinin detaylı analizi
- [Process API Improvements in .NET 11](https://devblogs.microsoft.com/dotnet/process-api-improvements-in-dotnet-11/) – Yeni Process API'lerinin tasarımı
