import type { MetadataRoute } from 'next'
import { siteConfig } from '../config/site'

// Search crawlers, user-triggered agent fetchers and training crawlers are all allowed.
const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'Applebot', 'Applebot-Extended',
    'CCBot', 'Bytespider', 'Amazonbot', 'cohere-ai', 'MistralAI-User', 'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: '*', allow: '/' },
            { userAgent: aiBots, allow: '/' },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
        host: siteConfig.url,
    }
}
