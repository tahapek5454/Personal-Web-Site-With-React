---
title: ".NET 11 Çıktı: Genel Bakış ve Yükseltme Rehberi"
description: ".NET 11 ile neler geldi, destek süresi ne kadar, hangi gereksinimler değişti ve projeyi nasıl yükseltiriz? Sorularına cevap arıyoruz."
date: 2026-11-12
topic: dotnet
tags: [dotnet, dotnet-11, csharp-15, upgrade]
draft: true
---

.NET 11, 10 Kasım 2026'da .NET Conf 2026 ile birlikte yayınlandı. Bu sürüm tek bir büyük özellikten çok, **dil, runtime, kütüphaneler ve web katmanında birbirini tamamlayan iyileştirmeler** getiriyor. Yükseltme kararını vermeden önce sürümün kimliğini, gereksinimlerini ve kırıcı değişikliklerini bilmek gerekiyor.

Bu yazı, .NET 11 ve C# 15 serisinin ilk durağı. Burada sürümün genel resmini çiziyor ve bir projeyi .NET 11'e nasıl taşıyacağımızı konuşuyoruz.

> **Bu serinin kapsamı:** Seri dört yazıdan oluşuyor: genel bakış ve yükseltme (bu yazı), [C# 15 yenilikleri](/blog/csharp-15-yenilikleri), [runtime, kütüphaneler ve SDK](/blog/dotnet-11-runtime-kutuphaneler-sdk) ve [ASP.NET Core 11 ile EF Core 11](/blog/aspnet-core-11-ve-ef-core-11). Bu yazıyı serinin **haritası** olarak düşünebilirsiniz; detaylar sonraki yazılarda.

## Sürümün kimliği: STS

.NET 11 bir **Standard Term Support (STS)** sürümü ve iki yıl destekleniyor. Microsoft'un vurguladığı nokta şu: STS ile LTS arasında kalite ya da bakım farkı yok, tek fark destek süresi.

| Sürüm | Tür | Durum |
|---|---|---|
| .NET 11 | STS | 10 Kasım 2026'da çıktı, iki yıl destek |
| .NET 10 | LTS | Destekleniyor |
| .NET 9 | STS | Desteği 10 Kasım 2026'da bitti |
| .NET 8 | LTS | Desteği 10 Kasım 2026'da bitti |

.NET 8 ya da .NET 9 üzerindeyseniz artık güvenlik yaması almıyorsunuz. .NET 10 ve .NET 11'in desteği aşağı yukarı aynı dönemde (Kasım 2028) bittiği için karar, "uzun destek mi, yeni özellik mi" sorusundan çok **"C# 15 ve yeni API'lere ihtiyacım var mı?"** sorusuna dönüşüyor.

## Öne çıkanlar

Sürümün genel haritası şöyle:

- **C# 15:** Union tipleri, kapalı hiyerarşiler (`closed`), koleksiyon ifadelerine argüman (`with(...)`), extension indexerlar ve etiketli `break`/`continue`.
- **Runtime:** JIT iyileştirmeleri, Native AOT'ta daha hızlı interface dispatch ve önizleme olarak **Runtime Async**.
- **Kütüphaneler:** Zstandard sıkıştırma, tek satırda süreç çalıştırma, LINQ `FullJoin`, `System.Text.Json`'da union ve JSON Lines desteği.
- **SDK:** Daha hızlı CLI ve birden fazla dosyaya yayılabilen dosya tabanlı uygulamalar.
- **ASP.NET Core:** Asenkron doğrulama, varsayılan OpenAPI 3.2, SignalR'da yeniden bağlanmadan kimlik yenileme.
- **EF Core 11:** Daha temiz SQL ve `FullJoin` çevirisi.
- **.NET MAUI:** Mobilde varsayılan runtime artık Mono değil CoreCLR.

## Gereksinimler

Geliştirme ortamı tarafında büyük bir sürpriz yok: **.NET 11 SDK** ile güncel bir **Visual Studio 2026** ya da **VS Code + C# Dev Kit** yeterli. C# 15, `net11.0` hedefleyen projelerde varsayılan dil sürümü; `LangVersion` ayarlamaya gerek yok.

```bash
dotnet --version
dotnet new console -n HelloDotnet11 -f net11.0
dotnet run --project HelloDotnet11
```

### Donanım: x86-64-v2 artık zorunlu

Bu sürümün en çok dikkat edilmesi gereken kırıcı değişikliği donanım tarafında. x86/x64'te taban çizgisi **x86-64-v1'den x86-64-v2'ye** yükseltildi; işlemcinin SSE4.2, POPCNT gibi komut setlerini desteklemesi gerekiyor. Karşılamayan bir makinede uygulama hiç açılmıyor:

```text
The current CPU is missing one or more of the baseline instruction sets.
```

Bu seviye, Intel ve AMD'nin hâlâ desteklediği tüm işlemcileri kapsıyor; Windows 11 de zaten bunu şart koşuyor. Yine de **eski bir sanallaştırma katmanı ya da çok eski fiziksel sunucu** kullanıyorsanız dağıtımdan önce kontrol etmekte fayda var.

## Kırıcı değişiklikler

Tam liste resmi dokümantasyonda. Pratikte en çok karşılaşılacak olanlar şunlar:

| Alan | Değişiklik |
|---|---|
| Runtime | Minimum donanım x86-64-v2; `float`/`double`'dan küçük tamsayıya `unchecked` dönüşüm artık sarmak yerine sınıra doyuyor |
| C# | `closed` bağlamsal anahtar sözcük oldu; bu isimde bir tip varsa `@closed` gerekir |
| ASP.NET Core | Varsayılan OpenAPI 3.2, `ConcurrencyLimiter` kaldırıldı, Kestrel HTTP uyumluluğu sıkılaştı |
| EF Core | `Microsoft.Data.SqlClient` 7.0; Entra ID kimlik doğrulaması ayrı pakete taşındı |
| .NET MAUI | Mobilde CoreCLR; minimum Android API seviyesi 24 |

Web ve veri katmanındaki değişiklikleri serinin son yazısında daha ayrıntılı ele alıyoruz.

## Yükseltme adımları

Microsoft'un önerdiği yol dört adımdan oluşuyor.

**1. SDK'yı güncellemek.** Depoda `global.json` varsa önce oradaki sürümü güncellemek gerekiyor. Aynı SDK'nın hem geliştirici makinelerinde hem de build ajanlarında kurulu olması, "bende çalışıyordu" sürprizlerinin önüne geçer.

```json
{
  "sdk": {
    "version": "11.0.100",
    "rollForward": "latestFeature"
  }
}
```

SDK'yı kurmak tek başına uygulamayı yeniden hedeflemez; .NET 11 SDK ile `net10.0` projeleri derlemeye devam edebilirsiniz.

**2. Hedef framework'ü değiştirmek.**

```xml
<PropertyGroup>
  <TargetFramework>net11.0</TargetFramework>
</PropertyGroup>
```

Ardından paketleri ve workload'ları da güncel sürümlere çekebiliriz:

```bash
dotnet list package --outdated
dotnet workload update
```

EF Core 11 yalnızca .NET 11 üzerinde çalışır; bu yüzden kullandığımız sağlayıcının (Npgsql, Pomelo vb.) uyumlu sürümünün çıkıp çıkmadığını kontrol etmekte fayda var.

**3. Kırıcı değişiklikleri gözden geçirmek.** Burada özellikle minimum işlemci gereksinimini dağıtım ortamımızla karşılaştırmamız gerekiyor.

**4. Doğrulamak.** Son adımda testleri çalıştırıp temsili bir yük altında ölçüm yapmak iyi olur. Container kullanıyorsak taban imajı da güncellememiz gerekiyor:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:11.0 AS base
FROM mcr.microsoft.com/dotnet/sdk:11.0 AS build
```

## .NET 10'da mı kalmalı, 11'e mi geçmeli?

| Durum | Öneri |
|---|---|
| .NET 8 / 9 üzerindesiniz | Yükseltmeyi ertelememekte fayda var; ikisi de destek dışı |
| .NET 10'dasınız, yükseltme maliyetli | .NET 10'da kalabilirsiniz |
| Union tipleri, async validation, OpenAPI 3.2 gibi yenilikler lazım | .NET 11 |
| Yılda bir yükseltme yapabiliyorsunuz | .NET 11, ardından .NET 12 (LTS) |

## Kapanış

.NET 11, STS kimliğine rağmen hafif bir ara sürüm değil; dil tarafında uzun süredir beklenen union tiplerini, platform tarafında ise hız ve sadelik odaklı birçok iyileştirmeyi getiriyor. Yükseltmeden önce dikkat edilmesi gereken en önemli nokta, yeni donanım taban çizgisi.

Bir sonraki yazıda dilin kendisine odaklanıyoruz: [C# 15 yenilikleri](/blog/csharp-15-yenilikleri). Union tipleri, `closed` hiyerarşiler ve diğer yeni özellikleri örneklerle inceleyeceğiz. Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Burada anlatılan davranışlar ve varsayılanlar ilerleyen servis sürümlerinde değişebilir. Yükseltmeden önce resmi dokümantasyonu kontrol etmeniz iyi bir alışkanlıktır.

- [Announcing .NET 11](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/) – Sürüm duyurusu ve öne çıkanlar
- [What's new in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) – Tüm yeniliklerin resmi özeti
- [Breaking changes in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/compatibility/11) – Kırıcı değişikliklerin tam listesi
- [Minimum hardware requirements updated](https://learn.microsoft.com/en-us/dotnet/core/compatibility/jit/11/minimum-hardware-requirements) – x86-64-v2 gereksinimi ayrıntıları
