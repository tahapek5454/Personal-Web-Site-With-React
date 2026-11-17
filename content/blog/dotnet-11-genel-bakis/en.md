---
title: ".NET 11 Is Here: Overview and Upgrade Guide"
description: "What's new in .NET 11, how long is it supported, which requirements changed, and how do you upgrade a project? This article answers these questions."
date: 2026-11-12
topic: dotnet
tags: [dotnet, dotnet-11, csharp-15, upgrade]
draft: false
---

.NET 11 was released on November 10, 2026, alongside .NET Conf 2026. Rather than a single headline feature, this release brings **complementary improvements across the language, runtime, libraries, and web stack**. Before deciding to upgrade, it's worth knowing the release's support model, its requirements, and its breaking changes.

This article is the first stop in the .NET 11 and C# 15 series. Here we draw the big picture of the release and talk about how to move a project to .NET 11.

> **Scope of this series:** The series has four parts: overview and upgrade (this article), [C# 15 features](/en/blog/csharp-15-yenilikleri), [runtime, libraries, and SDK](/en/blog/dotnet-11-runtime-kutuphaneler-sdk), and [ASP.NET Core 11 and EF Core 11](/en/blog/aspnet-core-11-ve-ef-core-11). Think of this article as the series' **map**; the details come in the following articles.

## Release identity: STS

.NET 11 is a **Standard Term Support (STS)** release and is supported for two years. Microsoft stresses one point: there's no difference in quality or servicing between STS and LTS, only in the length of support.

| Version | Type | Status |
|---|---|---|
| .NET 11 | STS | Released November 10, 2026, two years of support |
| .NET 10 | LTS | Supported |
| .NET 9 | STS | Support ended November 10, 2026 |
| .NET 8 | LTS | Support ended November 10, 2026 |

If you're on .NET 8 or .NET 9, you no longer receive security patches. Since support for .NET 10 and .NET 11 ends at roughly the same time (November 2028), the decision is less about "long support or new features" and more about **"do I need C# 15 and the new APIs?"**

## Highlights

Here's the overall map of the release:

- **C# 15:** Union types, closed hierarchies (`closed`), collection expression arguments (`with(...)`), extension indexers, and labeled `break`/`continue`.
- **Runtime:** JIT improvements, faster interface dispatch in Native AOT, and **Runtime Async** as a preview.
- **Libraries:** Zstandard compression, running a process in a single line, LINQ `FullJoin`, union and JSON Lines support in `System.Text.Json`.
- **SDK:** A faster CLI and file-based apps that can span multiple files.
- **ASP.NET Core:** Async validation, OpenAPI 3.2 by default, and SignalR authentication refresh without reconnecting.
- **EF Core 11:** Cleaner SQL and `FullJoin` translation.
- **.NET MAUI:** The default mobile runtime is now CoreCLR instead of Mono.

## Requirements

There are no big surprises on the development side: the **.NET 11 SDK** plus an up-to-date **Visual Studio 2026** or **VS Code + C# Dev Kit** is enough. C# 15 is the default language version for projects targeting `net11.0`; there's no need to set `LangVersion`.

```bash
dotnet --version
dotnet new console -n HelloDotnet11 -f net11.0
dotnet run --project HelloDotnet11
```

### Hardware: x86-64-v2 is now required

The breaking change that deserves the most attention in this release is on the hardware side. On x86/x64, the baseline was raised **from x86-64-v1 to x86-64-v2**; the processor must support instruction sets such as SSE4.2 and POPCNT. On a machine that doesn't, the app won't start at all:

```text
The current CPU is missing one or more of the baseline instruction sets.
```

This level covers every processor Intel and AMD still support, and Windows 11 already requires it. Still, if you're running on **an old virtualization layer or very old physical servers**, it's worth checking before you deploy.

## Breaking changes

The full list is in the official documentation. In practice, these are the ones you're most likely to run into:

| Area | Change |
|---|---|
| Runtime | Minimum hardware is x86-64-v2; `unchecked` conversions from `float`/`double` to small integer types now saturate instead of wrapping |
| C# | `closed` became a contextual keyword; a type with this name needs `@closed` |
| ASP.NET Core | OpenAPI 3.2 by default, `ConcurrencyLimiter` removed, stricter Kestrel HTTP compliance |
| EF Core | `Microsoft.Data.SqlClient` 7.0; Entra ID authentication moved to a separate package |
| .NET MAUI | CoreCLR on mobile; minimum Android API level 24 |

We cover the web and data layer changes in more detail in the last article of the series.

## Upgrade steps

Microsoft's recommended path has four steps.

**1. Update the SDK.** If the repository has a `global.json`, update the version and install the same SDK on developer machines and build agents.

```json
{
  "sdk": {
    "version": "11.0.100",
    "rollForward": "latestFeature"
  }
}
```

Installing the SDK alone doesn't retarget your app; you can keep building `net10.0` projects with the .NET 11 SDK.

**2. Change the target framework.**

```xml
<PropertyGroup>
  <TargetFramework>net11.0</TargetFramework>
</PropertyGroup>
```

Then update packages and workloads:

```bash
dotnet list package --outdated
dotnet workload update
```

EF Core 11 only runs on .NET 11; make sure a compatible version of your provider (Npgsql, Pomelo, etc.) has been released.

**3. Review the breaking changes.** In particular, compare the minimum CPU requirement against your deployment environment.

**4. Validate.** Run your tests, measure under a representative load, and update the base image if you use containers:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:11.0 AS base
FROM mcr.microsoft.com/dotnet/sdk:11.0 AS build
```

## Stay on .NET 10 or move to 11?

| Situation | Recommendation |
|---|---|
| You're on .NET 8 / 9 | Upgrade now; both are out of support |
| You're on .NET 10 and upgrading is costly | You can stay on .NET 10 |
| You need union types, async validation, OpenAPI 3.2, etc. | .NET 11 |
| You can upgrade once a year | .NET 11, then .NET 12 (LTS) |

## Conclusion

Despite being an STS release, .NET 11 isn't a minor interim version; it brings the long-awaited union types to the language and many speed- and simplicity-focused improvements to the platform. The most important thing to watch before upgrading is the new hardware baseline.

In the next article, we focus on the language itself: [C# 15 features](/en/blog/csharp-15-yenilikleri). We'll explore union types, `closed` hierarchies, and the other new features with examples. See you in the next article.

## Resources

The behaviors and defaults described here may change in later servicing releases. Checking the official documentation before upgrading is a good habit.

- [Announcing .NET 11](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/) – Release announcement and highlights
- [What's new in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) – Official summary of all new features
- [Breaking changes in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/compatibility/11) – The full list of breaking changes
- [Minimum hardware requirements updated](https://learn.microsoft.com/en-us/dotnet/core/compatibility/jit/11/minimum-hardware-requirements) – Details of the x86-64-v2 requirement
