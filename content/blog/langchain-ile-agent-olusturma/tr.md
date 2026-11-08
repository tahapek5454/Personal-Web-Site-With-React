---
title: "LangChain ile Agent Oluşturma: Modelden Öteye"
description: "LangChain'de agent nedir, neden tek bir model yetmez ve create_agent ile temel bir agent nasıl kurulur? Sorularına cevap arıyoruz."
date: 2026-11-08
topic: ai
tags: [langchain, agents, python, ai]
draft: false
---

Bir dil modeli tek başına metin üretebilir; ancak gerçek dünyadaki görevleri **planlamak, araç kullanmak, sonuçları değerlendirmek ve gerekirse tekrar denemek** için yeterli değildir. İşte bu noktada devreye **agent** girer: modelin, bir hedefe ulaşana kadar araçları çağırmasını ve kararlar almasını sağlayan sistemdir. LangChain'de bu yapı `create_agent` ile kurulur.

Önceki yazıda [LangChain ile model oluşturmayı](/blog/langchain-ile-model-islemleri) konuşmuştuk. Bu yazıda ise modeli "sohbet eden bir asistan" olmaktan çıkarıp, **görev üreten ve araç kullanan bir çalışma arkadaşı** hâline getiren agent kavramına odaklanıyoruz.

## Agent nedir?

LangChain'in tanımıyla agent, **belirli bir görev tamamlanana kadar modelin araçları çağırdığı bir döngüdür**. Bu döngünün etrafındaki prompt, araçlar ve middleware katmanlarına ise *harness* denir. Formül olarak şöyle özetleyebiliriz:

```text
Agent = Model + Harness
```

Buradaki *harness*; modele ne yapması gerektiğini söyleyen sistem promptu, hangi araçlara erişebileceğini belirleyen tool tanımları ve davranışı şekillendiren middleware bileşenlerinden oluşur.

Bunu bir mutfağa benzetebiliriz: model, kararları veren şeftir; tools mutfaktaki ekipmanlardır; system prompt ise şefe verilen tariftir. Şef ne kadar yetenekli olursa olsun, elinde fırın ya da tarif yoksa istenen yemeği çıkaramaz.

Akışı basit bir şemayla şöyle gösterebiliriz:

```text
Kullanıcı görevi
      │
      ▼
   Model  ◄──────────────┐
      │                  │
Araç gerekli mi?         │
   ├─ Evet → Tool çağrısı → Tool sonucu
   └─ Hayır → Final yanıt
```

Model, kullanıcının isteğini alır; gerekirse bir araç seçer, aracın döndürdüğü sonucu okur ve tekrar karar verir. Model artık araç çağrısı üretmediğinde döngü biter ve kullanıcıya nihai yanıt döner.

## Neden tek model yeterli değil?

Bir LLM, güçlü bir dil modeli olsa da doğası gereği yalnızca eğitildiği bilgiye ve kendisine verilen bağlama dayanır. Oysa gerçek uygulamalarda çoğu görev; güncel veri, özel sistemler, dosyalar, veritabanları veya harici servisler gerektirir.

| İhtiyaç | Sadece model | Agent |
|---|---|---|
| Güncel bilgi | Eğitim tarihine bağlıdır | Web arama, API veya veritabanı aracını kullanabilir |
| Şirket içi veri | Erişemez | CRM, doküman veya SQL araçlarını çağırabilir |
| Dosya oluşturma | Metin üretebilir | Dosya sistemi araçlarıyla dosya yazabilir |
| Çok adımlı iş | Tek yanıtta sınırlıdır | Planlar, araç çalıştırır, sonucu değerlendirir |
| Doğrulanabilir çıktı | Serbest metin üretir | Yapılandırılmış şema döndürebilir |

Anthropic'in agent tanımı da bu fikri destekler: agent'lar, çevreden gelen geri bildirime göre araçları kullanan ve süreci kendileri yönlendiren LLM sistemleridir.

**Önemli ayrım – agent ve workflow:** *Workflow*'larda adımlar önceden tanımlanmış kod yollarıyla düzenlenir; agent'ta ise bir sonraki adıma model karar verir. Adımları baştan biliyorsak workflow, adımlar duruma göre değişiyorsa agent daha uygun bir tercih olabilir.

Örneğin "Bana yapay zekâ güvenliği alanındaki son gelişmeleri özetle" isteği için model yalnızca ezberindeki bilgilerle yanıt verebilir. Agent ise arama aracını çağırır, sonuçları toplar, gerekiyorsa ikinci bir arama yapar ve sonrasında özet üretir.

## Agent'ın temel parçaları

LangChain agent'ının çekirdeği dört bileşene dayanır: **model, tools, system prompt ve agent state**. Bunlara ek olarak `response_format`, `checkpointer` ve `middleware` gibi parametreler agent'ı üretim ortamına uygun hâle getirir.

> **Bu yazının kapsamı:** Burada agent kavramını, agent'ın neden gerekli olduğunu ve temel bir agent'ın nasıl kurulduğunu ele alıyoruz. `tools`, `agent state`, `response_format`, `checkpointer` ve `middleware` gibi bileşenleri ise yalnızca agent ile birlikte nasıl kullanıldıkları çerçevesinde tanıtıyoruz. Bu başlıkların her biri ayrı bir uzmanlık alanı kadar derindir; ilerleyen yazılarda tek tek açacağız. Bu yazıyı agent'ların **genel haritası** olarak düşünebilirsiniz.

Haritadaki ana duraklar şunlar:

- **Tools:** Agent'ın dış dünyayla konuşmasını sağlayan araçlar; API çağrıları, arama, veritabanı sorguları ve dosya işlemleri.
- **Agent state:** Agent'ın kısa süreli hafızası; konuşma geçmişi, araç sonuçları, sayaçlar ve özel iş durumu.
- **Middleware:** Agent yaşam döngüsüne müdahale eden katman; hata yönetimi, guardrails, insan onayı, loglama ve bağlam yönetimi.
- **Checkpointer ve `thread_id`:** Agent'ın konuşma geçmişini saklaması ve çok turlu konuşmaları sürdürebilmesi.
- **Structured output:** Agent çıktısının serbest metin yerine doğrulanabilir bir şemaya dönüştürülmesi.

### Model

`model` parametresi, agent'ın "beynini" belirler. Burada `"provider:model"` biçiminde bir model kimliği ya da doğrudan başlatılmış bir model nesnesi kullanılabilir.

```python
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-5.5",
    tools=tools,
)
```

Model seçimi yalnızca kaliteyi değil; gecikmeyi, maliyeti, bağlam penceresini ve araç çağırma yeteneğini de etkiler. Basit görevler için hızlı modeller, karmaşık analiz ve kodlama görevleri için daha güçlü modeller tercih edilebilir.

### Tools

Tools, modelin dünyayla etkileşim kurmasını sağlayan fonksiyonlardır. LangChain'de bir Python fonksiyonu, `BaseTool` nesnesi ya da tool sözlüğü agent'a verilebilir.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Verilen sorgu için web araması yapar."""
    return f"Arama sonuçları: {query}"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
)
```

İyi bir tool tanımının en kritik kısmı docstring'dir. Model, hangi aracı ne zaman kullanacağını büyük ölçüde bu açıklamadan anlar. Bu nedenle araç adları net, parametreler açık ve docstring'ler eylem odaklı olmalıdır.

```python
@tool
def get_weather(city: str) -> str:
    """Belirtilen şehir için güncel hava durumu bilgisini döndürür."""
    ...
```

### System prompt

`system_prompt`, agent'ın rolünü, sınırlarını, tonunu ve görev yaklaşımını belirler. Bu parametre string ya da `SystemMessage` alabilir; model çağrısından önce mesaj listesinin başına eklenir.

```python
agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search],
    system_prompt=(
        "Sen bir araştırma asistanısın. "
        "Güncel bilgi gerektiren sorularda search aracını kullan. "
        "Yanıtlarında kaynakları belirt ve emin olmadığın bilgileri tahmin etme."
    ),
)
```

İyi bir system prompt yalnızca "yardımcı ol" demez. Agent'a şunları söyler:

- Hangi role sahip olduğunu
- Hangi araçları ne zaman kullanması gerektiğini
- Hangi bilgilerin doğrulanması gerektiğini
- Yanıt formatının nasıl olması gerektiğini
- Hangi durumlarda kullanıcıya soru sorması gerektiğini

### Agent state

`AgentState`, agent'ın çalışma sırasındaki bağlamını tutan tipli bir sözlüktür. Varsayılan olarak konuşma geçmişini taşıyan `messages` alanını içerir; ayrıca `user_id`, sayaçlar veya iş durumu gibi özel alanlar eklenebilir.

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

Bu yapı, agent'ın yalnızca geçmiş konuşmayı değil; görev ilerleyişini, kullanıcı bağlamını ve middleware'in ihtiyaç duyduğu verileri de yönetmesini sağlar.

## Agent döngüsü nasıl çalışır?

`create_agent` altında çalışan temel akış oldukça nettir:

1. Model, sistem promptu ve mevcut mesajlarla çağrılır.
2. Model bir `AIMessage` üretir.
3. Yanıtta `tool_calls` varsa ilgili araçlar çalıştırılır.
4. Araç sonuçları `ToolMessage` olarak mesaj listesine eklenir.
5. Model yeniden çağrılır.
6. Model artık araç çağrısı üretmediğinde agent son yanıtı döndürür.

"Bu hafta AI güvenliği haberlerini özetle" isteği için akış şöyle ilerler:

```text
Kullanıcı → Agent : "Bu hafta AI güvenliği haberlerini özetle"
Agent → Model     : prompt + araçlar
Model → Agent     : search("AI safety news")
Agent → Tool      : search çalıştır
Tool → Agent      : sonuçlar
Agent → Model     : güncel bağlam
Model → Agent     : nihai özet
Agent → Kullanıcı : özet
```

Bu döngü, agent'ı sıradan bir chatbot'tan ayıran temel noktadır. Model yalnızca bir kez yanıt üretmez; ihtiyaç duydukça araç çağırır, sonucu işler ve görev tamamlanana kadar devam eder.

## LangChain ile ilk agent

Aşağıdaki örnek, hava durumu bilgisini getiren basit bir agent oluşturur. Amaç, `model`, `tools` ve `system_prompt` parametrelerinin birlikte nasıl çalıştığını göstermektir.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Belirtilen şehir için güncel hava durumu bilgisini döndürür."""
    # Gerçek uygulamada burada bir hava durumu API'si çağrılır.
    return f"{city} için hava durumu: 18°C, parçalı bulutlu"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[get_weather],
    system_prompt=(
        "Sen yardımcı bir hava durumu asistanısın. "
        "Kullanıcı bir şehir sorarsa get_weather aracını kullan. "
        "Yanıtlarını kısa ve net tut."
    ),
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "San Francisco'da hava nasıl?"}]}
)

print(result["messages"][-1].content)
```

**Beklenen mock çıktı:**
```text
San Francisco'da hava şu anda 18°C ve parçalı bulutlu.
```

Gerçek çıktı model ve isteğe göre değişir; burada amaç akışı göstermektir.

Bu örnekte:

- `model`, karar mekanizmasını oluşturur.
- `get_weather`, agent'ın dış dünyaya erişim yeteneğini sağlar.
- `system_prompt`, agent'ın davranışını ve araç kullanım kuralını belirler.
- `invoke`, görevi başlatır ve agent döngüsünü çalıştırır.

## Yapılandırılmış çıktı

Agent'ın çıktısı her zaman serbest metin olmak zorunda değildir. `response_format` parametresi sayesinde model, Pydantic gibi bir şemaya uygun, doğrulanabilir bir yanıt üretebilir.

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
    {"messages": [{"role": "user", "content": "AI güvenliği trendlerini özetle"}]}
)

answer = result["structured_response"]
print(answer.summary)
print(answer.confidence)
```

Bu yaklaşım, agent çıktısının doğrudan bir uygulamaya, veritabanına ya da arayüze aktarılacağı senaryolarda çok değerlidir. Serbest metin ayrıştırmak yerine `summary`, `confidence` ve `sources` gibi alanları güvenilir biçimde kullanabiliriz.

## Hafıza ve çok turlu konuşma

Agent'ın önceki konuşmayı hatırlaması için bir `checkpointer` ve her konuşma için benzersiz bir `thread_id` gerekir. `thread_id`, konuşma geçmişini ve checkpoint'leri kapsar; böylece agent aynı sohbeti kaldığı yerden sürdürebilir.

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
    {"messages": [{"role": "user", "content": "San Francisco hava durumu nedir?"}]},
    config=config,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "Peki yarın nasıl olacak?"}]},
    config=config,
)
```

İkinci çağrıda "yarın" ifadesinin hangi şehre ait olduğu, ilk çağrıdaki bağlamdan anlaşılır. Bunun mümkün olmasının nedeni, aynı `thread_id` ile konuşma geçmişinin korunmasıdır.

## Middleware: Agent'ı üretim seviyesine taşımak

Basit agent'lar için `model`, `tools` ve `system_prompt` çoğu zaman yeterlidir. Ancak gerçek üretim ortamlarında agent'ın hatalara, uzun bağlamlara, yetkilendirmeye ve insan onayına ihtiyacı olur. LangChain'de bu ihtiyaçlar **middleware** ile karşılanır.

| Middleware alanı | Ne sağlar? |
|---|---|
| Execution environment | Dosya sistemi, sandbox ve kod çalıştırma |
| Context management | Özetleme, hafıza, skill yükleme ve prompt caching |
| Planning and delegation | Todo listeleri ve alt agent'lar |
| Fault tolerance | Retry, fallback ve çağrı limitleri |
| Guardrails | PII tespiti ve içerik kontrolleri |
| Steering | Yüksek etkili aksiyonlar için insan onayı |

Middleware, agent yaşam döngüsünün farklı noktalarına müdahale edebilir; bağlamı güncelleyebilir, araç erişimini kısıtlayabilir veya model davranışını şekillendirebilir. Örneğin bir agent'ın e-posta göndermeden veya dosya silmeden önce kullanıcı onayı alması istenebilir. Bu, agent'ı daha güçlü yapmanın yanında daha güvenli hâle de getirir.

## Agent yetenekleri

LangChain agent'ları yalnızca "araç çağıran model" değildir. Doğru harness ile oldukça geniş bir yetenek yelpazesine sahip olabilirler:

- **Araç kullanımı:** Arama, API çağrısı, veritabanı sorgusu, dosya okuma/yazma.
- **Planlama:** Karmaşık görevleri adımlara bölme ve todo listesi tutma.
- **Delegasyon:** Alt agent'lara görev verme ve paralel çalıştırma.
- **Bağlam yönetimi:** Uzun konuşmaları özetleme, kalıcı hafıza ve skill kullanımı.
- **Hata toleransı:** Geçici API hatalarında yeniden deneme ve yedek strateji.
- **Güvenlik:** Hassas veri filtreleme, içerik kontrolü ve insan onayı.
- **Yapılandırılmış çıktı:** Uygulamaların doğrudan tüketebileceği şemalı yanıtlar.

Özellikle uzun süreli araştırma veya kodlama görevlerinde `create_deep_agent`, dosya sistemi, özetleme, alt agent ve prompt caching gibi yaygın yetenekleri önceden birleştirilmiş biçimde sunar.

## Basit araştırma agent'ı

Aşağıdaki örnek, bir araştırma agent'ının temel iskeletini gösterir. Amaç karmaşık bir sistem kurmak değil; agent parametrelerinin birlikte nasıl kullanıldığını görmektir.

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Verilen konu için web araması yapar ve kısa sonuçlar döndürür."""
    return f"'{query}' için arama sonuçları"

@tool
def summarize(text: str) -> str:
    """Verilen metni kısa bir özete dönüştürür."""
    return f"Özet: {text[:200]}"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[search, summarize],
    system_prompt=(
        "Sen bir araştırma asistanısın. "
        "Önce search aracıyla güncel bilgi topla. "
        "Ardından summarize aracıyla bulguları özetle. "
        "Kaynak belirtmediğin iddialarda bulunma."
    ),
    name="research_assistant",
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "Yapay zekâ ajanlarında güvenlik için güncel yaklaşımları özetle.",
            }
        ]
    }
)

print(result["messages"][-1].content)
```

Buradaki `name="research_assistant"` parametresi, agent'ı çok agent'lı sistemlerde tanımlamak için kullanılabilir. Bu, özellikle agent'ın bir alt graf olarak başka bir agent tarafından çağrıldığı durumlarda faydalıdır.

## Ne zaman agent kullanmalı?

Her problem için agent gerekmez. Anthropic'in önerisi de nettir: mümkün olduğunca basit çözümle başlayın; yalnızca gerçekten dinamik karar verme ve araç kullanımı gerektiğinde agent'a geçin.

| Senaryo | Önerilen yaklaşım |
|---|---|
| Tek seferlik metin üretimi | Sadece model |
| Önceden bilinen adımlarla veri çekme | Workflow |
| Güncel bilgi gerektiren araştırma | Agent + search tool |
| Çok adımlı dosya veya kod işlemi | Agent + filesystem/code execution |
| Hassas aksiyon içeren otomasyon | Agent + guardrails + human-in-the-loop |
| Uzun süreli, parçalanabilir görev | Deep agent + subagents |

Agent, doğru soru değildir; **doğru problem için doğru soyutlamadır**. Basit bir chatbot'a tool eklemek her zaman agent yapmaz; asıl fark, modelin araç kullanımını ve sonraki adımı kendisinin belirlemesidir.

## Kapanış

LangChain agent'ı, modeli tek başına metin üreten bir sistem olmaktan çıkarıp görevleri tamamlayabilen bir çalışma birimine dönüştürür. `create_agent` ile model, araçlar, sistem promptu, state, response format ve middleware bir araya getirilerek bu yapı kurulur.

Bir sonraki yazıda agent'ların daha derin detaylarına gireceğiz: tool tasarımı, middleware, hafıza, guardrails, subagent'lar ve insan onayı mekanizmaları. Bu yazıdaki temel yapıyı kavradıysanız, agent'ların modern LLM uygulamalarının merkezinde neden yer aldığını çok daha net göreceksiniz. Bir sonraki yazıda görüşmek üzere.

## Kaynaklar

Burada kullanılan parametreler ve özellikler sürümler arasında değişebilir. Örnekleri kendi projenize taşımadan önce resmi dokümantasyondan doğrulamanız iyi bir alışkanlıktır.

- [LangChain Agents dokümantasyonu](https://docs.langchain.com/oss/python/langchain/agents) – `create_agent`, agent state, çağırma ve streaming
- [LangChain Models dokümantasyonu](https://docs.langchain.com/oss/python/langchain/models) – Model başlatma, parametreler, tool calling ve structured output
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) – Agent ve workflow ayrımı, ne zaman agent kullanılmalı
