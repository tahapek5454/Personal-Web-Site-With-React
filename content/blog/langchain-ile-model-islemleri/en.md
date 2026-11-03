---
title: "Working with Models in LangChain"
description: "How do you create a model instance with LangChain? What do its parameters do, and which methods should you use? This article answers these questions."
date: 2026-11-03
topic: ai
tags: [langchain, agents, python, ai]
draft: false
---

## Creating a Chat Model in LangChain: Getting Started with `ChatOpenAI`

In LangChain, **creating a model** means choosing and configuring the chat model our application will use. We can think of it as one of the first steps in deciding how our application will communicate and which AI provider it will use. If we use an agent, the model also acts as its “brain”: it decides which tool to call, how to interpret the results returned by tools, and when to respond to the user.

Let's start small: we'll create a model with `ChatOpenAI` and discuss what the basic settings do. Then we'll look at how it differs from provider-specific classes using `init_chat_model`, get a response from the model, and connect it to a simple agent. At the end of the article, we'll also look at a few commonly used features, such as tool calling, structured output, and the Responses API.

## What is creating a chat model, and why do it?

At its simplest, a chat model is an AI model that interprets the messages we send it and generates a response. When creating this model in LangChain, we do more than just specify an API key. We also define **how the model should behave** (for example, how varied or how long its responses can be) and **which service it should connect to and how**.

We can think of it like cooking: two chefs following the same recipe may produce different results. The model we choose is like the ingredients, while the model settings are like the details of the recipe. Choosing the right model and settings directly affects the quality of the results, especially when our application works with tools through an agent.

Model selection matters for several reasons:
- An agent's reliability and performance depend largely on the capabilities of the model it uses.
- Not every model is equally good at every task. Some follow complex instructions better, while others excel at structured output or working with long contexts.
- LangChain's shared interface makes it easier to switch providers. For example, when moving from OpenAI to Anthropic, we don't need to rewrite the entire application flow; we should still review provider-specific settings.

In other words, we can think of model creation as a small but important initial setting that shapes the rest of the application.

## Steps for creating a model

1. **Install the required package** – For the OpenAI integration, run `pip install -U langchain-openai`.
2. **Set the API key** – Keeping the key in an environment variable is safer and more practical than writing it directly in source code. Example for macOS/Linux: `export OPENAI_API_KEY="your-api-key"`.
3. **Initialize the model** – Specify which model to use with the `ChatOpenAI` class.
4. **Configure it for your needs** – Adjust behavior and connectivity with parameters such as `temperature`, `max_tokens`, `timeout`, and `max_retries`.
5. **Send a message** – Call the model with `invoke()` and get its response.
6. **Optionally connect it to an agent** – Use `create_agent(model=..., tools=...)` to let the model work with tools.

You don't have to learn all these steps at once on your first try. It's enough to initialize the model and get a response; you can add the other settings as you need them.

## What is `ChatOpenAI`, and how do you use it?

`ChatOpenAI` is LangChain's chat model class for working with OpenAI. When we provide a model name and API key, it sends our messages in a format compatible with the OpenAI API and converts the response into a structure LangChain can use.

There is a small but important distinction here: although the class is called `ChatOpenAI`, that doesn't mean every feature of every OpenAI-compatible service is automatically supported. This integration targets OpenAI's official API format; it does not separately extract and preserve non-standard response fields added by some providers, such as OpenRouter, vLLM, or DeepSeek (for example, `reasoning_content`). If you need a provider's specific features, use that provider's LangChain package (`ChatDeepSeek`, `ChatOpenRouter`, and so on) if available.

For the simplest usage, a model name is enough. If we also keep the API key in an environment variable, the class can find it automatically:

```python
import os
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "sk-..."

model = ChatOpenAI(model="gpt-4o")
```

## `ChatOpenAI` parameters and what they do

We can roughly divide the parameters available when creating `ChatOpenAI` into two groups. **Completion params** affect the response the model generates; **client params** control the conditions and connection details under which the request is sent. This distinction makes it easier to understand where to look for each setting.

### Completion parameters (model behavior)

| Parameter | Type | Purpose |
|---|---|---|
| `model` | string (required) | The name of the OpenAI model to use, e.g. `"gpt-4o"`, `"gpt-4o-mini"`. |
| `temperature` | float | Sampling temperature. A low value (0) produces more deterministic responses, while a higher value produces more creative ones. |
| `max_tokens` | int or None | The maximum number of tokens to generate. If `None`, no limit is applied. |
| `logprobs` | bool or None | Determines whether log-probability values are returned for each token. Useful for analysis and debugging. |
| `stream_options` | dict | Configures streaming output; for example, `{"include_usage": True}` also returns token usage during the stream. |
| `use_responses_api` | bool or None | Determines whether to use OpenAI's newer Responses API. Required for some advanced features (reasoning, built-in tools, conversation state). |

For example, we can adjust response variety with `temperature` and set an upper length limit with `max_tokens`. Not every parameter is supported in the same way by every model. It's a good habit to check API support before using features that depend on a particular provider or model. It's also perfectly reasonable to start with the defaults and change only the settings we actually need.

### Client parameters (connection)

| Parameter | Type | Purpose |
|---|---|---|
| `timeout` | float, tuple, or None | The maximum time (in seconds) to wait for a request. The request is canceled if this time is exceeded. |
| `max_retries` | int or None | The number of retries for requests that fail due to reasons such as network timeouts or rate limits. |
| `api_key` | string or None | The OpenAI API key. If omitted, it is read from the `OPENAI_API_KEY` environment variable. |
| `base_url` | string or None | The target URL for API requests. Specify it when using a proxy or service emulator; otherwise, it is read from the `OPENAI_API_BASE` or `OPENAI_BASE_URL` environment variables. |
| `organization` | string or None | The OpenAI organization ID. If omitted, it is read from the `OPENAI_ORG_ID` environment variable. |

These settings are concerned more with the request's journey than with the style of its response. For example, `timeout` determines how long we'll wait before giving up, while `max_retries` sets how many times to retry after a temporary network or rate-limit error. Although it's possible to provide the API key directly in code, using an environment variable is a safer choice for most projects.

### Other important parameters

| Parameter | Purpose |
|---|---|
| `frequency_penalty` | Penalizes repeated words. Positive values reduce word repetition. |
| `presence_penalty` | Encourages the model to explore new topics. Positive values reduce repetition. |
| `seed` | A seed value for deterministic output. The same input with the same seed produces similar output each time. |
| `stop` | Specifies the word or sequence of words that will stop the model from generating more text. |
| `n` | The number of different response choices to generate in a single request. Defaults to 1. |
| `service_tier` | Lets you choose a processing tier, such as `"flex"`, which is cheaper but slower. This is a beta feature and is available only for some models. |
| `model_kwargs` | Adds standard OpenAI API parameters directly (top-level) to the request body, e.g. `max_completion_tokens`, `stream_options`, `modalities`, and `audio`. |
| `extra_body` | Adds non-standard provider parameters for OpenAI-compatible services (vLLM, LM Studio, OpenRouter, etc.) under the request's `extra_body` field. |

You don't need to use all these parameters in your first model. For example, `frequency_penalty` and `presence_penalty` affect the tendency to repeat in generated text, while `stop` can stop generation when a specific text is encountered. `n` is used to request multiple alternative responses in a single request. As your use case becomes clearer, it will be easier to choose which of these options are useful.

**Important distinction – `model_kwargs` vs `extra_body`:** `model_kwargs` merges parameters into the top level of the request; `extra_body` places them under the `extra_body` key. For custom parameters from OpenAI-compatible providers, **always use `extra_body`**; otherwise, the API may return an error.

In short, `model_kwargs` may be appropriate when sending a standard option recognized by the OpenAI API; `extra_body` is the right place for a non-standard option specific to the compatible service we're using. A server may reject a request if it receives parameters in a different format than expected, so getting this distinction right from the start also makes debugging easier.

**Preserved parameters:** Any parameter that LangChain does not explicitly support is passed directly to `openai.OpenAI.chat.completions.create(...)` each time the model is called. For example:

```python
ChatOpenAI(..., frequency_penalty=0.2).invoke(...)

# This adds the following to the underlying API call:
# openai.OpenAI(..).chat.completions.create(..., frequency_penalty=0.2)
```

You can also write this as `ChatOpenAI(...).invoke(..., frequency_penalty=0.2)`.

There are, of course, other parameters as well. You can learn about them on the official OpenAI and LangChain websites.

## `init_chat_model` or `ChatOpenAI`?

Which route should we take to access a model: `init_chat_model` or `ChatOpenAI` directly? Both let us initialize a chat model. The main difference is how easily we can switch providers versus how directly we want to access provider-specific details.

### When should you use `init_chat_model`?

`init_chat_model` is a general starting point that makes it easier to work with multiple providers. We can specify the provider and model name in a single expression; in the example below, `openai:` indicates the provider and `gpt-4o` is the model name.

```python
import os
from langchain.chat_models import init_chat_model

os.environ["OPENAI_API_KEY"] = "sk-..."

model = init_chat_model("openai:gpt-4o")
```

**When is it useful?**
- When quickly building a prototype or getting started with LangChain.
- When trying different providers such as OpenAI, Anthropic, Gemini, or Bedrock through a shared approach.
- When specifying the provider and model name in one place (such as `"openai:gpt-4o"`).

### When should you use `ChatOpenAI`?

If our application focuses on OpenAI and we want to use API-specific options more explicitly, `ChatOpenAI` may be a more direct choice. The class exposes many OpenAI settings as its own parameters, making it easier to see which settings are being used when reading the code.

```python
import os
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "sk-..."

model = ChatOpenAI(model="gpt-4o")
```

**When is it useful?**
- When we need OpenAI-specific options such as `use_responses_api`, `logprobs`, `seed`, or `service_tier`.
- When we want to benefit from IDE autocomplete and clearer parameter names.
- When our application focuses on a single provider and we'll use that provider's features in more detail.

In short, we can start with `init_chat_model` if easily switching between providers is our priority, or with `ChatOpenAI` if we want more direct control over OpenAI settings. These two options don't have to compete: our preference can change as the needs of the project evolve.

### Comparison table

| Feature | `init_chat_model` | `ChatOpenAI` |
|---|---|---|
| Ease of use | High (single function) | Medium (package installation required) |
| Multi-provider support | Yes, one interface | No, OpenAI only |
| Provider-specific parameters | Passed with `**kwargs` | Directly available as class parameters |
| Type safety | Lower | Higher |
| Recommended use | Prototyping, multiple providers | Production, OpenAI-focused |

## Get a response from the model: `invoke()`

Now that we've prepared our model, we can send it a message. The most basic method for this is `invoke()`; it sends the messages we provide to the model and returns the result once the entire response is ready. In other words, in this example we don't follow the response piece by piece; we receive it as a single result.

We send messages using the `system` and `human` roles. The `system` message describes how we want the model to behave, while the `human` message contains the user's request:

```python
messages = [
    ("system", "You are a helpful translator. Translate the user's sentence into French."),
    ("human", "I love programming."),
]
response = model.invoke(messages)
```

The result of the call is more than just the response text: LangChain returns it as an `AIMessage` object. If needed, we can read the text from the object, as well as access information such as token usage, the model that generated the response, and how generation ended. The example below shows what a representative response might look like; actual values depend on the model and request you use:

```python
AIMessage(
    content="J'adore la programmation.",
    response_metadata={
        "token_usage": {
            "completion_tokens": 5,
            "prompt_tokens": 31,
            "total_tokens": 36,
        },
        "model_name": "gpt-4.1-mini",
        "system_fingerprint": "fp_43dfabdef1",
        "finish_reason": "stop",
        "logprobs": None,
    },
    id="run-012cffe2-5d3d-424d-83b5-51c6d4a593d1-0",
    usage_metadata={
        "input_tokens": 31,
        "output_tokens": 5,
        "total_tokens": 36,
    },
)
```

### Understanding the contents of `AIMessage`

The metadata fields may look a little crowded at first; we don't need all of them for most simple use cases. Still, they're quite useful when we want to track an application's costs, investigate why a response was cut off, or inspect what the model returned:

- **`content`** – The actual text generated by the model.
- **`response_metadata`** – Raw metadata from the OpenAI API:
  - `token_usage` – Token counts for `completion_tokens` (generated), `prompt_tokens` (input), and `total_tokens` (total).
  - `model_name` – The specific model that generated the response.
  - `system_fingerprint` – A fingerprint that identifies the model version/configuration.
  - `finish_reason` – Why the response ended (`"stop"` for a normal ending, `"length"` for the token limit, `"tool_calls"` for a tool call, etc.).
  - `logprobs` – Token-level probability data, if `logprobs=True` was provided.
- **`id`** – The unique ID for this run.
- **`usage_metadata`** – LangChain's standardized token usage format: `input_tokens`, `output_tokens`, and `total_tokens`.

For example, if we only want to see token usage, we can print the `usage_metadata` field instead of inspecting the entire object:

```python
ai_msg = model.invoke(messages)
print(ai_msg.usage_metadata)
```

**Expected mock output:**
```python
{"input_tokens": 28, "output_tokens": 5, "total_tokens": 33}
```

## Connect the model to an agent (basic level)

So far, we've seen how to interact directly with a model. As a next step, we can use it inside an **agent**. An agent is a workflow that calls a tool when needed, evaluates the result returned by the tool, and responds to the user when the task is complete. In this workflow, the model decides what step to take; tools provide a way to get information from the outside world or perform a specific task.

In the following example, we'll define a simple tool that returns the weather. The result here is a fixed example; in a real application, this function could connect to a weather service.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def get_weather(location: str) -> str:
    """Gets the weather for the specified location."""
    return f"Weather in {location}: Sunny, 22°C"

agent = create_agent(
    model=model,  # The ChatOpenAI instance we created above
    tools=[get_weather],
    system_prompt="You are a helpful assistant. Be concise and accurate."
)
```

In this example, `create_agent` brings together the model and the tools it can use. We can think of the parameters as follows:
- `model` – The model instance we initialized (such as `ChatOpenAI`) or a model identifier, which the agent uses to make decisions.
- `tools` – Tools the agent can call when needed. These can be Python functions, LangChain tools, or suitable dictionary definitions.
- `system_prompt` – The initial instruction that tells the agent how to approach its task. In this example, we ask it to be concise and accurate.

### Get a response from the agent

When calling the agent, we pass the user's message in the `messages` field. The agent decides whether a tool is needed to answer the question; if so, it runs the tool and generates a response using the result. We can read the final message as follows:

```python
result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather like in Boston?"}]})
print(result["messages"][-1].text)
```

**Expected mock output:**
```
Agent: The weather in Boston is currently sunny and 22°C.
```

> **Note:** Agents are a broad topic in their own right. We won't cover topics such as state management, checkpointers, structured output, streaming, or multi-agent systems in this article; for now, we've seen how to connect a model to an agent with a tool. Once this basic flow is clear, it will be much easier to explore these features individually.

## Going a little further: additional model features

For basic usage, creating the model and calling `invoke()` is often enough. As an application grows, however, we may want the model to call tools, respond in a specific data format, or report usage information. The examples below introduce what these features are for; we don't need to use them all at once. We can choose the ones that fit our needs and start with small experiments.

- **Tool calling:** With `ChatOpenAI`'s `bind_tools()` method, we can introduce Pydantic models or functions to the model as tools. The model interprets the request and indicates which tool it needs and with what arguments; this call information is available in the `tool_calls` field. The important point is that the model chooses and describes the tool call, while actually running the tool is the responsibility of the workflow we use. When using an agent, the agent usually manages this loop.

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    '''Gets the current weather for the specified location.'''
    location: str = Field(..., description="City and state, e.g. San Francisco, CA")

model_with_tools = model.bind_tools([GetWeather])
ai_msg = model_with_tools.invoke("Which is warmer, LA or NY?")
print(ai_msg.tool_calls)
```

**Expected mock output:**
```python
[
    {
        "name": "GetWeather",
        "args": {"location": "Los Angeles, CA"},
        "id": "call_6XswGD5Pqk8Tt5atYr7tfenU",
    },
    {
        "name": "GetWeather",
        "args": {"location": "New York, NY"},
        "id": "call_ZVL15vA8Y7kXqOy3dtmQgeCi",
    },
]
```

- **Parallel tool calls:** For some questions, the model may need more than one tool. The `parallel_tool_calls` setting controls whether these tool calls are allowed to run in parallel. In the example below, we pass `False` to disable parallel calls in the same request. Since the default and availability of this option may vary depending on your OpenAI SDK/API version, check the documentation for your version as well:

```python
ai_msg = model_with_tools.invoke(
    "What's the weather like in LA and NY?",
    parallel_tool_calls=False
)
```

- **Structured output:** If we'll process the response with code later, getting a result made up of specific fields instead of free-form text can make things easier. With `with_structured_output()`, we can define a Pydantic schema and ask the model for output that conforms to it. This lets us handle, for example, the joke text and its rating as separate fields:

```python
from pydantic import BaseModel, Field

class Joke(BaseModel):
    '''A joke to tell the user.'''
    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline of the joke")
    rating: int | None = Field(description="How funny the joke is, from 1 to 10")

structured_model = model.with_structured_output(Joke)
result = structured_model.invoke("Tell me a joke about cats")
```

**Expected mock output:**
```python
Joke(
    setup="Why was the cat sitting on the computer?",
    punchline="To keep an eye on the mouse!",
    rating=None,
)
```

- **JSON mode:** Another option is to request a response in JSON format. We can request a JSON object with `bind(response_format={"type": "json_object"})`. JSON mode constrains the format; if we need to guarantee that the fields conform exactly to our expected schema, structured output may be a better approach:

```python
json_model = model.bind(response_format={"type": "json_object"})
ai_msg = json_model.invoke(
    "Return a JSON object with a 'random_ints' key containing 10 random integers from 0 to 99"
)
```

**Expected mock output:**
```python
'{"random_ints": [23, 87, 45, 12, 78, 34, 56, 90, 11, 67]}'
```

- **Logprobs:** We can use the `logprobs=True` option when we want to inspect probability information for the tokens generated by the model. This information can help with analysis and debugging, but it should not be treated on its own as an explanation of why the model gave a particular response:

```python
logprobs_model = model.bind(logprobs=True)
ai_msg = logprobs_model.invoke(messages)
print(ai_msg.response_metadata["logprobs"])
```

**Expected mock output (truncated):**
```python
{
    "content": [
        {
            "token": "J",
            "bytes": [74],
            "logprob": -4.9617593e-06,
            "top_logprobs": [],
        },
        {
            "token": "'adore",
            "bytes": [39, 97, 100, 111, 114, 101],
            "logprob": -0.25202933,
            "top_logprobs": [],
        },
        # ...
    ]
}
```

- **OpenAI-compatible APIs:** During local development or when trying out different services, we may want to work with OpenAI-compatible endpoints such as LM Studio, vLLM, or Ollama. We can specify the target address with `base_url` and use `extra_body` for provider-specific parameters. Compatibility doesn't mean that every service supports every feature; adapt the example to your service's settings:

```python
model = ChatOpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio",  # Any string will do
    model="mlx-community/QwQ-32B-4bit",
    temperature=0,
    extra_body={
        "ttl": 300  # Automatically unload the model after 5 minutes of inactivity
    },
)
```

- **Prompt caching:** If we frequently send requests with long, repeated prompts, caching can help with performance and cost. OpenAI may automatically cache eligible prompts; `prompt_cache_key` helps route related requests and improve cache hits. The effect depends on the request structure and the provider's current behavior:

```python
response = model.invoke(
    messages,
    prompt_cache_key="example-key-a",  # Improves cache hits by routing to the same machine
)
```

We can see details about caching in the response's `usage_metadata` field. For example, information about tokens read from the cache may appear under `input_token_details`. Since the returned fields may depend on the API and LangChain version, it's a good idea to check that a field exists before reading it in your application.

- **Responses API and conversation state:** We can enable `use_responses_api=True` to use OpenAI's Responses API. We can continue a conversation on the server side by passing the ID of the previous response as `previous_response_id` in the next call. This example demonstrates referencing the previous response instead of resending the entire conversation history with every call; make sure your model and API settings support this flow:

```python
model = ChatOpenAI(
    model="...",
    use_responses_api=True,
    output_version="responses/v1",
)
response = model.invoke("Hello, my name is Bob.")
second_response = model.invoke(
    "What was my name?",
    previous_response_id=response.response_metadata["id"],
)
print(second_response.text)
```

**Expected mock output:**
```
"Your name is Bob. How can I help you today, Bob?"
```

- **Reasoning summary:** For models that support the Responses API, it may be possible to configure the reasoning effort allocated to the model and the level of summary to provide. The settings below illustrate this feature. Not every model and API configuration supports the same options; also, the summary shown here should not be treated as a complete transcript of the model's internal process:

```python
reasoning = {
    "effort": "medium",  # 'low', 'medium', or 'high'
    "summary": "auto",   # 'detailed', 'auto', or None
}
model = ChatOpenAI(
    model="...", reasoning=reasoning, output_version="responses/v1"
)
response = model.invoke("What is 3^3?")
```

**Expected mock output:**
```
Output: 3³ = 27
Reasoning: The user wants to know the third power of 3...
```

It's best to start by trying one of these examples in your own project. See you in the next article.

## Resources

Keep in mind that the parameters and features used here may change between versions. Before moving an example into your own project, it's good practice to verify provider-specific options in the official documentation.

- [LangChain Models documentation](https://docs.langchain.com/oss/python/langchain/models) – Model initialization, parameters, invocation methods, tool calling, and structured output
- [LangChain Agents documentation](https://docs.langchain.com/oss/python/langchain/agents) – `create_agent`, agent state, invocation, and streaming
- [Official `ChatOpenAI` reference](https://reference.langchain.com/python/langchain-openai/chat_models/base/ChatOpenAI) – The complete parameter list for the `ChatOpenAI` class, the `AIMessage` structure, tool calling, structured output, JSON mode, logprobs, prompt caching, the Responses API, and OpenAI-compatible endpoint examples