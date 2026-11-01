import type { Locale } from './dictionary'

export interface ProjectText {
    title: string
    description: string
    longDescription: string
}

export interface Project {
    slug: string
    githubUrl: string
    technologies: string[]
    image?: { src: string; width: number; height: number }
    featured?: boolean
    kind: 'SoftwareSourceCode' | 'CreativeWork'
    text: Record<Locale, ProjectText>
}

export const projects: Project[] = [
    {
        slug: 'cinema-microservices-d-tix',
        githubUrl: 'https://github.com/tahapek5454/Cinema-MicroServices',
        technologies: ['.NET', 'Vue', 'Kubernetes', 'PostgreSQL', 'Redis'],
        image: { src: '/images/d-tix.webp', width: 1350, height: 610 },
        featured: true,
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'Sinema Mikroservis (D-TIX)',
                description: 'Sinema uygulaması için geliştirdiğim mikroservis mimarisi projesi',
                longDescription:
                    'Modern bir sinema yönetim sistemi. .NET Core, Docker ve Kubernetes kullanılarak geliştirilmiştir. Mikroservis mimarisine sahip ve bulut tabanlı bir yaklaşımla tasarlanmıştır.',
            },
            en: {
                title: 'Cinema Microservices (D-TIX)',
                description: 'A microservice architecture project I built for a cinema application',
                longDescription:
                    'A modern cinema management system built with .NET Core, Docker and Kubernetes. It follows a microservice architecture and is designed with a cloud-based approach.',
            },
        },
    },
    {
        slug: 'ai-chatagent-with-mcp',
        githubUrl: 'https://github.com/tahapek5454/AI-ChatAgent-With-MCP',
        technologies: ['.NET Core', 'Semantic Kernel', 'OpenAI', 'MCP', 'C#'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'AI-ChatAgent-With-MCP',
                description: 'OpenAI modelleriyle entegre, MCP destekli .NET tabanlı sohbet ajanı.',
                longDescription:
                    'OpenAI modellerini Model Context Protocol (MCP) ile entegre eden, genişletilebilir araç desteği ve özel yapay zeka yetenekleri sunan .NET tabanlı bir sohbet ajanı.',
            },
            en: {
                title: 'AI-ChatAgent-With-MCP',
                description: 'A .NET chat agent integrated with OpenAI models and powered by MCP.',
                longDescription:
                    'A .NET-based chat agent that integrates OpenAI models through the Model Context Protocol (MCP), offering extensible tool support and custom AI capabilities.',
            },
        },
    },
    {
        slug: 'dodka-tubitak',
        githubUrl: 'https://github.com/orgs/Abvag-Bitirme-OCR/repositories',
        technologies: ['Python', 'React Native', 'YOLO', 'Google Vision API'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'DODKA (TÜBİTAK)',
                description: 'Görme engelli bireyler için sesli-interaktif doküman arama sistemi.',
                longDescription:
                    'Bu çalışmada, görme engelli bireylerin dijital olmayan dokümanlar üzerinde sesli ve interaktif olarak arama yapmalarına imkan sağlayan mobil destekli bir sistem geliştirilmiştir.',
            },
            en: {
                title: 'DODKA (TÜBİTAK)',
                description: 'A voice-interactive document search system for visually impaired people.',
                longDescription:
                    'A mobile-supported system that lets visually impaired people search non-digital documents interactively by voice.',
            },
        },
    },
    {
        slug: 'self-waiter',
        githubUrl: 'https://github.com/tahapek5454/Self-Waiter',
        technologies: ['Vue.js', '.Net', 'Redis', 'WebSocket', 'PostgreSQL'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'Self Waiter',
                description: 'Kafe ve restoranlarda sipariş verme ve takip etme sistemi.',
                longDescription:
                    'Bu projenin amacı, kafe ve restoranlarda herhangi bir zaman kaybı yaşamadan kare kod ile menü görüntülemenin (çoklu dil destekli) yanı sıra sipariş verme ve siparişi takip etme sistemi kurmaktır.',
            },
            en: {
                title: 'Self Waiter',
                description: 'An ordering and order-tracking system for cafes and restaurants.',
                longDescription:
                    'The goal of this project is a system for cafes and restaurants where guests view the menu through a QR code (multi-language), place orders and track them without wasting time.',
            },
        },
    },
    {
        slug: 'diabetes-prediction-ann',
        githubUrl: 'https://github.com/tahapek5454/Diabetes-Prediction-with-ANN',
        technologies: ['Python', 'ANN'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'Yapay Sinir Ağı ile Diyabet Tahmini',
                description: 'Diyabet hastalığı tahmini için yapay sinir ağı ile sınıflandırma modeli.',
                longDescription:
                    'Bu çalışmada amaç, diyabet hasta tespitini kendi oluşturduğum nöron ağı mimarisiyle tespit etmeye yarayan bir sınıflandırma ağı inşa etmektir. Mimariye uygun feed-forward ve back-propagation algoritmaları yazılmıştır.',
            },
            en: {
                title: 'Diabetes Prediction with an Artificial Neural Network',
                description: 'A classification model for predicting diabetes with an artificial neural network.',
                longDescription:
                    'The goal of this work is to build a classification network that detects diabetes patients using a neuron network architecture I designed myself. Feed-forward and back-propagation algorithms were implemented for the architecture.',
            },
        },
    },
    {
        slug: 'saga-pattern-orchestration',
        githubUrl: 'https://github.com/tahapek5454/Saga-Pattern-Orchestration-Eventual-Consistency',
        technologies: ['.Net', 'C#', 'Saga Pattern', 'Orchestration', 'Eventual Consistency'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'Saga-Pattern-Orchestration-Eventual-Consistency',
                description: 'Distributed sistemlerde veri tutarlılığını sağlamak için kullanılan yöntemlerden biridir.',
                longDescription:
                    'Bu çalışmada amaç, distributed sistemlerde veri tutarlılığını sağlanması için kullanılan yöntemlerden olan Eventual Consistency yöntemini Saga Orchestration yaklaşımıyla birlikte ele almaktır.',
            },
            en: {
                title: 'Saga-Pattern-Orchestration-Eventual-Consistency',
                description: 'One of the methods used to keep data consistent in distributed systems.',
                longDescription:
                    'This work covers Eventual Consistency, a method used to keep data consistent in distributed systems, together with the Saga Orchestration approach.',
            },
        },
    },
    {
        slug: 'react-agent-with-langgraph',
        githubUrl: 'https://github.com/tahapek5454/ReAct-Agent-With-LangGraph',
        technologies: ['Python', 'LangChain', 'LangGraph'],
        kind: 'SoftwareSourceCode',
        text: {
            tr: {
                title: 'ReAct-Agent-With-LangGraph',
                description: 'LangGraph kullanılarak geliştirilen ReAct (Reasoning and Acting) yaklaşımını benimseyen agent geliştirmeleri.',
                longDescription:
                    'Bu projede, LangChain ve LangGraph frameworklerini kullanarak karmaşık LLM orkestrasyon mimarileri geliştirdim. ReAct (Reasoning and Acting) yaklaşımını benimseyerek, büyük dil modellerini iş süreçlerine entegre eden akıllı agent sistemleri ve çok adımlı akışlar tasarladım.',
            },
            en: {
                title: 'ReAct-Agent-With-LangGraph',
                description: 'Agent implementations built with LangGraph that follow the ReAct (Reasoning and Acting) approach.',
                longDescription:
                    'In this project I built complex LLM orchestration architectures with the LangChain and LangGraph frameworks. Following the ReAct (Reasoning and Acting) approach, I designed intelligent agent systems and multi-step flows that integrate large language models into business processes.',
            },
        },
    },
]

export function getProject(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug)
}
