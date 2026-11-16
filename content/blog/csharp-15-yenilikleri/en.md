---
title: "What's New in C# 15: Union Types, closed, and More"
description: "What are the union types, closed hierarchies, collection expression arguments, extension indexers, and labeled break/continue in C# 15, and when should you use them? This article answers these questions."
date: 2026-11-13
topic: dotnet
tags: [csharp, csharp-15, dotnet-11, union-types, pattern-matching]
draft: true
---

The main theme of C# 15 fits in one sentence: **express the allowed set of types explicitly in the type system, and let the compiler catch the missing case.** The long-awaited union types and the `closed` hierarchies that complement them sit at the center of this idea. On top of that, a few small but effective features simplify everyday code.

In the previous article, we took an [overview of .NET 11](/en/blog/dotnet-11-genel-bakis). In this one, we focus on the language itself. C# 15 is the default language version for projects targeting `net11.0`; the stable features here need no extra configuration.

## Union types

A union says that a value is **exactly one of a fixed set of types**. These types don't need any inheritance relationship with each other.

### The problem

Let's say a payment operation has three outcomes: succeeded, declined, failed. Until now, our options weren't great:

- Return `object`: no type safety.
- A shared interface or abstract base class: anyone can derive from it, so a `switch` is never "complete".
- Third-party libraries like `OneOf`: no language support.

### The solution

```csharp
public record class PaymentSucceeded(string TransactionId, decimal Amount);
public record class PaymentDeclined(string Reason);
public record class PaymentFailed(Exception Error);

public union PaymentResult(PaymentSucceeded, PaymentDeclined, PaymentFailed);
```

The single-line `union` declaration defines a new type and provides an **implicit conversion** from each case type to the union. So we can return a case type directly from a method:

```csharp
PaymentResult Charge(decimal amount)
{
    if (amount <= 0)
        return new PaymentDeclined("Amount must be greater than zero");

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

On the consuming side, a `switch` is considered **exhaustive** once all cases are handled; there's no need for a `_` or `default` arm:

```csharp
string message = Charge(149.90m) switch
{
    PaymentSucceeded ok   => $"Payment received: {ok.TransactionId}",
    PaymentDeclined  no   => $"Declined: {no.Reason}",
    PaymentFailed    fail => $"Error: {fail.Error.Message}",
};
```

The real payoff shows up during maintenance: if you add `PaymentPending` to the union tomorrow, the compiler flags this `switch`, and every other match, as **incomplete**.

### Generic unions

Unions can be generic and can have a body. The content is accessed through the `Value` property. For example, we can write our own `Option<T>` type in a few lines:

```csharp
public record class None;
public record class Some<T>(T Value);
public union Option<T>(None, Some<T>);

static Option<User> FindUser(int id) =>
    id == 1 ? new Some<User>(new User(1, "Taha")) : new None();
```

### What happens behind the scenes?

A `union` declaration is really a shorthand. The compiler generates a **struct** with a constructor for each case and a `Value` property of type `object?` that holds the content. This has two practical consequences:

- **Boxing:** Because the content is stored as `object?`, value-type cases like `int` get boxed. Watch out for this on hot paths.
- **Default value:** Since a union is a struct, `default(PaymentResult)` is valid and its `Value` is `null`. If a case is nullable, the `switch` needs a `null` arm.

In performance-critical scenarios, you can avoid boxing by writing your own union type with the `[Union]` attribute and implementing the `TryGetValue` pattern. This is an advanced topic; you'll find the details in the documentation listed in the resources.

## Closed hierarchies: `closed`

Unions bring together **existing, unrelated** types. If you own the inheritance hierarchy, you get the same guarantee with `closed`. `closed` restricts **direct** derivation from a class to the assembly in which it's declared:

```csharp
public closed record class OrderState;
public record class Draft : OrderState;
public record class Submitted(DateTime At) : OrderState;
public record class Shipped(string TrackingNo) : OrderState;
public record class Cancelled(string Reason) : OrderState;
```

If you try to derive from `OrderState` in another assembly, you get a compile error. Because the compiler knows all direct subtypes, the `switch` is again exhaustive without a default arm:

```csharp
static string Describe(OrderState state) => state switch
{
    Draft                 => "Draft",
    Submitted(var at)     => $"Submitted ({at:d})",
    Shipped(var tracking) => $"Shipped: {tracking}",
    Cancelled(var reason) => $"Cancelled: {reason}",
};
```

There are a few rules to know:

- A `closed` class is **implicitly abstract**; it can't be combined with `sealed`, `static`, or `abstract`.
- It only applies to classes (including record classes).
- **It isn't transitive:** A type deriving from a closed class isn't automatically closed. If you don't want subtypes to be extended, make them `sealed`.
- `closed` is now a contextual keyword. If your code has a type with this name, you need to escape it as `@closed`.

### Union or closed?

| Situation | Choice |
|---|---|
| You're combining existing or unrelated types | Union |
| You own the inheritance relationship and want shared base members | `closed` |

## Collection expression arguments: `with(...)`

Collection expressions (`[1, 2, 3]`) have existed since C# 12, but there was no way to pass arguments to the underlying collection's constructor. Whenever we wanted to pass a capacity or comparer, we had to fall back to the old syntax.

In C# 15, we write `with(...)` as the first element; the arguments are forwarded to the constructor:

```csharp
List<string> list = [with(capacity: source.Length * 2), .. source];

HashSet<string> emails =
    [with(StringComparer.OrdinalIgnoreCase), "Taha@Example.com", "taha@example.com"];

Console.WriteLine(emails.Count); // 1
```

`with(...)` must be the **first element**. Its most practical use is collections that need a comparer, such as case-insensitive sets and lists.

## Extension indexers

C# 14 brought extension properties through `extension` blocks. C# 15 adds **indexers** to the mix, so we can define indexers on types we don't own:

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

int mouse = stock["mouse", 0]; // 0 if the key is missing
```

In this example:

- The `extension` block adds a new member to `IReadOnlyDictionary`.
- The indexer returns the given fallback value when the key isn't found.
- Because indexers are instance members, the receiver parameter (`source`) must be **named**.

A small warning: indexer syntax gives readers a sense of O(1) access. Keep that in mind when hiding an O(n) operation behind an indexer.

## Labeled `break` and `continue`

Until now, breaking out of nested loops meant a flag variable, `goto`, or extracting a method. Now we can label the loop and target it directly:

```csharp
scan: foreach (var warehouse in warehouses)
{
    foreach (var bin in warehouse.Bins)
    {
        if (bin.Sku == sku && bin.Quantity > 0)
        {
            reserved = Reserve(bin);
            break scan; // exits both loops
        }
    }
}
```

You can also jump to the next iteration of the outer loop with `continue rows;`. A labeled `break` can target a loop or a `switch`, while a labeled `continue` can only target a loop. Unlabeled usage still targets the innermost construct, as before.

The new **IDE0410** analyzer finds flag and `goto` patterns and suggests converting them to labeled jumps.

## Other features

- **Static interface members on older runtimes:** Non-virtual static interface members can be used even when the target runtime doesn't support default interface implementations. Especially useful for library authors.
- **Memory safety (preview):** A multi-release effort begins that moves `unsafe` from meaning "there's a pointer here" to "there's a contract here that the compiler can't verify". Since the model and syntax may change in C# 16, it's for experimentation only for now.

## Summary

| Feature | When to use it | Status |
|---|---|---|
| Union types | Returning "one of these" from unrelated types | Stable |
| `closed` | Exhaustive `switch` over your own hierarchy | Stable |
| `with(...)` | Capacity or comparer in a collection expression | Stable |
| Extension indexer | Adding an indexer to a type you don't own | Stable |
| Labeled `break`/`continue` | Controlling nested loops | Stable |
| Memory safety | Auditability of unsafe code | Preview |

## Conclusion

C# 15 makes domain modeling safer, especially with union types and `closed` hierarchies. We can now express "this value can be one of these" in the type system instead of in comments, and catch missing cases at compile time.

In the next article, we go one layer below the language: [runtime, libraries, and SDK](/en/blog/dotnet-11-runtime-kutuphaneler-sdk). We'll look at Runtime Async, the new Process APIs, and what's new in `System.Text.Json`. See you in the next article.

## Resources

Features like union types and `closed` hierarchies have quite detailed edge cases. Before moving an example into your own project, it's good practice to verify it against the official documentation.

- [What's new in C# 15](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-15) – Official summary of C# 15 features
- [Explore union types in C# 15](https://devblogs.microsoft.com/dotnet/csharp-15-union-types/) – Design and use cases of union types
- [Union types - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/union) – All the details, including the non-boxing custom union pattern
- [closed modifier - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/closed) – Rules and restrictions of `closed`
- [Jump statements - C# reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/jump-statements) – Labeled `break` and `continue`
