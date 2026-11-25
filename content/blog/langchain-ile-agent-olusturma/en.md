---
title: "LangChain Agents Tutorial: Build an Agent with create_agent"
description: "What a LangChain agent is, how the agent loop works and how to build one with create_agent: tools, structured output, memory and middleware, with Python examples."
date: 2026-11-08
topic: ai
tags: [langchain, agents, python, ai]
draft: false
---

A language model can generate text on its own, but that isn't enough to **plan, use tools, evaluate results, and retry when necessary** on real-world tasks. This is where an **agent** comes in: a system that lets a model call tools and make decisions until it reaches a goal. In LangChain, this structure is built with `create_agent`.

In the previous article, we looked at [creating models with LangChain](/en/blog/langchain-ile-model-islemleri). In this one, we focus on the agent concept, which turns a model from a "chatting assistant" into a **coworker that produces work and uses tools**.

## What is an agent?

By LangChain's definition, an agent is **a loop in which a model calls tools until a given task is complete**. The prompt, tools, and middleware layers around this loop are called the *harness*. We can summarize it as a formula:

```text
Agent = Model + Harness
```

The *harness* consists of the system prompt that tells the model what to do, the tool definitions that determine what it can access, and the middleware components that shape its behavior.

We can compare this to a kitchen: the model is the chef who makes the decisions, the tools are the kitchen equipment, and the system prompt is the recipe the chef is given. No matter how skilled the chef is, they can't produce the requested dish without an oven or a recipe.

Here is a simple diagram of the flow:

```text
User task
    │
    ▼
  Model  ◄──────────────┐
    │                   │
Need a tool?            │
 ├─ Yes → Tool call → Tool result
 └─ No  → Final answer
```

The model receives the user's request; if needed, it picks a tool, reads the result the tool returns, and decides again. When the model no longer produces a tool call, the loop ends and the final answer goes back to the user.

## Why isn't a single model enough?

However powerful an LLM is, it inherently relies only on what it was trained on and the context it is given. Yet in real applications, most tasks require up-to-date data, internal systems, files, databases, or external services.

| Need | Model only | Agent |
|---|---|---|
| Current information | Limited by its training date | Can use web search, API, or database tools |
| Company data | No access | Can call CRM, document, or SQL tools |
| Creating files | Can generate text | Can write files with filesystem tools |
| Multi-step work | Limited to a single response | Plans, runs tools, evaluates results |
| Verifiable output | Produces free-form text | Can return a structured schema |

Anthropic's definition supports the same idea: agents are LLM systems that use tools based on feedback from their environment and direct their own process.

**Important distinction – agent vs. workflow:** In *workflows*, steps are orchestrated through predefined code paths; in an agent, the model decides the next step. If we know the steps up front, a workflow may be the better fit; if the steps change depending on the situation, an agent may be more suitable.

For example, for the request "Summarize the latest developments in AI safety," a model can only answer from what it has memorized. An agent calls a search tool, gathers the results, runs a second search if needed, and then produces a summary.

## The core parts of an agent

The core of a LangChain agent rests on four components: **model, tools, system prompt, and agent state**. In addition, parameters such as `response_format`, `checkpointer`, and `middleware` make the agent ready for production.

> **Scope of this article:** Here we cover the agent concept, why agents are needed, and how a basic agent is built. Components such as `tools`, `agent state`, `response_format`, `checkpointer`, and `middleware` are introduced only in terms of how they are used with an agent. Each of these topics is as deep as a specialty of its own, and we'll cover them one by one in upcoming articles. Think of this article as a **general map** of agents.

The main stops on the map are:

- **Tools:** The tools that let an agent talk to the outside world: API calls, search, database queries, and file operations.
- **Agent state:** The agent's short-term memory: conversation history, tool results, counters, and custom business state.
- **Middleware:** The layer that hooks into the agent lifecycle: error handling, guardrails, human approval, logging, and context management.
- **Checkpointer and `thread_id`:** Persisting the agent's conversation history so it can continue multi-turn conversations.
- **Structured output:** Turning the agent's output into a verifiable schema instead of free-form text.

### Model

The `model` parameter determines the agent's "brain." You can use a model identifier in `"provider:model"` format or an already initialized model object.

```python
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-5.5",
    tools=tools,
)
```

Model choice affects not only quality but also latency, cost, context window, and tool-calling ability. Fast models may suit simple tasks, while more capable models may suit complex analysis and coding tasks.

### Tools

Tools are functions that let the model interact with the world. In LangChain, you can give an agent a Python function, a `BaseTool` object, or a tool dictionary.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Runs a web search for the given query."""
    return f"Search results: {query}"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
)
```

The most critical part of a good tool definition is its docstring. The model largely understands which tool to use and when from this description. That's why tool names should be clear, parameters explicit, and docstrings action-oriented.

```python
@tool
def get_weather(city: str) -> str:
    """Returns the current weather for the specified city."""
    ...
```

### System prompt

`system_prompt` defines the agent's role, boundaries, tone, and approach to the task. This parameter accepts a string or a `SystemMessage`; it is placed at the start of the message list before the model is called.

```python
agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
    system_prompt=(
        "You are a research assistant. "
        "Use the search tool for questions that need current information. "
        "Cite your sources and don't guess when you're unsure."
    ),
)
```

A good system prompt does more than say "be helpful." It tells the agent:

- What role it has
- Which tools to use and when
- Which information needs to be verified
- What format the response should take
- When it should ask the user a question

### Agent state

`AgentState` is a typed dictionary that holds the agent's context while it runs. By default, it contains the `messages` field that carries the conversation history; you can also add custom fields such as `user_id`, counters, or business state.

```python
from langchain.agents import AgentState, create_agent

class ResearchState(AgentState):
    user_id: str
    research_step: int

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
    state_schema=ResearchState,
)
```

This structure lets the agent manage not only past conversation but also task progress, user context, and the data middleware needs.

## How does the agent loop work?

The basic flow running under `create_agent` is quite clear:

1. The model is called with the system prompt and current messages.
2. The model produces an `AIMessage`.
3. If the response contains `tool_calls`, the corresponding tools are run.
4. Tool results are added to the message list as `ToolMessage` objects.
5. The model is called again.
6. When the model no longer produces tool calls, the agent returns the final answer.

For the request "Summarize this week's AI safety news," the flow goes like this:

```text
User → Agent  : "Summarize this week's AI safety news"
Agent → Model : prompt + tools
Model → Agent : search("AI safety news")
Agent → Tool  : run search
Tool → Agent  : results
Agent → Model : fresh context
Model → Agent : final summary
Agent → User  : summary
```

This loop is what sets an agent apart from an ordinary chatbot. The model doesn't respond just once; it calls tools as needed, processes the results, and continues until the task is complete.

## Your first agent with LangChain

The following example creates a simple agent that fetches weather information. The goal is to show how the `model`, `tools`, and `system_prompt` parameters work together.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Returns the current weather for the specified city."""
    # In a real application, this would call a weather API.
    return f"Weather in {city}: 18°C, partly cloudy"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[get_weather],
    system_prompt=(
        "You are a helpful weather assistant. "
        "If the user asks about a city, use the get_weather tool. "
        "Keep your answers short and clear."
    ),
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)

print(result["messages"][-1].content)
```

**Expected mock output:**
```text
The weather in San Francisco is currently 18°C and partly cloudy.
```

The actual output varies by model and request; the goal here is to show the flow.

In this example:

- `model` forms the decision-making mechanism.
- `get_weather` gives the agent access to the outside world.
- `system_prompt` defines the agent's behavior and its tool-usage rule.
- `invoke` starts the task and runs the agent loop.

## Structured output

An agent's output doesn't always have to be free-form text. With the `response_format` parameter, the model can produce a verifiable response that conforms to a schema such as a Pydantic model.

```python
from pydantic import BaseModel
from langchain.agents import create_agent

class ResearchAnswer(BaseModel):
    summary: str
    confidence: float
    sources: list[str]

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
    response_format=ResearchAnswer,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Summarize AI safety trends"}]}
)

answer = result["structured_response"]
print(answer.summary)
print(answer.confidence)
```

This approach is very valuable when the agent's output will go straight into an application, a database, or a UI. Instead of parsing free-form text, we can reliably use fields such as `summary`, `confidence`, and `sources`.

## Memory and multi-turn conversations

For an agent to remember the previous conversation, you need a `checkpointer` and a unique `thread_id` for each conversation. The `thread_id` scopes the conversation history and checkpoints, so the agent can pick up the same chat where it left off.

```python
from langchain.agents import create_agent
from langchain_core.utils.uuid import uuid7
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
    checkpointer=InMemorySaver(),
)

config = {"configurable": {"thread_id": str(uuid7())}}

agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]},
    config=config,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "And what about tomorrow?"}]},
    config=config,
)
```

In the second call, which city "tomorrow" refers to is understood from the context of the first call. This works because the conversation history is preserved under the same `thread_id`.

## Middleware: taking an agent to production

For simple agents, `model`, `tools`, and `system_prompt` are often enough. In real production environments, however, an agent needs to handle errors, long contexts, authorization, and human approval. In LangChain, these needs are met with **middleware**.

| Middleware area | What it provides |
|---|---|
| Execution environment | Filesystem, sandbox, and code execution |
| Context management | Summarization, memory, skill loading, and prompt caching |
| Planning and delegation | Todo lists and subagents |
| Fault tolerance | Retries, fallbacks, and call limits |
| Guardrails | PII detection and content checks |
| Steering | Human approval for high-impact actions |

Middleware can hook into different points of the agent lifecycle; it can update the context, restrict tool access, or shape model behavior. For example, you may want an agent to get user approval before sending an email or deleting a file. That makes the agent safer as well as more capable.

## What agents can do

LangChain agents are not just "models that call tools." With the right harness, they can have a very wide range of capabilities:

- **Tool use:** Search, API calls, database queries, file reading and writing.
- **Planning:** Breaking complex tasks into steps and keeping a todo list.
- **Delegation:** Handing tasks to subagents and running them in parallel.
- **Context management:** Summarizing long conversations, persistent memory, and skill usage.
- **Fault tolerance:** Retrying on transient API errors and falling back to alternative strategies.
- **Safety:** Filtering sensitive data, content checks, and human approval.
- **Structured output:** Schema-based responses that applications can consume directly.

For long-running research or coding tasks in particular, `create_deep_agent` offers common capabilities such as a filesystem, summarization, subagents, and prompt caching in a pre-assembled form.

## A simple research agent

The following example shows the basic skeleton of a research agent. The goal isn't to build a complex system, but to see how the agent parameters are used together.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Runs a web search for the given topic and returns short results."""
    return f"Search results for '{query}'"

@tool
def summarize(text: str) -> str:
    """Turns the given text into a short summary."""
    return f"Summary: {text[:200]}"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search, summarize],
    system_prompt=(
        "You are a research assistant. "
        "First, gather current information with the search tool. "
        "Then summarize the findings with the summarize tool. "
        "Don't make claims you can't attribute to a source."
    ),
    name="research_assistant",
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "Summarize current approaches to security in AI agents.",
            }
        ]
    }
)

print(result["messages"][-1].content)
```

The `name="research_assistant"` parameter here can be used to identify the agent in multi-agent systems. It's especially useful when the agent is called by another agent as a subgraph.

## When should you use an agent?

Not every problem needs an agent. Anthropic's advice is clear as well: start with the simplest solution possible, and move to an agent only when you truly need dynamic decision-making and tool use.

| Scenario | Recommended approach |
|---|---|
| One-off text generation | Model only |
| Fetching data with predefined steps | Workflow |
| Research that needs current information | Agent + search tool |
| Multi-step file or code operations | Agent + filesystem/code execution |
| Automation with sensitive actions | Agent + guardrails + human-in-the-loop |
| Long-running, decomposable tasks | Deep agent + subagents |

An agent isn't the right question; it's **the right abstraction for the right problem**. Adding a tool to a simple chatbot doesn't automatically make it an agent; the real difference is that the model decides tool usage and the next step on its own.

## Conclusion

A LangChain agent turns a model from a system that only generates text into a unit of work that can complete tasks. With `create_agent`, the model, tools, system prompt, state, response format, and middleware come together to build this structure.

In the next article, we'll go deeper into agents: tool design, middleware, memory, guardrails, subagents, and human approval mechanisms. If you've grasped the basic structure in this article, you'll see much more clearly why agents sit at the center of modern LLM applications. See you in the next article.

## Resources

The parameters and features used here may change between versions. Before moving an example into your own project, it's good practice to verify it against the official documentation.

- [LangChain Agents documentation](https://docs.langchain.com/oss/python/langchain/agents) – `create_agent`, agent state, invocation, and streaming
- [LangChain Models documentation](https://docs.langchain.com/oss/python/langchain/models) – Model initialization, parameters, tool calling, and structured output
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) – The agent vs. workflow distinction and when to use an agent
