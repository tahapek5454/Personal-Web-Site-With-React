import { ImageResponse } from 'next/og'

export const alt = 'Taha Pek - Full Stack Software Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
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
          PORTFOLIO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, lineHeight: 1 }}>
            Taha Pek
          </div>
          <div style={{ display: 'flex', fontSize: 52, color: '#444444', marginTop: 24 }}>
            Full Stack Software Developer
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#555555' }}>
          .NET · Next.js · Nuxt.js · Vue · AI Agents
        </div>
      </div>
    ),
    size,
  )
}
