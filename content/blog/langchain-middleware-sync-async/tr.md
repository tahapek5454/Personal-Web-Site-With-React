---
title: "LangChain agent middleware: sync ve async tuzağı"
description: "wrap_tool_call ile yazdığın middleware ainvoke ile çalışırken neden NotImplementedError verir ve nasıl düzeltilir."
date: 2026-11-02
topic: ai
tags: [langchain, agents, python]
draft: true
---

LangChain agent middleware'lerinde `@wrap_tool_call` dekoratörü, fonksiyonun senkron mu asenkron mu olduğuna bakar ve yalnızca **bir** hook'u bağlar.

## Sorun

Senkron bir `def` fonksiyonu yalnızca `wrap_tool_call` hook'unu doldurur. Agent'ı `ainvoke()` veya `astream()` ile çalıştırırsan `awrap_tool_call` eksik kalır ve taban sınıfın varsayılanı `NotImplementedError` fırlatır. Tersi de geçerlidir.

```python
from langchain.agents.middleware import wrap_tool_call

@wrap_tool_call
def log_tool(request, handler):  # sync: ainvoke ile NotImplementedError
    print(request.tool_call["name"])
    return handler(request)
```

## Çözüm

Fonksiyonu agent'ı çağırma biçimine göre eşle:

```python
@wrap_tool_call
async def log_tool(request, handler):
    print(request.tool_call["name"])
    return await handler(request)
```

İki çağrı biçimine de ihtiyaç varsa `AgentMiddleware` alt sınıfı oluşturup `wrap_tool_call` ve `awrap_tool_call` metotlarını birlikte yaz.

## Özet

| Çağrı | Middleware |
| --- | --- |
| `invoke` / `stream` | senkron `def` |
| `ainvoke` / `astream` | `async def` + `await handler(request)` |
