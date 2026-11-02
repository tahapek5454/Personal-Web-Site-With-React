---
title: "LangChain agent middleware: the sync vs async trap"
description: "Why a wrap_tool_call middleware raises NotImplementedError under ainvoke, and how to fix it."
date: 2026-11-02
topic: ai
tags: [langchain, agents, python]
draft: true
---

In LangChain agent middleware, the `@wrap_tool_call` decorator checks whether your function is sync or async and wires **only one** hook.

## The problem

A plain `def` fills only `wrap_tool_call`. If you run the agent with `ainvoke()` or `astream()`, `awrap_tool_call` is missing and the base class default raises `NotImplementedError`. The reverse is also true.

```python
from langchain.agents.middleware import wrap_tool_call

@wrap_tool_call
def log_tool(request, handler):  # sync: NotImplementedError under ainvoke
    print(request.tool_call["name"])
    return handler(request)
```

## The fix

Match the function to how you invoke the agent:

```python
@wrap_tool_call
async def log_tool(request, handler):
    print(request.tool_call["name"])
    return await handler(request)
```

If you need both invocation styles, subclass `AgentMiddleware` and implement `wrap_tool_call` and `awrap_tool_call` together.

## Summary

| Call | Middleware |
| --- | --- |
| `invoke` / `stream` | sync `def` |
| `ainvoke` / `astream` | `async def` + `await handler(request)` |
