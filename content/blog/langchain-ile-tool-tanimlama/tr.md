---
title: "LangChain'de Tool Tanımlama: Agent'ı Dış Dünyaya Bağlamak"
description: "LangChain'de tool nedir, @tool ile nasıl tanımlanır, şema, dönüş değeri, hata yönetimi ve dinamik tool seçimi nasıl çalışır? Sorularına cevap arıyoruz."
date: 2026-11-22
topic: ai
tags: [langchain, agents, tools, python]
draft: false
---

Bir LLM tek başına metin üretebilir; ancak bugünün hava durumunu sorgulayamaz, veritabanına bağlanamaz, dosya oluşturamaz ya da sipariş durumunu kontrol edemez. **Tool'lar, modelin dış dünyayla konuşmasını sağlayan, iyi tanımlanmış Python fonksiyonlarıdır** ve agent'ın asıl gücünü ortaya çıkaran bileşen de budur.

Önceki yazılarda [model işlemlerini](/blog/langchain-ile-model-islemleri) ve [agent oluşturmayı](/blog/langchain-ile-agent-olusturma) konuşmuştuk. Bu yazıda ise tool'ların nasıl tanımlandığına, modele nasıl göründüğüne ve agent döngüsüne nasıl bağlandığına odaklanıyoruz.

> **Bu yazının kapsamı:** `state`, `context` ve `store` kavramlarına yalnızca tool'larla ilişkileri açısından kısaca değiniyoruz. Bu kavramları ilerleyen yazılarda ayrı ayrı ve ayrıntılı biçimde ele alacağız. Hepsini bir anda öğrenmemiz gerekmiyor; şimdilik tool'ların bunlara nasıl eriştiğini görmek yeterli.

## Tool nedir, neden gereklidir?

LangChain'de bir tool; adı, açıklaması, giriş şeması ve çalıştırılabilir bir fonksiyon gövdesinden oluşur. Model, konuşma bağlamına göre hangi tool'u çağıracağına ve hangi argümanları vereceğine karar verir. Tool çalıştıktan sonra sonuç `ToolMessage` olarak mesaj akışına eklenir ve model bir sonraki adımı belirler.

Akış kısaca şöyledir:

1. Kullanıcı bir istek gönderir.
2. Model uygun tool'u ve argümanlarını seçer.
3. LangChain ilgili Python fonksiyonunu çalıştırır.
4. Fonksiyonun sonucu modele geri iletilir.
5. Model sonucu değerlendirir; gerekirse başka bir tool çağırır ya da kullanıcıya yanıt verir.

Örneğin "İstanbul'da hava nasıl?" sorusu için model, `get_weather` adlı tool'u `city="İstanbul"` argümanıyla çağırabilir. Tool gerçek bir hava durumu API'sine bağlanıp sonucu döndürür, model de bunu kullanıcıya doğal dille açıklar.

## Temel tool tanımı: `@tool`

Tool oluşturmanın en pratik yolu `@tool` decorator'ıdır. Fonksiyon adı varsayılan olarak tool adı olur; docstring ise modelin tool'u ne zaman ve nasıl kullanacağını anlamasına yardım eden açıklamaya dönüşür.

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

Buradaki kritik nokta, **type hint'lerin zorunlu olmasıdır**. `query: str` ve `limit: int` tanımları, modelin hangi tipte veri göndermesi gerektiğini belirleyen input şemasını oluşturur. Docstring'i de ciddiye almakta fayda var: model, tool'un amacını ve parametrelerinin anlamını büyük ölçüde buradan çıkarır. Belirsiz bir docstring yanlış tool seçimine ya da yanlış argümana yol açabilir.

### Ad ve açıklamayı özelleştirmek

Fonksiyon adı model için yeterince net olmayabilir; `search` yerine `web_search` gibi. `@tool`'a isim ya da `description` vererek bunu özelleştirebiliriz.

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

Tool adlarında `snake_case` kullanmak iyi bir pratik. Boşluk ya da özel karakter içeren adlar bazı model sağlayıcılarında uyumluluk sorunlarına yol açabiliyor.

## Gelişmiş şema: Pydantic ve JSON Schema

Basit tool'lar için type hint'ler yeterli. Daha karmaşık girişler, varsayılan değerler, açıklamalar ya da kısıtlamalar gerektiğinde Pydantic modeli veya JSON Schema kullanmak daha doğru olur.

### Pydantic ile şema

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

Bu örnekte:

- **`location`:** zorunlu bir string parametredir.
- **`units`:** yalnızca `"celsius"` veya `"fahrenheit"` olabilir.
- **`include_forecast`:** varsayılan değeri `False` olan bir boolean'dır.
- **`Field(description=...)`:** her alan için modele açıklayıcı bilgi sağlar.

### JSON Schema ile şema

Pydantic yerine doğrudan JSON Schema da verebiliriz:

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

JSON Schema, dış sistemlerden gelen şemaları olduğu gibi kullanmak istediğimizde pratik. Çoğu Python projesinde ise Pydantic; tip güvenliği ve okunabilirlik açısından daha rahat bir seçim.

## Rezerve parametre adları

`config` ve `runtime` isimleri LangChain tarafından içsel amaçlarla rezerve edilmiştir; kendi argümanlarımız için kullanamayız.

| Parametre | Amaç |
|---|---|
| `config` | `RunnableConfig` bilgisinin tool'a dahili olarak aktarılması |
| `runtime` | `ToolRuntime` üzerinden state, context ve store erişimi |

Runtime bilgisine erişmek istediğimizde parametreyi `ToolRuntime` tipinde tanımlamamız gerekiyor.

## `ToolRuntime`: tool'un çalışma zamanı bilgisine erişimi

Tool'lar yalnızca dış API çağırmak için değildir. Konuşma geçmişini okuyabilir, kullanıcı tercihlerini güncelleyebilir, kalıcı hafızaya yazabilir ya da uzun süren işlemlerde canlı durum bildirebilir. Bunların anahtarı `ToolRuntime` parametresidir.

> **Not:** `state`, `context` ve `store` konularına bu yazıda yalnızca tool'larla ilişkisi kadar değiniyoruz. Her birini ilerleyen yazılarda ayrıntılı ele alacağız; aşağıdaki örnekler tool tarafındaki kullanımı göstermek için var.

| Bileşen | Açıklama | Kullanım senaryosu |
|---|---|---|
| `state` | Kısa süreli hafıza; konuşmanın mesajları ve özel alanları | Konuşma geçmişini okumak, sayaç tutmak |
| `context` | Çağrı sırasında iletilen değişmez yapılandırma | Kullanıcı kimliği, oturum bilgisi |
| `store` | Konuşmalar arasında kalıcı uzun süreli hafıza | Kullanıcı tercihlerini saklamak |
| `stream_writer` | Tool çalışırken gerçek zamanlı güncelleme yayınlamak | Uzun işlemlerde ilerleme göstermek |
| `execution_info` | Thread ID, run ID ve retry bilgisi | Loglama, tekrar deneme davranışı |
| `server_info` | Agent Server'da assistant, graph ve kullanıcı bilgisi | Sunucu tarafında kimlik/ortam bilgisi |
| `config` | `RunnableConfig`; callback, tag ve metadata | İzleme ve yapılandırma |
| `tool_call_id` | Güncel tool çağrısının benzersiz kimliği | Sonucu doğru çağrıyla eşleştirmek |

Önemli bir ayrıntı: `runtime` parametresi modele gösterilmez. Model yalnızca gerçek iş parametrelerini görür; `ToolRuntime` çağrı anında LangChain tarafından otomatik enjekte edilir.

### State okumak

State, konuşmanın yaşam döngüsü boyunca var olan kısa süreli hafızadır; mesaj geçmişini ve agent state'inde tanımladığımız özel alanları içerir.

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

Bu tool, modelin doğrudan erişemediği bir bilgiyi, yani en son kullanıcı mesajını programatik olarak okur. Model `runtime` parametresini görmez; yalnızca tool'un adını ve docstring'ini görür.

### State güncellemek: `Command`

Tool yalnızca okumak zorunda değil; kullanıcı adı, tercih edilen dil gibi alanları da güncelleyebilir. Bunun için `Command` döndürmemiz gerekiyor.

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

Burada dikkat edilmesi gereken nokta, `Command` ile state güncellerken mutlaka bir `ToolMessage` eklememiz gerektiğidir. `AIMessage` içindeki her tool call için mesaj geçmişinde karşılık gelen bir `ToolMessage` bulunmalı; aksi hâlde `ToolNode` `ValueError` fırlatır. Ayrıca paralel tool çağrıları aynı state alanını güncelleyebileceği için, çakışmaları yönetmek adına o alan için bir reducer tanımlamak iyi olur.

### Context ile çağrı bazlı yapılandırma

`context`, her çağrıda iletilen ve konuşma sırasında değişmesi beklenmeyen verileri taşır: kullanıcı kimliği, rol, oturum bilgisi gibi. `thread_id` konuşmayı kapsarken `context` tek bir çalıştırma için geçerlidir.

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

Bu örnekte `user_id` model tarafından belirlenmez; uygulamamız çağrı sırasında güvenli biçimde iletir. Böylece modelin kullanıcıdan kimlik istemesinin ya da yanlış kullanıcı adına işlem yapmasının önüne geçmiş oluruz.

### Store ile konuşmalar arası hafıza

`state` konuşma bittiğinde kaybolabilir; `store` ise konuşmalar arasında da yaşayan uzun süreli hafızadır. Kullanıcı tercihleri ya da kaydedilmiş bilgiler için uygundur.

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

Üretim ortamında `InMemoryStore` yerine `PostgresStore`, `MongoDBStore` ya da `RedisStore` gibi kalıcı bir store kullanmamız gerekiyor.

### Stream writer ile canlı ilerleme

Uzun süren işlemlerde kullanıcıya "veri aranıyor", "dosya işleniyor" gibi anlık geri bildirim vermek isteyebiliriz. Bunun için `runtime.stream_writer` kullanılır.

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

Bu özellik, tool'un LangGraph execution context'i içinde çağrılmasını gerektirdiği için streaming senaryolarında işe yarar.

## Tool dönüş değerleri

Tool'un ne döndürdüğü, agent'ın sonraki davranışını doğrudan etkiler. Dört dönüş tipi öne çıkıyor: string, obje, multimodal içerik ve `Command`.

### String

En yaygın yaklaşım, okunabilir bir metin döndürmektir. Bu metin `ToolMessage`'a dönüşür ve model yanıtını buna göre oluşturur.

```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"It is currently sunny in {city}."
```

### Yapılandırılmış obje

Modelin alanları ayrı ayrı değerlendirmesini istiyorsak `dict` döndürebiliriz. Serbest metne göre daha güvenilir bir veri akışı sağlar.

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

### Multimodal içerik

Model destekliyorsa metin, görsel, ses ya da video içeren content block'lar da döndürebiliriz. Döndürdüğümüz modalitenin model tarafından desteklendiğinden emin olmakta fayda var.

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

Tool sonuç döndürmek yerine agent state'ini değiştirmek istiyorsa `Command` döndürür. Böylece hem veri üretip hem de uygulama durumunu güncelleyebilir.

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

## `return_direct=True`: ekstra model çağrısını atlamak

Bazı tool'ların sonucu zaten kullanıcıya gösterilecek nihai cevaptır. Bu durumda modelin sonucu yeniden yorumlamasına gerek kalmaz. `return_direct=True` ile agent döngüsü kısalır ve tool çıktısı doğrudan kullanıcıya gider.

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

Avantajı, gereksiz bir LLM çağrısını önlemesi ve deterministik çıktı sağlamasıdır. Dezavantajı ise modelin sonucu özetleyememesi, açıklayamaması ya da başka tool'larla birleştirememesidir. Bu yüzden yalnızca sonucun kullanıcıya hazır olduğu durumlarda tercih etmek mantıklı. Paralel tool çağrılarında döngünün kısalması için o adımdaki **tüm** tool'ların `return_direct=True` olması gerekir; karışık çağrılarda agent tüm sonuçları modele geri gönderir.

## Hata yönetimi: `wrap_tool_call`

Gerçek dünyada tool'lar her zaman başarılı olmaz: API timeout olur, yetkisiz erişim yaşanır, geçersiz argüman gelir. Bu hataları middleware ile yakalayıp modele anlamlı bir `ToolMessage` olarak iletebiliriz.

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

Bu yaklaşım hatayı sessizce yutmak yerine modelin durumu anlamasını ve kullanıcıya daha uygun bir yanıt vermesini sağlar.

## Dinamik tool seçimi

Her durumda tüm tool'ları modele açmak doğru değildir. Çok fazla tool context'i şişirir ve yanlış seçim olasılığını artırır. Dinamik tool seçimi; kimlik doğrulama, kullanıcı rolü, feature flag ya da konuşma aşamasına göre modelin gördüğü tool setini değiştirir.

### State'e göre filtreleme

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

Bu örnekte kullanıcı kimlik doğrulaması yapmadıysa yalnızca `public_` önekli tool'lar görünür. Konuşmanın ilk aşamalarında ise `advanced_search` gizlenir.

### Context'e göre yetki filtreleme

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

Bu desen özellikle kurumsal uygulamalarda önemli: admin tüm tool'lara erişir, editor silemez, viewer yalnızca okuma tool'larını görür.

### Runtime'da tool kaydetmek

Bazen tool'lar baştan bilinmez; MCP sunucusundan, uzak bir registry'den ya da kullanıcı verisine göre çalışma anında keşfedilir. Bu durumda tool'u hem `wrap_model_call` ile modele tanıtmamız hem de `wrap_tool_call` ile çalıştırılmasını sağlamamız gerekiyor.

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

`wrap_tool_call` hook'u, runtime'da eklenen tool'ların nasıl çalıştırılacağını agent'ın bilmesi için gereklidir.

## Headless tool'lar: istemci tarafında çalıştırma

Bazı işlemler sunucuda değil, kullanıcının tarayıcısında ya da cihazında yapılmalıdır: geolocation, clipboard, file picker, IndexedDB gibi. Bunun için **headless tool** deseni kullanılır.

Headless tool sunucuda yalnızca ad, açıklama ve argüman şemasıyla tanımlanır; gerçek implementasyon istemci tarafındadır. Model tool'u normal şekilde çağırır, graph interrupt olur ve istemci işlemi gerçekleştirip sonucu graph'a geri gönderir.

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

Bu desen gizlilik gerektiren, cihaza özgü ya da düşük gecikmeli işlemler için uygun. Örneğin kullanıcının konumu sunucuya gönderilmeden tarayıcıda okunabilir.

## Hazır tool'lar ve MCP

Her tool'u sıfırdan yazmamız gerekmiyor. LangChain; web search, code interpreter, veritabanı erişimi gibi yaygın işler için hazır tool ve toolkit'ler sunuyor. Kategorilere ayrılmış tam liste için [tools ve toolkits entegrasyon sayfasına](https://docs.langchain.com/oss/python/integrations/tools) göz atabiliriz. Yeni bir tool yazmadan önce ihtiyacımızı karşılayan hazır bir seçenek olup olmadığını kontrol etmekte fayda var.

Ayrıca **Model Context Protocol (MCP)**, agent'ları dış servislere standart bir arayüzle bağlamayı sağlayan açık bir protokoldür. Bir MCP sunucusuna bağlandığımızda, sunucunun sunduğu tool'ları LangChain tool'larına dönüştürüp agent'a verebiliriz.

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

MCP sayesinde veritabanları, API'ler, dosya sistemleri ve tarayıcılar gibi kaynaklara özel entegrasyon kodu yazmadan erişebiliriz.

## Pratik öneriler

Tool tasarımı agent kalitesini doğrudan etkiler. Akılda tutmakta fayda olan noktaları şöyle özetleyebiliriz:

- **İsimlendirme:** tool adlarını kısa, açıklayıcı ve `snake_case` tutmak.
- **Docstring:** modelin anlayacağı şekilde net ve öz yazmak.
- **Tipler:** her parametre için type hint kullanmak, karmaşık girişlerde Pydantic tercih etmek.
- **Açıklamalar:** `Field(description=...)` ile parametre anlamlarını açıkça belirtmek.
- **Çıktı:** mümkün olduğunca yapılandırılmış tutmak, gereksiz serbest metinden kaçınmak.
- **Güvenlik:** yetkisiz ya da hassas işlemleri context/rol bazlı filtrelemeyle korumak.
- **Hatalar:** middleware ile yakalayıp modele anlamlı `ToolMessage` olarak iletmek.
- **`return_direct=True`:** yalnızca sonucun zaten nihai olduğu durumlarda kullanmak.
- **Tool sayısı:** çok fazla tool'u aynı anda açmak yerine dinamik filtreleme yapmak.

## Kapanış

Tool'lar, bir modeli yalnızca konuşan bir sistemden iş yapan bir agent'a dönüştüren parçadır. `@tool` ile başlayıp şema, `ToolRuntime`, dönüş tipleri, hata yönetimi ve dinamik seçimle ilerlediğimizde; iyi tasarlanmış küçük fonksiyonların agent kalitesini ne kadar etkilediğini görüyoruz.

Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Burada anlatılan API'ler ve parametreler sürümlere göre değişebilir. Kullandığımız sürüme ait ayrıntıları resmi dokümantasyondan doğrulamak iyi bir alışkanlıktır.

- [LangChain Tools Documentation](https://docs.langchain.com/oss/python/langchain/tools) – tool tanımlama, şema, `ToolRuntime` ve dönüş tipleri
- [LangChain Agents Documentation](https://docs.langchain.com/oss/python/langchain/agents) – agent döngüsü ve middleware
- [LangChain Tools Integrations](https://docs.langchain.com/oss/python/integrations/tools) – hazır tool ve toolkit listesi
- [LangChain create_agent Reference](https://reference.langchain.com/python/langchain/agents/create_agent) – `create_agent` parametreleri
- [LangChain tool Reference](https://reference.langchain.com/python/langchain-core/tools/convert/tool) – `@tool` decorator referansı
