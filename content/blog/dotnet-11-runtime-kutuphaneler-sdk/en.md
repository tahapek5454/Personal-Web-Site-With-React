---
title: ".NET 11 Runtime and SDK: Runtime Async, LINQ FullJoin, New APIs"
description: "What changed under the hood in .NET 11: Runtime Async (preview), one-line Process APIs, LINQ FullJoin, Zstandard, System.Text.Json and SDK updates, with code."
date: 2026-11-14
topic: dotnet
tags: [dotnet, dotnet-11, runtime, linq, system-text-json, sdk]
draft: false
---

The impact of a .NET release is often felt less in new language features and more in **the runtime underneath and the libraries we use every day**. .NET 11 is no different: some gains arrive without changing a single line of code, while others offer ready-made solutions to problems we've been solving by hand for years.

In the previous article, we covered [what's new in C# 15](/en/blog/csharp-15-yenilikleri). In this one, we go one layer below the language: the runtime, the core libraries, and the SDK.

> **Scope of this article:** The list of changes in this layer is quite long. Here I've picked only the ones that will affect everyday code the most. For details on numeric types, cryptography, and networking, check the official documentation listed in the resources.

## Runtime Async (preview)

This is the biggest architectural change in the release. Until now, the `async`/`await` transformation was done by **the C# compiler**: a state machine type was generated for every async method. Runtime Async moves this work **to the runtime and the JIT**.

The programming model doesn't change; `await`, exception, and cancellation behavior stay the same. What changes is the code generated behind the scenes. This has three concrete benefits:

- **Cleaner call stacks:** Profilers and debuggers now see the actual methods instead of state machine plumbing. The official example goes from 13 frames down to 5.
- **Smaller binaries:** In an example with ten async methods calling each other, the DLL size drops by almost half.
- **Fewer allocations:** Intermediate `Task` objects largely disappear.

In .NET 11, this feature is a **preview** and opt-in. To try it, adding this to the project file is enough:

```xml
<PropertyGroup>
  <Features>$(Features);runtime-async=on</Features>
</PropertyGroup>
```

An interesting detail: .NET's own libraries are already compiled in this mode. So even if you don't enable it, you're indirectly using it through framework calls. Before enabling it in production, I recommend testing your dependencies and diagnostic tools on a separate branch.

## JIT and runtime improvements

You don't need to change any code for the gains in this section:

- More redundant bounds checks are eliminated.
- Generic virtual methods can now be **devirtualized**.
- Interface dispatch in Native AOT is faster, and the code at call sites is smaller.
- On Linux and macOS, a managed stack trace can be captured before the process crashes.

## Process: running a process in a single line

Starting a process and capturing its output without deadlocking used to be surprisingly hard. Now it's a single line:

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

In this example:

- `RunAndCaptureTextAsync` starts the process, waits for it to finish, and collects stdout and stderr together.
- `ExitStatus` describes how the process ended (exit code, signal, cancellation).
- On timeout or cancellation, it tries to terminate the process automatically.

If you don't need the output, use `Process.Run`; to fire and forget, use `Process.StartAndForget`. And to terminate the child when the parent dies, there's the new `ProcessStartInfo.KillOnParentExit` property.

## LINQ: `FullJoin`

.NET 10 brought `LeftJoin` and `RightJoin`; .NET 11 completes the set with `FullJoin`. Join methods also now have overloads that return tuples directly, without needing a result selector.

A typical use case is reconciliation: comparing two lists and seeing what's missing on either side.

```csharp
foreach (var (inErp, inWarehouse) in erp.FullJoin(warehouse, e => e.Sku, w => w.Sku))
{
    string sku = inErp?.Sku ?? inWarehouse!.Sku;
    Console.WriteLine($"{sku}: ERP={inErp?.Qty}, Warehouse={inWarehouse?.Qty}");
}
```

The unmatched side comes back as `default`. That's why using reference types or nullables matters if you want to tell "missing" apart from "zero". There's also a significant performance difference compared with a hand-written `GroupJoin` + `Concat` solution: from 27.6 ms down to 1.7 ms in the official benchmark.

A similar simplification applies to equality comparers. You no longer need to write a class for key-based equality:

```csharp
var byEmail = EqualityComparer<User>.Create(u => u.Email);
HashSet<User> users = [with(byEmail), .. source];
```

## System.Text.Json

**C# union support.** C# 15 unions can be serialized directly. There's no wrapper or `$type` field in the JSON; the content is written as is:

```csharp
public union Reading(int, string);

Reading reading = "hello";
string json = JsonSerializer.Serialize(reading); // "hello"
```

If more than one case has the same JSON shape (for example, an object), you need to define a classifier with `[JsonUnion]` to decide which one to pick. The built-in structural classifier can choose the right type by looking at property names.

**JSON Lines (JSONL).** You can now write an `IAsyncEnumerable<T>` as one value per line instead of a single array:

```csharp
await JsonSerializer.SerializeAsyncEnumerable(
    writer,
    ReadEventsAsync(),
    topLevelValues: true);
```

This is quite handy for scenarios like log streams and LLM training/output files.

## Async validation

Validation rules that need to check a database or a remote service no longer have to block a thread. We can write an async rule by deriving from `AsyncValidationAttribute`:

```csharp
public sealed class UniqueEmailAttribute : AsyncValidationAttribute
{
    protected override async Task<ValidationResult?> IsValidAsync(
        object? value, ValidationContext context, CancellationToken cancellationToken)
    {
        var users = context.GetRequiredService<IUserService>();

        if (value is string email && await users.EmailExistsAsync(email, cancellationToken))
            return new ValidationResult("This email is already registered.");

        return ValidationResult.Success;
    }
}
```

ASP.NET Core Minimal APIs and Blazor forms use this infrastructure automatically; we'll look at that integration in the next article.

## Other library updates

| Area | What's new |
|---|---|
| Compression | `ZstandardStream` now lives in `System.IO.Compression`; CRC32 validation for ZIP |
| Streams | Zero-copy stream adapters such as `StringStream` and `ReadOnlyMemoryStream` |
| Numeric types | `Decimal32/64/128`, `BFloat16`, generic `Complex<T>` |
| Security | X25519 key exchange, TLS hardening |
| Observability | Built-in OpenTelemetry metrics for `MemoryCache` |

## SDK and tooling

### A faster CLI

Two changes are on by default: thanks to the **Native AOT-compiled CLI host**, commands like `dotnet --version` respond instantly, and the **MSBuild server** stays warm between invocations.

### File-based apps grow up

Single-file apps introduced in .NET 10 can now span multiple files with `#:include`:

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

Working without a project file is now much more realistic for small tools and scripts.

### Supply chain: minimum package age

We can tell a NuGet source to "wait a certain amount of time before using newly published versions". It's a simple but effective safeguard against a compromised package entering your build the moment it's published:

```bash
dotnet nuget add source https://api.nuget.org/v3/index.json \
  --name public --min-publish-age-hours 24 --configfile nuget.config
```

### Small but handy

- Passing environment variables with `dotnet run -e KEY=VALUE`.
- Run-level options such as `dotnet test --timeout 90s` and `--maximum-failed-tests 5`.
- A server template using the official MCP C# SDK via `dotnet new mcpserver`.

## Conclusion

Most of the changes in this layer are "gains without writing code": a smarter JIT, a faster CLI, fewer allocations. If I had to pick three things that will pay off right away in code, I'd choose `Process.RunAndCaptureTextAsync`, `FullJoin`, and async validation. Runtime Async is worth trying; making it the default is probably a topic for the next release.

In the next and final article of the series, we look at the web and data layer: [ASP.NET Core 11 and EF Core 11](/en/blog/aspnet-core-11-ve-ef-core-11). See you in the next article.

## Resources

Preview features (especially Runtime Async) may change in later releases. Before taking them to production, it's good practice to verify them against the official documentation.

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/runtime) – Runtime Async, JIT, and runtime changes
- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/libraries) – Process, LINQ, System.Text.Json, and other libraries
- [What's new in the SDK and tooling for .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk) – CLI, file-based apps, and NuGet
- [Performance Improvements in .NET 11](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-11/) – In-depth analysis of performance improvements
- [Process API Improvements in .NET 11](https://devblogs.microsoft.com/dotnet/process-api-improvements-in-dotnet-11/) – Design of the new Process APIs
