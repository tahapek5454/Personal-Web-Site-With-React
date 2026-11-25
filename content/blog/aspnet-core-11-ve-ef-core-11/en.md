---
title: "ASP.NET Core 11 and EF Core 11: What's New and Breaking Changes"
description: "ASP.NET Core 11 adds async validation, union support, OpenAPI 3.2 and SignalR token refresh; EF Core 11 brings cleaner SQL. New features and breaking changes."
date: 2026-11-15
topic: dotnet
tags: [aspnetcore, blazor, minimal-api, signalr, efcore, dotnet-11]
draft: false
---

In the web and data layer, the character of .NET 11 is **not "a big new framework" but "filling in the missing pieces"**. Validation became async, OpenAPI moved to the latest specification, SignalR learned to refresh tokens, and EF Core started generating cleaner SQL behind the scenes.

In the previous article, we covered the [runtime, libraries, and SDK](/en/blog/dotnet-11-runtime-kutuphaneler-sdk). In this final article of the series, we focus on the ASP.NET Core 11 and EF Core 11 features that matter most to API developers.

> **Scope of this article:** Blazor also gets many new features, such as `CacheView`, automatic circuit pausing, and `Virtualize` improvements. Here we touch on them briefly and put the emphasis on the API and data layer.

## Async validation in Minimal APIs

.NET 10 brought built-in validation to Minimal APIs. .NET 11 makes it async end to end. The `AsyncValidationAttribute` and `IAsyncValidatableObject` we saw in the previous article now run automatically:

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

    // This type is validated asynchronously only
    public IEnumerable<ValidationResult> Validate(ValidationContext context) =>
        throw new InvalidOperationException("Validate with ValidateAsync.");

    public async IAsyncEnumerable<ValidationResult> ValidateAsync(
        ValidationContext context,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var rooms = context.GetRequiredService<IRoomService>();

        if (!await rooms.HasAvailabilityAsync(Date, cancellationToken))
            yield return new ValidationResult("No rooms available on this date.", [nameof(Date)]);
    }
}
```

In this example:

- `AddValidation()` enables the validation infrastructure.
- `ValidateAsync` can query a database or service without blocking a thread.
- If validation fails, the framework produces the standard problem response itself; the endpoint body never runs.

## APIs with C# union types

ASP.NET Core supports C# 15 unions wherever it uses `System.Text.Json`. We can now express in the type system that an endpoint may return several different types:

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

The generated OpenAPI document describes the alternatives with an `anyOf` schema. There are two things to keep in mind, though:

- Support only applies to **JSON bodies**; it doesn't work for route, query, or form binding.
- Returning a union **doesn't change the HTTP status code**. The endpoint above returns 200 even in the "not found" case. If you want distinct status codes, `Results<Ok<Product>, NotFound>` is still the right tool; unions are better suited for modeling outcomes in the domain layer.

## OpenAPI 3.2 by default

Generated documents now target **OpenAPI 3.2** by default. With this version, event schemas in Server-Sent Events streams and the HTTP `QUERY` method can also be documented.

If your client generator or toolchain doesn't support 3.2 yet, you can go back to the previous version:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_1;
});
```

Since the underlying `Microsoft.OpenApi` package moved to 3.x, expect source-level breaks if you've written custom OpenAPI transformers.

## Other API updates

- **`[ShortCircuit]` attribute:** We can specify with an attribute that an endpoint skips the rest of the middleware pipeline. Ideal for lightweight endpoints such as health checks.
- **Zstandard compression:** Response compression and request decompression middleware support zstd.
- **Automatic CSRF protection:** In most cases, calling `app.UseAntiforgery()` is no longer necessary.

```csharp
app.MapGet("/health", [ShortCircuit] () => "Healthy");
```

## SignalR: authentication refresh without reconnecting

On long-lived connections, an expired token used to mean dropping and re-establishing the connection. Now the identity can be refreshed while the connection stays open:

```csharp
// Server
app.MapHub<ChatHub>("/chat", options =>
{
    options.EnableAuthenticationRefresh = true;
    options.CloseOnAuthenticationExpiration = true;
});

// Client
var connection = new HubConnectionBuilder()
    .WithUrl("https://example.com/chat")
    .WithAuthenticationRefresh(options =>
    {
        options.RefreshBeforeExpiration = TimeSpan.FromMinutes(1);
    })
    .Build();
```

The client refreshes the identity one minute before the token expires, and `Context.User` is updated on the server. In addition, a hub invocation started from the client with a `CancellationToken` can now be cancelled on the server side as well.

## A quick look at Blazor

The theme on the Blazor side is **letting static SSR handle more scenarios without an interactive connection**:

- **`CacheView`:** Caches the render output of a component subtree; a more fine-grained tool than full-page caching.
- **Automatic circuit pausing:** Server memory and the SignalR connection can be released while the tab is inactive.
- **Async form validation:** `EditForm` awaits async validators end to end.
- **`Virtualize`:** No longer assumes all items have the same height.

```razor
<CacheView VaryByQuery="category" ExpiresAfter="TimeSpan.FromMinutes(5)">
    <ProductList Category="@Category" />
</CacheView>
```

## EF Core 11

EF Core 11 only runs on .NET 11. Most of the gains in this release come from **better SQL without changing any code**.

### LINQ and SQL translation

.NET 11's new `FullJoin` operator translates directly to `FULL JOIN` in relational databases:

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

On top of that:

- Redundant joins and `ORDER BY` clauses are removed in queries that `Include` reference navigations; official measurements show improvements of 22-29%.
- `GroupBy` translation got smarter.
- `MaxBy` and `MinBy` are now translated to SQL.

### Tooling

- `dotnet ef database update --add` creates and applies a migration in a single step.
- `dotnet ef` can read default options from `.config/dotnet-ef.json`, so you no longer need to type `--project` and `--startup-project` every time.
- Log messages are now written to stderr; `dotnet ef migrations script > out.sql` produces clean SQL.

## Watch out when upgrading: breaking changes

| Change | What to do |
|---|---|
| `OpenApiVersion` defaults to 3.2 | Pick 3.1 if your tools don't support it |
| `ConcurrencyLimiter` middleware removed | Move to the rate limiting middleware |
| Kestrel tightened HTTP protocol compliance | Test non-standard clients |
| Response compression always sends `Vary: Accept-Encoding` | Check CDN and cache keys |
| `Microsoft.Data.SqlClient` 7.0 | Add the separate package if you use Entra ID |
| SQL Server compatibility level defaults to 160 | Set the level explicitly for older SQL Servers |
| EF throws if no migrations are found | Check scenarios without migrations |

The one that will affect the most people is **SqlClient 7.0**. If your connection string uses an Entra ID method such as `Authentication=Active Directory Default`, you need to add the package separately:

```bash
dotnet add package Microsoft.Data.SqlClient.Extensions.Azure
```

If you connect to a version older than SQL Server 2022, set the compatibility level explicitly:

```csharp
optionsBuilder.UseSqlServer(connectionString, o => o.UseCompatibilityLevel(150));
```

## Conclusion

Rather than flashy new features, ASP.NET Core 11 and EF Core 11 take steps that improve the everyday development experience. Async validation and SignalR authentication refresh offer official answers to needs we've worked around for years, while EF Core quietly improves the SQL it generates.

That brings us to the end of the .NET 11 and C# 15 series. Together with the [overview](/en/blog/dotnet-11-genel-bakis), [C# 15](/en/blog/csharp-15-yenilikleri), [runtime and libraries](/en/blog/dotnet-11-runtime-kutuphaneler-sdk), and this article, we've mapped out the release as a whole. See you in the next article.

## Resources

Breaking changes can affect projects differently depending on the providers they use. Reading the official lists from start to finish before upgrading is a good habit.

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-11) – Minimal API, SignalR, and Blazor features
- [Breaking changes in ASP.NET Core 11](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/11/overview) – The full list of ASP.NET Core breaking changes
- [What's New in EF Core 11](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/whatsnew) – What's new in EF Core 11
- [Breaking changes in EF Core 11](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/breaking-changes) – EF Core breaking changes and their impact
