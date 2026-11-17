---
title: "C# 15 Yenilikleri: Union Tipleri, closed ve Daha Fazlası"
description: "C# 15 ile gelen union tipleri, kapalı hiyerarşiler, koleksiyon ifadesi argümanları, extension indexerlar ve etiketli break/continue nedir, ne zaman kullanılır? Sorularına cevap arıyoruz."
date: 2026-11-13
topic: dotnet
tags: [csharp, csharp-15, dotnet-11, union-types, pattern-matching]
draft: false
---

C# 15'in ana teması tek cümleyle özetlenebilir: **izin verilen tip kümesini tip sisteminde açıkça ifade et, eksik durumu derleyici yakalasın.** Yıllardır beklenen union tipleri ve onu tamamlayan `closed` hiyerarşiler bu fikrin merkezinde. Bunlara ek olarak günlük kodu sadeleştiren birkaç küçük ama etkili özellik daha geliyor.

Önceki yazıda [.NET 11'e genel bakış](/blog/dotnet-11-genel-bakis) yapmıştık. Bu yazıda ise dilin kendisine odaklanıyoruz. C# 15, `net11.0` hedefleyen projelerde varsayılan dil sürümü; buradaki kararlı özellikler için ek bir ayar gerekmiyor.

## Union tipleri

Bir union, değerin **sabit bir tip kümesinden tam olarak biri** olduğunu söyler. Bu tiplerin birbiriyle kalıtım ilişkisi olması gerekmez.

### Sorun

Bir ödeme işleminin üç sonucu olsun: başarılı, reddedildi, hata. Bugüne kadar elimizdeki seçenekler pek iç açıcı değildi:

- `object` döndürmek: tip güvenliği yok.
- Ortak bir interface ya da soyut taban sınıf: herkes türetebilir, `switch` hiçbir zaman "tam" sayılmaz.
- `OneOf` gibi üçüncü parti kütüphaneler: dil desteği yok.

### Çözüm

```csharp
public record class PaymentSucceeded(string TransactionId, decimal Amount);
public record class PaymentDeclined(string Reason);
public record class PaymentFailed(Exception Error);

public union PaymentResult(PaymentSucceeded, PaymentDeclined, PaymentFailed);
```

Tek satırlık `union` bildirimi yeni bir tip tanımlar ve her case tipinden union'a **örtük dönüşüm** sağlar. Yani metottan doğrudan case tipini döndürebiliriz:

```csharp
PaymentResult Charge(decimal amount)
{
    if (amount <= 0)
        return new PaymentDeclined("Tutar sıfırdan büyük olmalı");

    try
    {
        return new PaymentSucceeded(Gateway.Charge(amount), amount);
    }
    catch (Exception ex)
    {
        return new PaymentFailed(ex);
    }
}
```

Tüketen tarafta `switch`, tüm case'ler ele alındığında **exhaustive** kabul edilir; `_` ya da `default` koluna gerek kalmaz:

```csharp
string message = Charge(149.90m) switch
{
    PaymentSucceeded ok   => $"Ödeme alındı: {ok.TransactionId}",
    PaymentDeclined  no   => $"Reddedildi: {no.Reason}",
    PaymentFailed    fail => $"Hata: {fail.Error.Message}",
};
```

Asıl kazanç bakım sırasında ortaya çıkar: yarın union'a `PaymentPending` eklerseniz derleyici bu `switch`'i ve diğer tüm eşleştirmeleri **eksik** diye işaretler.

### Generic union'lar

Union'lar generic olabilir ve gövde içerebilir. İçeriğe `Value` özelliğiyle erişilir. Örneğin kendi `Option<T>` tipimizi birkaç satırda yazabiliriz:

```csharp
public record class None;
public record class Some<T>(T Value);
public union Option<T>(None, Some<T>);

static Option<User> FindUser(int id) =>
    id == 1 ? new Some<User>(new User(1, "Taha")) : new None();
```

### Arka planda ne oluyor?

`union` bildirimi aslında bir kısaltma. Derleyici her case için bir constructor'ı ve içeriği tutan `object?` tipinde bir `Value` özelliğini barındıran bir **struct** üretir. Bundan iki pratik sonuç çıkar:

- **Boxing:** İçerik `object?` olarak saklandığı için `int` gibi değer tipi case'ler kutulanır. Sıcak yollarda buna dikkat etmek gerekir.
- **Varsayılan değer:** Union bir struct olduğu için `default(PaymentResult)` geçerlidir ve `Value`'su `null` olur. Nullable bir case varsa `switch`'e `null` kolu eklemek gerekir.

Performansın kritik olduğu senaryolarda `[Union]` attribute'u ile kendi union tipinizi yazıp `TryGetValue` desenini uygulayarak boxing'den kaçınabilirsiniz. Bu, ileri seviye bir konu; detayları kaynaklardaki dokümantasyonda bulabilirsiniz.

## Kapalı hiyerarşiler: `closed`

Union'lar **mevcut ve ilişkisiz** tipleri bir araya getirir. Kalıtım hiyerarşisinin sahibi sizseniz aynı garantiyi `closed` ile alırsınız. `closed`, bir sınıftan **doğrudan** türetmeyi bildirildiği assembly ile sınırlar:

```csharp
public closed record class OrderState;
public record class Draft : OrderState;
public record class Submitted(DateTime At) : OrderState;
public record class Shipped(string TrackingNo) : OrderState;
public record class Cancelled(string Reason) : OrderState;
```

Başka bir assembly'den `OrderState`'ten türetmeye çalışırsanız derleme hatası alırsınız. Derleyici tüm doğrudan alt tipleri bildiği için `switch` yine varsayılan kol olmadan exhaustive olur:

```csharp
static string Describe(OrderState state) => state switch
{
    Draft                 => "Taslak",
    Submitted(var at)     => $"Gönderildi ({at:d})",
    Shipped(var tracking) => $"Kargoda: {tracking}",
    Cancelled(var reason) => $"İptal: {reason}",
};
```

Bilinmesi gereken birkaç kural var:

- `closed` bir sınıf **örtük olarak abstract**'tır; `sealed`, `static` ya da `abstract` ile birleştirilemez.
- Yalnızca sınıflara (record class dahil) uygulanır.
- **Geçişli değildir:** Kapalı bir sınıftan türeyen tip kendiliğinden kapalı olmaz. Alt tiplerin genişletilmesini istemiyorsak onları `sealed` yapmamız gerekiyor.
- `closed` artık bağlamsal bir anahtar sözcük. Kodunuzda bu isimde bir tip varsa `@closed` şeklinde kaçış gerekir.

### Union mu, closed mı?

| Durum | Tercih |
|---|---|
| Var olan ya da birbiriyle ilişkisiz tipleri birleştiriyorsanız | Union |
| Kalıtım ilişkisinin sahibiyseniz ve ortak taban üyeleri istiyorsanız | `closed` |

## Koleksiyon ifadesi argümanları: `with(...)`

Koleksiyon ifadeleri (`[1, 2, 3]`) C# 12'den beri var, ancak alttaki koleksiyonun constructor'ına argüman geçmenin bir yolu yoktu. Kapasite ya da comparer vermek istediğimizde eski sözdizimine dönmemiz gerekiyordu.

C# 15'te ilk eleman olarak `with(...)` yazıyoruz; argümanlar constructor'a iletiliyor:

```csharp
List<string> list = [with(capacity: source.Length * 2), .. source];

HashSet<string> emails =
    [with(StringComparer.OrdinalIgnoreCase), "Taha@Example.com", "taha@example.com"];

Console.WriteLine(emails.Count); // 1
```

`with(...)` mutlaka **ilk eleman** olmalıdır. En pratik kullanım alanı, büyük/küçük harf duyarsız set ve listeler gibi comparer gerektiren koleksiyonlar.

## Extension indexerlar

C# 14, `extension` bloklarıyla extension property'leri getirmişti. C# 15 buna **indexer**'ı ekliyor. Böylece sahibi olmadığımız tiplere indexer tanımlayabiliyoruz:

```csharp
public static class DictionaryExtensions
{
    extension<TKey, TValue>(IReadOnlyDictionary<TKey, TValue> source)
        where TKey : notnull
    {
        public TValue this[TKey key, TValue fallback] =>
            source.TryGetValue(key, out var value) ? value : fallback;
    }
}

int mouse = stock["mouse", 0]; // anahtar yoksa 0
```

Bu örnekte:

- `extension` bloğu, `IReadOnlyDictionary` üzerine yeni bir üye ekler.
- Indexer, anahtar bulunamazsa verilen varsayılan değeri döndürür.
- Indexer'lar örnek üyesi olduğu için alıcı parametresinin (`source`) **isimli** olması zorunludur.

Küçük bir uyarı: indexer sözdizimi okuyana O(1) erişim hissi verir. O(n) bir işlemi indexer arkasına saklarken bunu akılda tutmakta fayda var.

## Etiketli `break` ve `continue`

İç içe döngülerden çıkmak için bugüne kadar bayrak değişkeni, `goto` ya da metot çıkarma kullanıyorduk. Artık döngüyü etiketleyip doğrudan hedef gösterebiliyoruz:

```csharp
scan: foreach (var warehouse in warehouses)
{
    foreach (var bin in warehouse.Bins)
    {
        if (bin.Sku == sku && bin.Quantity > 0)
        {
            reserved = Reserve(bin);
            break scan; // iki döngüden birden çıkar
        }
    }
}
```

`continue rows;` ile dış döngünün bir sonraki turuna atlamak da mümkün. Etiketli `break` bir döngüyü ya da `switch`'i, etiketli `continue` ise yalnızca döngüyü hedefleyebilir. Etiketsiz kullanım eskisi gibi en içteki yapıyı hedefler.

Yeni **IDE0410** analizörü, bayrak ve `goto` desenlerini bulup etiketli atlamaya çevirmeyi öneriyor.

## Diğer yenilikler

- **Eski runtime'larda statik interface üyeleri:** Hedef runtime varsayılan interface implementasyonlarını desteklemese bile, sanal olmayan statik interface üyeleri kullanılabiliyor. Özellikle kütüphane yazarları için faydalı.
- **Bellek güvenliği (önizleme):** `unsafe` kavramını "burada pointer var" anlamından çıkarıp "burada derleyicinin doğrulayamadığı bir sözleşme var" anlamına taşıyan çok sürümlü bir çalışma başlıyor. Model ve sözdizimi C# 16'da değişebileceği için şimdilik yalnızca denemelik.

## Özet

| Özellik | Ne zaman kullanılır? | Durum |
|---|---|---|
| Union tipleri | İlişkisiz tiplerden "şunlardan biri" döndürmek | Kararlı |
| `closed` | Kendi hiyerarşinizde exhaustive `switch` | Kararlı |
| `with(...)` | Koleksiyon ifadesinde kapasite ya da comparer | Kararlı |
| Extension indexer | Sahibi olmadığınız tipe indexer eklemek | Kararlı |
| Etiketli `break`/`continue` | İç içe döngü kontrolü | Kararlı |
| Bellek güvenliği | Unsafe kodun denetlenebilirliği | Önizleme |

## Kapanış

C# 15, özellikle union tipleri ve `closed` hiyerarşilerle domain modellemeyi daha güvenli hâle getiriyor. "Bu değer şunlardan biri olabilir" bilgisini artık yorum satırlarında değil, tip sisteminde ifade edebiliyor ve eksik durumları derleme anında yakalayabiliyoruz.

Bir sonraki yazıda dilin altındaki katmana iniyoruz: [runtime, kütüphaneler ve SDK](/blog/dotnet-11-runtime-kutuphaneler-sdk). Runtime Async, yeni Process API'leri ve `System.Text.Json` yeniliklerine göz atacağız. Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Union tipleri ve `closed` hiyerarşiler gibi özelliklerin kenar durumları oldukça detaylı. Örnekleri kendi projenize taşımadan önce resmi dokümantasyondan doğrulamanız iyi bir alışkanlıktır.

- [What's new in C# 15](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-15) – C# 15 özelliklerinin resmi özeti
- [Explore union types in C# 15](https://devblogs.microsoft.com/dotnet/csharp-15-union-types/) – Union tiplerinin tasarımı ve kullanım senaryoları
- [Union types - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/union) – Boxing'siz özel union deseni dahil tüm detaylar
- [closed modifier - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/closed) – `closed` kuralları ve kısıtlamaları
- [Jump statements - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/jump-statements) – Etiketli `break` ve `continue`
