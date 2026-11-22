---
title: "Defining Tools in LangChain: Connecting Agents to the World"
description: "What is a tool in LangChain, how do we define one with @tool, and how do schemas, return values, error handling and dynamic tool selection work? This article answers these questions."
date: 2026-11-22
topic: ai
tags: [langchain, agents, tools, python]
draft: false
---

An LLM on its own can generate text, but it can't check today's weather, connect to your database, create a file or look up an order status. **Tools are well-defined Python functions that let the model talk to the outside world**, and they are the component that unlocks the real power of an agent.

In the previous posts we covered [working with models](/en/blog/langchain-ile-model-islemleri) and [building agents](/en/blog/langchain-ile-agent-olusturma). In this one we focus on how tools are defined, how the model sees them and how they plug into the agent loop.

> **Scope of this article:** We only touch on `state`, `context` and `store` briefly, and only as far as they relate to tools. We'll cover each of these concepts in detail in upcoming posts. There's no need to learn everything at once; for now it's enough to see how tools access them.

## What is a tool and why do we need it?

In LangChain, a tool consists of a name, a description, an input schema and an executable function body. Based on the conversation, the model decides which tool to call and with which arguments. Once the tool runs, its result is added to the message stream as a `ToolMessage` and the model decides the next step.

The flow looks like this:

1. The user sends a request.
2. The model picks the appropriate tool and its arguments.
3. LangChain runs the corresponding Python function.
4. The function's result is passed back to the model.
5. The model evaluates the result; it may call another tool or answer the user.

For example, for the question "How's the weather in Istanbul?", the model can call a tool named `get_weather` with `city="Istanbul"`. The tool hits a real weather API and returns the result, and the model explains it to the user in natural language.

## The basic tool definition: `@tool`

The most practical way to create a tool is the `@tool` decorator. The function name becomes the tool name by default, and the docstring becomes the description that helps the model understand when and how to use the tool.

```python
from langchain.tools import tool

@tool
def search_database(query: str, limit: int = 10) -> str:
    """Search the customer database for records matching the query.

    Args:
        query: Search terms to look for
        limit: Maximum number of results to return
    """
    return f"Found {limit} results for '{query}'"
```

The critical point here is that **type hints are required**. The `query: str` and `limit: int` definitions form the input schema that tells the model what kind of data to send. It's also worth taking the docstring seriously: the model infers the tool's purpose and the meaning of its parameters largely from it. A vague docstring can lead to the wrong tool choice or wrong arguments.

### Customizing the name and description

A function name may not be clear enough for the model, such as `search` instead of `web_search`. We can customize this by passing a name or a `description` to `@tool`.

```python
from langchain.tools import tool

@tool("web_search")
def search(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

print(search.name)  # web_search
```

```python
@tool(
    "calculator",
    description="Performs arithmetic calculations. Use this for any math problems."
)
def calc(expression: str) -> str:
    """Evaluate mathematical expressions."""
    return str(eval(expression))
```

Using `snake_case` for tool names is a good practice. Names with spaces or special characters can cause compatibility issues with some model providers.

## Advanced schemas: Pydantic and JSON Schema

Type hints are enough for simple tools. When we need more complex inputs, defaults, descriptions or constraints, a Pydantic model or a JSON Schema is the better fit.

### Schema with Pydantic

```python
from pydantic import BaseModel, Field
from typing import Literal
from langchain.tools import tool

class WeatherInput(BaseModel):
    """Input for weather queries."""
    location: str = Field(description="City name or coordinates")
    units: Literal["celsius", "fahrenheit"] = Field(
        default="celsius",
        description="Temperature unit preference"
    )
    include_forecast: bool = Field(
        default=False,
        description="Include 5-day forecast"
    )

@tool(args_schema=WeatherInput)
def get_weather(
    location: str,
    units: str = "celsius",
    include_forecast: bool = False
) -> str:
    """Get current weather and optional forecast."""
    temp = 22 if units == "celsius" else 72

    result = f"Current weather in {location}: {temp} degrees {units.upper()}"
    if include_forecast:
        result += "\nNext 5 days: Sunny"
    return result
```

In this example:

- **`location`:** is a required string parameter.
- **`units`:** can only be `"celsius"` or `"fahrenheit"`.
- **`include_forecast`:** is a boolean that defaults to `False`.
- **`Field(description=...)`:** gives the model descriptive information for each field.

### Schema with JSON Schema

Instead of Pydantic, we can also pass a JSON Schema directly:

```python
weather_schema = {
    "type": "object",
    "properties": {
        "location": {"type": "string"},
        "units": {"type": "string"},
        "include_forecast": {"type": "boolean"}
    },
    "required": ["location", "units", "include_forecast"]
}

@tool(args_schema=weather_schema)
def get_weather(
    location: str,
    units: str = "celsius",
    include_forecast: bool = False
) -> str:
    """Get current weather and optional forecast."""
    temp = 22 if units == "celsius" else 72

    result = f"Current weather in {location}: {temp} degrees {units.upper()}"
    if include_forecast:
        result += "\nNext 5 days: Sunny"
    return result
```

JSON Schema is handy when we want to use schemas coming from external systems as-is. In most Python projects, Pydantic is the more comfortable choice for type safety and readability.

## Reserved parameter names

The names `config` and `runtime` are reserved by LangChain for internal purposes; we can't use them for our own arguments.

| Parameter | Purpose |
|---|---|
| `config` | Passing `RunnableConfig` information to the tool internally |
| `runtime` | Access to state, context and store via `ToolRuntime` |

When we want access to runtime information, we need to declare the parameter with the `ToolRuntime` type.

## `ToolRuntime`: giving tools access to runtime information

Tools aren't only for calling external APIs. They can read the conversation history, update user preferences, write to persistent memory or report live progress during long operations. The key to all of these is the `ToolRuntime` parameter.

> **Note:** We only cover `state`, `context` and `store` as far as they relate to tools in this post. We'll go into detail on each of them in upcoming posts; the examples below exist to show the tool-side usage.

| Component | Description | Use case |
|---|---|---|
| `state` | Short-term memory; the conversation's messages and custom fields | Reading conversation history, keeping counters |
| `context` | Immutable configuration passed at call time | User ID, session info |
| `store` | Long-term memory that persists across conversations | Storing user preferences |
| `stream_writer` | Emitting real-time updates while a tool runs | Showing progress in long operations |
| `execution_info` | Thread ID, run ID and retry information | Logging, retry behavior |
| `server_info` | Assistant, graph and user info on Agent Server | Server-side identity/environment info |
| `config` | `RunnableConfig`; callbacks, tags and metadata | Tracing and configuration |
| `tool_call_id` | Unique ID of the current tool call | Matching the result to the right call |

An important detail: the `runtime` parameter is not shown to the model. The model only sees the real business parameters; `ToolRuntime` is injected automatically by LangChain at call time.

### Reading state

State is the short-term memory that lives for the lifetime of a conversation; it contains the message history and any custom fields we define in the agent state.

```python
from langchain.tools import tool, ToolRuntime
from langchain.messages import HumanMessage

@tool
def get_last_user_message(runtime: ToolRuntime) -> str:
    """Get the most recent message from the user."""
    messages = runtime.state["messages"]

    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            return message.content

    return "No user messages found"
```

This tool programmatically reads something the model can't access directly: the latest user message. The model doesn't see the `runtime` parameter; it only sees the tool's name and docstring.

### Updating state: `Command`

A tool doesn't have to be read-only; it can also update fields such as the user's name or preferred language. For that, we need to return a `Command`.

```python
from langchain.agents import AgentState
from langchain.messages import ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

class CustomState(AgentState):
    user_name: str

@tool
def set_user_name(
    new_name: str,
    runtime: ToolRuntime[None, CustomState]
) -> Command:
    """Set the user's name in the conversation state."""
    return Command(
        update={
            "user_name": new_name,
            "messages": [
                ToolMessage(
                    content=f"User name set to {new_name}.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )
```

The point to watch here is that when updating state with `Command`, we must always include a `ToolMessage`. Every tool call in an `AIMessage` needs a matching `ToolMessage` in the history; otherwise `ToolNode` raises a `ValueError`. Also, since parallel tool calls may update the same state field, it's a good idea to define a reducer for that field to handle conflicts.

### Per-call configuration with context

`context` carries data that is passed on every call and isn't expected to change during the conversation, such as user ID, role or session info. While `thread_id` scopes a conversation, `context` is valid for a single run.

```python
from dataclasses import dataclass
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langchain_core.utils.uuid import uuid7
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import InMemorySaver

USER_DATABASE = {
    "user123": {
        "name": "Alice Johnson",
        "account_type": "Premium",
        "balance": 5000,
        "email": "alice@example.com",
    },
    "user456": {
        "name": "Bob Smith",
        "account_type": "Standard",
        "balance": 1200,
        "email": "bob@example.com",
    },
}

@dataclass
class UserContext:
    user_id: str

@tool
def get_account_info(runtime: ToolRuntime[UserContext]) -> str:
    """Get the current user's account information."""
    user_id = runtime.context.user_id

    if user_id in USER_DATABASE:
        user = USER_DATABASE[user_id]
        return (
            f"Account holder: {user['name']}\n"
            f"Type: {user['account_type']}\n"
            f"Balance: ${user['balance']}"
        )
    return "User not found"

model = ChatOpenAI(model="gpt-6.1-sol")

agent = create_agent(
    model,
    tools=[get_account_info],
    context_schema=UserContext,
    checkpointer=InMemorySaver(),
    system_prompt="You are a financial assistant.",
)

thread_id = str(uuid7())
config = {"configurable": {"thread_id": thread_id}}
context = UserContext(user_id="user123")

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's my current balance?"}]},
    config=config,
    context=context,
)
```

In this example, `user_id` isn't decided by the model; our application passes it securely at call time. This way we prevent the model from asking the user for an ID or acting on behalf of the wrong user.

### Cross-conversation memory with store

`state` can be lost when a conversation ends; `store` is long-term memory that lives across conversations. It suits user preferences or saved information.

```python
from langgraph.store.memory import InMemoryStore
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langchain_openai import ChatOpenAI

@tool
def get_user_info(user_id: str, runtime: ToolRuntime) -> str:
    """Look up user info."""
    store = runtime.store
    user_info = store.get(("users",), user_id)
    return str(user_info.value) if user_info else "Unknown user"

@tool
def save_user_info(
    user_id: str,
    name: str,
    age: int,
    email: str,
    runtime: ToolRuntime
) -> str:
    """Save user info."""
    store = runtime.store
    store.put(
        ("users",),
        user_id,
        {"name": name, "age": age, "email": email}
    )
    return "Successfully saved user info."

model = ChatOpenAI(model="gpt-6.1-sol")
store = InMemoryStore()

agent = create_agent(
    model,
    tools=[get_user_info, save_user_info],
    store=store
)

agent.invoke({
    "messages": [
        {
            "role": "user",
            "content": "Save the following user: userid: abc123, name: Foo, age: 25, email: foo@langchain.dev"
        }
    ]
})

agent.invoke({
    "messages": [
        {
            "role": "user",
            "content": "Get user info for user with id 'abc123'"
        }
    ]
})
```

In production, we'll need a persistent store such as `PostgresStore`, `MongoDBStore` or `RedisStore` instead of `InMemoryStore`.

### Live progress with stream writer

In long-running operations, we may want to give the user instant feedback such as "searching data" or "processing file". `runtime.stream_writer` is how we do that.

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_weather(city: str, runtime: ToolRuntime) -> str:
    """Get weather for a given city."""
    writer = runtime.stream_writer

    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")

    return f"It's always sunny in {city}!"
```

This feature requires the tool to be called within a LangGraph execution context, so it's useful in streaming scenarios.

## Tool return values

What a tool returns directly affects the agent's next behavior. Four return types stand out: string, object, multimodal content and `Command`.

### String

The most common approach is returning readable text. It becomes a `ToolMessage` and the model builds its answer from it.

```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"It is currently sunny in {city}."
```

### Structured object

If we want the model to evaluate fields separately, we can return a `dict`. It provides a more reliable data flow than free-form text.

```python
from langchain.tools import tool

@tool
def get_weather_data(city: str) -> dict:
    """Get structured weather data for a city."""
    return {
        "city": city,
        "temperature_c": 22,
        "conditions": "sunny",
    }
```

### Multimodal content

If the model supports it, we can also return content blocks containing text, images, audio or video. It's worth making sure the modality we return is supported by the model.

```python
from langchain.tools import tool

@tool
def capture_screenshot() -> list[dict]:
    """Capture a screenshot of the current page."""
    return [
        {"type": "text", "text": "Screenshot of the current page:"},
        {"type": "image", "url": "https://example.com/page.png"},
    ]
```

### `Command`

When a tool wants to change the agent state instead of just returning a result, it returns a `Command`. That way it can both produce data and update application state.

```python
from langchain.messages import ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

@tool
def set_language(language: str, runtime: ToolRuntime) -> Command:
    """Set the preferred response language."""
    return Command(
        update={
            "preferred_language": language,
            "messages": [
                ToolMessage(
                    content=f"Language set to {language}.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )
```

## `return_direct=True`: skipping the extra model call

For some tools, the result is already the final answer for the user. In that case the model doesn't need to reinterpret it. With `return_direct=True` the agent loop is shortened and the tool output goes straight to the user.

```python
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_openai import ChatOpenAI

@tool(return_direct=True)
def fetch_order_status(order_id: str) -> str:
    """Fetch the current status of a customer order."""
    return f"Order {order_id} is shipped and will arrive in 2 days."

agent = create_agent(
    ChatOpenAI(model="gpt-5.4-mini"),
    tools=[fetch_order_status],
)

result = agent.invoke({
    "messages": [
        {"role": "user", "content": "What is the status of order #12345?"}
    ]
})
```

The advantage is avoiding an unnecessary LLM call and getting deterministic output. The downside is that the model can't summarize, explain or combine the result with other tools. So it makes sense to use it only when the result is already ready for the user. With parallel tool calls, **all** tools in that step need `return_direct=True` for the loop to short-circuit; in mixed calls the agent sends all results back to the model.

## Error handling: `wrap_tool_call`

In the real world tools don't always succeed: APIs time out, access is denied, invalid arguments arrive. We can catch these errors with middleware and pass a meaningful `ToolMessage` back to the model.

```python
from collections.abc import Callable

from langchain.agents import create_agent
from langchain.agents.middleware import wrap_tool_call
from langchain.messages import ToolMessage
from langchain.tools.tool_node import ToolCallRequest

@wrap_tool_call
def handle_tool_errors(
    request: ToolCallRequest,
    handler: Callable[[ToolCallRequest], ToolMessage],
) -> ToolMessage:
    """Convert tool exceptions into ToolMessages the model can handle."""
    try:
        return handler(request)
    except Exception as e:
        return ToolMessage(
            content=f"Tool error: Please check your input and try again. ({e})",
            tool_call_id=request.tool_call["id"],
        )

agent = create_agent(
    model="openai:gpt-6.1-sol",
    tools=[],
    middleware=[handle_tool_errors],
)
```

Instead of silently swallowing the error, this approach lets the model understand what happened and respond to the user more appropriately.

## Dynamic tool selection

Exposing every tool to the model in every situation isn't the right call. Too many tools bloat the context and increase the chance of a wrong choice. Dynamic tool selection changes the set of tools the model sees based on authentication, user role, feature flags or the stage of the conversation.

### Filtering by state

```python
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
from typing import Callable

@wrap_model_call
def state_based_tools(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse]
) -> ModelResponse:
    """Filter tools based on conversation State."""
    state = request.state
    is_authenticated = state.get("authenticated", False)
    message_count = len(state["messages"])

    if not is_authenticated:
        tools = [t for t in request.tools if t.name.startswith("public_")]
        request = request.override(tools=tools)
    elif message_count < 5:
        tools = [t for t in request.tools if t.name != "advanced_search"]
        request = request.override(tools=tools)

    return handler(request)

agent = create_agent(
    model="gpt-6.1-sol",
    tools=[public_search, private_search, advanced_search],
    middleware=[state_based_tools]
)
```

In this example, if the user hasn't authenticated, only tools prefixed with `public_` are visible. In the early stages of the conversation, `advanced_search` is hidden.

### Filtering permissions by context

```python
from dataclasses import dataclass
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
from typing import Callable

@dataclass
class Context:
    user_role: str

@wrap_model_call
def context_based_tools(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse]
) -> ModelResponse:
    """Filter tools based on Runtime Context permissions."""
    if request.runtime is None or request.runtime.context is None:
        user_role = "viewer"
    else:
        user_role = request.runtime.context.user_role

    if user_role == "admin":
        pass
    elif user_role == "editor":
        tools = [t for t in request.tools if t.name != "delete_data"]
        request = request.override(tools=tools)
    else:
        tools = [t for t in request.tools if t.name.startswith("read_")]
        request = request.override(tools=tools)

    return handler(request)

agent = create_agent(
    model="gpt-6.1-sol",
    tools=[read_data, write_data, delete_data],
    middleware=[context_based_tools],
    context_schema=Context
)
```

This pattern matters especially in enterprise applications: admins get every tool, editors can't delete, and viewers only see read tools.

### Registering tools at runtime

Sometimes tools aren't known upfront; they're discovered at runtime from an MCP server, a remote registry or based on user data. In that case we need to introduce the tool to the model with `wrap_model_call` and also make sure it can be executed with `wrap_tool_call`.

```python
from langchain.tools import tool
from langchain.agents import create_agent
from langchain.agents.middleware import AgentMiddleware, ModelRequest, ToolCallRequest

@tool
def calculate_tip(
    bill_amount: float,
    tip_percentage: float = 20.0
) -> str:
    """Calculate the tip amount for a bill."""
    tip = bill_amount * (tip_percentage / 100)
    return f"Tip: ${tip:.2f}, Total: ${bill_amount + tip:.2f}"

class DynamicToolMiddleware(AgentMiddleware):
    """Middleware that registers and handles dynamic tools."""

    def wrap_model_call(self, request: ModelRequest, handler):
        updated = request.override(tools=[*request.tools, calculate_tip])
        return handler(updated)

    def wrap_tool_call(self, request: ToolCallRequest, handler):
        if request.tool_call["name"] == "calculate_tip":
            return handler(request.override(tool=calculate_tip))
        return handler(request)

agent = create_agent(
    model="gpt-6.1-sol",
    tools=[get_weather],
    middleware=[DynamicToolMiddleware()],
)
```

The `wrap_tool_call` hook is required so the agent knows how to execute tools added at runtime.

## Headless tools: running on the client

Some operations need to run not on the server but in the user's browser or device: geolocation, clipboard, file picker, IndexedDB and so on. The **headless tool** pattern is used for these.

A headless tool is defined on the server only with a name, description and argument schema; the real implementation lives on the client. The model calls the tool as usual, the graph interrupts, and the client app performs the operation and sends the result back to the graph.

```python
from langchain.tools import tool

headless_tool = tool(
    name="get_user_location",
    description="Get the user's current location from the browser.",
    args_schema={
        "type": "object",
        "properties": {},
    },
)
```

This pattern suits privacy-sensitive, device-specific or low-latency operations. For example, the user's location can be read in the browser without ever being sent to the server.

## Prebuilt tools and MCP

We don't have to write every tool from scratch. LangChain offers prebuilt tools and toolkits for common jobs such as web search, code interpreters and database access. For the full list organized by category, we can take a look at the [tools and toolkits integrations page](https://docs.langchain.com/oss/python/integrations/tools). Before writing a new tool, it's worth checking whether a prebuilt option already covers our need.

**Model Context Protocol (MCP)** is also an open protocol that connects agents to external services through a standard interface. Once connected to an MCP server, we can convert the tools it exposes into LangChain tools and hand them to the agent.

```python
from langchain.mcp import MCPAdapter

config = {
    "mcpServers": {
        "my_server": {
            "url": "http://localhost:8000/mcp"
        }
    }
}

async with MCPAdapter(config) as adapter:
    tools = await adapter.list_tools()
```

With MCP, we can reach resources such as databases, APIs, file systems and browsers without writing custom integration code.

## Practical tips

Tool design directly affects agent quality. The points worth keeping in mind:

- **Naming:** keep tool names short, descriptive and in `snake_case`.
- **Docstrings:** write them clearly and concisely for the model.
- **Types:** use type hints for every parameter and prefer Pydantic for complex inputs.
- **Descriptions:** state parameter meanings explicitly with `Field(description=...)`.
- **Output:** keep it as structured as possible and avoid unnecessary free-form text.
- **Security:** protect unauthorized or sensitive operations with context/role-based filtering.
- **Errors:** catch them with middleware and pass a meaningful `ToolMessage` to the model.
- **`return_direct=True`:** use it only when the result is already final.
- **Tool count:** avoid exposing too many tools at once; filter dynamically instead.

## Wrapping up

Tools are the piece that turns a model from a system that merely talks into an agent that gets work done. Starting from `@tool` and moving through schemas, `ToolRuntime`, return types, error handling and dynamic selection, we see how much small, well-designed functions affect agent quality.

See you in the next post.

## Sources

The APIs and parameters described here may change between versions. Verifying the details for the version we use against the official documentation is a good habit.

- [LangChain Tools Documentation](https://docs.langchain.com/oss/python/langchain/tools) – defining tools, schemas, `ToolRuntime` and return types
- [LangChain Agents Documentation](https://docs.langchain.com/oss/python/langchain/agents) – the agent loop and middleware
- [LangChain Tools Integrations](https://docs.langchain.com/oss/python/integrations/tools) – list of prebuilt tools and toolkits
- [LangChain create_agent Reference](https://reference.langchain.com/python/langchain/agents/create_agent) – `create_agent` parameters
- [LangChain tool Reference](https://reference.langchain.com/python/langchain-core/tools/convert/tool) – `@tool` decorator reference
