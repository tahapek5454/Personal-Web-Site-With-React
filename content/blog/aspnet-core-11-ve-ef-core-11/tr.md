---
title: "ASP.NET Core 11 ve EF Core 11 Yenilikleri"
description: "ASP.NET Core 11'de asenkron doğrulama, union desteği, OpenAPI 3.2 ve SignalR kimlik yenileme; EF Core 11'de daha iyi SQL ve kırıcı değişiklikler. Sorularına cevap arıyoruz."
date: 2026-11-15
topic: dotnet
tags: [aspnetcore, blazor, minimal-api, signalr, efcore, dotnet-11]
draft: true
---

Web ve veri katmanında .NET 11'in karakteri **"büyük yeni bir çerçeve" değil, "eksik parçaların tamamlanması"**. Doğrulama asenkron oldu, OpenAPI güncel spesifikasyona geçti, SignalR token yenilemeyi öğrendi ve EF Core arka planda daha temiz SQL üretmeye başladı.

Önceki yazıda [runtime, kütüphaneler ve SDK](/blog/dotnet-11-runtime-kutuphaneler-sdk) tarafını konuşmuştuk. Serinin bu son yazısında ise API geliştiricilerini en çok ilgilendiren ASP.NET Core 11 ve EF Core 11 yeniliklerine odaklanıyoruz.

> **Bu yazının kapsamı:** Blazor tarafında da `CacheView`, otomatik circuit duraklatma ve `Virtualize` iyileştirmeleri gibi birçok yenilik var. Bu yazıda bunlara kısaca değinip ağırlığı API ve veri katmanına veriyoruz.

## Minimal API'lerde asenkron doğrulama

.NET 10, Minimal API'lere yerleşik doğrulamayı getirmişti. .NET 11 bunu uçtan uca asenkron hâle getiriyor. Önceki yazıda gördüğümüz `AsyncValidationAttribute` ve `IAsyncValidatableObject` artık otomatik çalışıyor:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddValidation();

var app = builder.Build();

app.MapPost("/reservations", (ReservationRequest request) => Results.Ok(request));

app.Run();

public class ReservationRequest : IAsyncValidatableObject
{
    [Required, EmailAddress]
    public string Email { get; set; } = "";

    public DateOnly Date { get; set; }

    // Bu tip yalnızca asenkron doğrulanır
    public IEnumerable<ValidationResult> Validate(ValidationContext context) =>
        throw new InvalidOperationException("ValidateAsync ile doğrulayın.");

    public async IAsyncEnumerable<ValidationResult> ValidateAsync(
        ValidationContext context,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var rooms = context.GetRequiredService<IRoomService>();

        if (!await rooms.HasAvailabilityAsync(Date, cancellationToken))
            yield return new ValidationResult("Bu tarihte boş oda yok.", [nameof(Date)]);
    }
}
```

Bu örnekte:

- `AddValidation()`, doğrulama altyapısını etkinleştirir.
- `ValidateAsync`, veritabanına ya da servise thread bloklamadan sorgu atabilir.
- Doğrulama başarısız olursa framework standart problem yanıtını kendisi üretir; endpoint gövdesi hiç çalışmaz.

## C# union tipleriyle API'ler

ASP.NET Core, `System.Text.Json` kullandığı her yerde C# 15 union'larını destekliyor. Bir endpoint'in birden fazla farklı tip döndürebileceğini artık tip sisteminde ifade edebiliyoruz:

```csharp
public record class Product(int Id, string Name, decimal Price);
public record class ProductNotFound(int Id);
public union ProductLookup(Product, ProductNotFound);

app.MapGet("/products/{id:int}", ProductLookup (int id, ProductStore store) =>
{
    if (store.Find(id) is { } product)
        return product;

    return new ProductNotFound(id);
});
```

Üretilen OpenAPI belgesi alternatifleri `anyOf` şemasıyla tarif ediyor. Ancak dikkat edilmesi gereken iki nokta var:

- Destek yalnızca **JSON gövdeleri** için geçerli; route, query ve form binding'de çalışmıyor.
- Union döndürmek **HTTP durum kodunu değiştirmez**. Yukarıdaki endpoint "bulunamadı" durumunda da 200 döner. Durum kodlarını ayırmak istiyorsanız `Results<Ok<Product>, NotFound>` hâlâ doğru araç; union'lar daha çok domain katmanında sonucu modellemek için uygun.

## OpenAPI 3.2 varsayılan

Üretilen belgeler artık varsayılan olarak **OpenAPI 3.2** hedefliyor. Bu sürümle birlikte Server-Sent Events akışlarındaki olay şemaları ve HTTP `QUERY` metodu da belgelenebiliyor.

İstemci üreticiniz ya da araç zinciriniz 3.2'yi henüz desteklemiyorsa eski sürüme dönebilirsiniz:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_1;
});
```

Alttaki `Microsoft.OpenApi` paketi 3.x'e yükseldiği için özel OpenAPI transformer'ları yazdıysak kaynak seviyesinde bazı kırılmalarla karşılaşmamız muhtemel.

## Diğer API yenilikleri

- **`[ShortCircuit]` attribute'u:** Bir endpoint'in middleware hattının geri kalanını atlamasını attribute ile belirtebiliyoruz. Health check gibi hafif endpoint'ler için ideal.
- **Zstandard sıkıştırma:** Yanıt sıkıştırma ve istek açma middleware'leri zstd'yi destekliyor.
- **Otomatik CSRF koruması:** Çoğu durumda `app.UseAntiforgery()` çağrısına artık gerek yok.

```csharp
app.MapGet("/health", [ShortCircuit] () => "Healthy");
```

## SignalR: yeniden bağlanmadan kimlik yenileme

Uzun yaşayan bağlantılarda token süresi dolunca bağlantıyı koparıp yeniden kurmak gerekiyordu. Artık bağlantı açıkken kimlik yenilenebiliyor:

```csharp
// Sunucu
app.MapHub<ChatHub>("/chat", options =>
{
    options.EnableAuthenticationRefresh = true;
    options.CloseOnAuthenticationExpiration = true;
});

// İstemci
var connection = new HubConnectionBuilder()
    .WithUrl("https://example.com/chat")
    .WithAuthenticationRefresh(options =>
    {
        options.RefreshBeforeExpiration = TimeSpan.FromMinutes(1);
    })
    .Build();
```

İstemci, token'ın süresi dolmadan bir dakika önce kimliği yeniler; sunucu tarafında `Context.User` güncellenir. Ayrıca istemciden bir `CancellationToken` ile başlatılan hub çağrısı artık sunucu tarafında da iptal edilebiliyor.

## Blazor'a kısa bir bakış

Blazor tarafındaki tema, **statik SSR'ın daha fazla senaryoyu interaktif bağlantı olmadan karşılayabilmesi**:

- **`CacheView`:** Bir bileşen alt ağacının render çıktısını önbelleğe alır; tüm sayfa önbelleğinden daha ince taneli bir araç.
- **Otomatik circuit duraklatma:** Sekme etkin değilken sunucu belleği ve SignalR bağlantısı serbest bırakılabiliyor.
- **Asenkron form doğrulama:** `EditForm`, async validator'ları uçtan uca bekliyor.
- **`Virtualize`:** Artık tüm öğelerin aynı yükseklikte olduğunu varsaymıyor.

```razor
<CacheView VaryByQuery="category" ExpiresAfter="TimeSpan.FromMinutes(5)">
    <ProductList Category="@Category" />
</CacheView>
```

## EF Core 11

EF Core 11 yalnızca .NET 11 üzerinde çalışıyor. Bu sürümdeki kazançların büyük kısmı, **hiçbir kod değiştirmeden daha iyi SQL** üretilmesinden geliyor.

### LINQ ve SQL çevirisi

.NET 11'in yeni `FullJoin` operatörü ilişkisel veritabanlarında doğrudan `FULL JOIN`'e çevriliyor:

```csharp
var results = await context.Customers
    .FullJoin(
        context.Orders,
        c => c.Id,
        o => o.CustomerId,
        (c, o) => new { Customer = c, Order = o })
    .ToListAsync();
```

```sql
SELECT [c].[Id], [c].[Name], [o].[Id], [o].[CustomerId], [o].[OrderDate]
FROM [Customers] AS [c]
FULL JOIN [Orders] AS [o] ON [c].[Id] = [o].[CustomerId]
```

Bunun yanında:

- Referans navigasyonu `Include` eden sorgularda gereksiz join'ler ve `ORDER BY`'lar kaldırılıyor; resmi ölçümlerde %22-29 arası iyileşme var.
- `GroupBy` çevirisi daha akıllı hâle geldi.
- `MaxBy` ve `MinBy` artık SQL'e çevriliyor.

### Araçlar

- `dotnet ef database update --add` migration'ı tek adımda oluşturup uyguluyor.
- `dotnet ef`, varsayılan seçenekleri `.config/dotnet-ef.json` dosyasından okuyabiliyor; `--project` ve `--startup-project`'i her seferinde yazmaya gerek kalmıyor.
- Log mesajları artık stderr'e yazılıyor; `dotnet ef migrations script > out.sql` temiz SQL üretiyor.

## Yükseltirken dikkat: kırıcı değişiklikler

| Değişiklik | Ne yapabiliriz? |
|---|---|
| `OpenApiVersion` varsayılanı 3.2 | Araçlarımız desteklemiyorsa 3.1'e dönebiliriz |
| `ConcurrencyLimiter` middleware kaldırıldı | Rate limiting middleware'ine geçmemiz gerekiyor |
| Kestrel HTTP protokol uyumluluğunu sıkılaştırdı | Standart dışı istemcileri test etmekte fayda var |
| Yanıt sıkıştırma her zaman `Vary: Accept-Encoding` gönderir | CDN ve önbellek anahtarlarını kontrol etmeliyiz |
| `Microsoft.Data.SqlClient` 7.0 | Entra ID kullanıyorsak ayrı paketi eklememiz gerekiyor |
| SQL Server uyumluluk seviyesi varsayılanı 160 | Eski SQL Server'larda seviyeyi açıkça belirtmeliyiz |
| Migration bulunamazsa EF hata fırlatıyor | Migration'sız senaryoları gözden geçirmek iyi olur |

En çok kişiyi etkileyecek olan **SqlClient 7.0**. Bağlantı dizenizde `Authentication=Active Directory Default` gibi bir Entra ID yöntemi kullanıyorsanız paketi ayrıca eklemeniz gerekiyor:

```bash
dotnet add package Microsoft.Data.SqlClient.Extensions.Azure
```

SQL Server 2022'den eski bir sürüme bağlanıyorsak uyumluluk seviyesini açıkça belirtmemiz gerekiyor:

```csharp
optionsBuilder.UseSqlServer(connectionString, o => o.UseCompatibilityLevel(150));
```

## Kapanış

ASP.NET Core 11 ve EF Core 11, gösterişli yeniliklerden çok günlük geliştirme deneyimini iyileştiren adımlar atıyor. Asenkron doğrulama ve SignalR kimlik yenileme, yıllardır geçici çözümlerle idare ettiğimiz ihtiyaçlara resmi bir cevap sunuyor; EF Core ise üretilen SQL'i sessizce iyileştiriyor.

Böylece .NET 11 ve C# 15 serisinin sonuna geldik. [Genel bakış](/blog/dotnet-11-genel-bakis), [C# 15](/blog/csharp-15-yenilikleri), [runtime ve kütüphaneler](/blog/dotnet-11-runtime-kutuphaneler-sdk) ve bu yazıyla birlikte sürümün genel haritasını çıkarmış olduk. Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Kırıcı değişiklikler projeye ve kullanılan sağlayıcılara göre farklı etkiler yaratabilir. Yükseltmeden önce resmi listeleri baştan sona okumanız iyi bir alışkanlıktır.

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-11) – Minimal API, SignalR ve Blazor yenilikleri
- [Breaking changes in ASP.NET Core 11](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/11/overview) – ASP.NET Core kırıcı değişikliklerinin tam listesi
- [What's New in EF Core 11](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/whatsnew) – EF Core 11 yenilikleri
- [Breaking changes in EF Core 11](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/breaking-changes) – EF Core kırıcı değişiklikleri ve etkileri
