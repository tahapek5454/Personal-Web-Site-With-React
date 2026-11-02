import { ImageResponse } from 'next/og'
import type { Locale } from '@/content/dictionary'
import { topicLabel, type PostMeta } from './blog'
import { formatDate } from './blogShared'

export const postOgSize = { width: 1200, height: 630 }

export function postOgImage(lang: Locale, post: PostMeta) {
    const fontSize = post.title.length > 70 ? 56 : 68
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#eeeeee',
                    color: '#111111',
                    padding: 80,
                }}
            >
                <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#1d4ed8' }}>
                    {topicLabel(lang, post.topic).title.toUpperCase()}
                </div>
                <div style={{ display: 'flex', fontSize, fontWeight: 800, lineHeight: 1.15 }}>{post.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 30, color: '#555555' }}>
                    <div style={{ display: 'flex' }}>Taha Pek</div>
                    <div style={{ display: 'flex' }}>{formatDate(lang, post.date)}</div>
                </div>
            </div>
        ),
        postOgSize,
    )
}
