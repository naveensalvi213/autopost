'use client'
import { useState } from 'react'
import { ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#e1306c',
    bg: 'rgba(225,48,108,0.08)',
    borderColor: 'rgba(225,48,108,0.2)',
    requirements: 'Business or Creator account + connected Facebook Page',
    docUrl: 'https://developers.facebook.com/docs/instagram-api',
    envKeys: ['META_APP_ID', 'META_APP_SECRET'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👍',
    color: '#1877f2',
    bg: 'rgba(24,119,242,0.08)',
    borderColor: 'rgba(24,119,242,0.2)',
    requirements: 'Facebook Page (not personal profile) with admin access',
    docUrl: 'https://developers.facebook.com/docs/graph-api',
    envKeys: ['META_APP_ID', 'META_APP_SECRET'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: '#ff0000',
    bg: 'rgba(255,0,0,0.08)',
    borderColor: 'rgba(255,0,0,0.2)',
    requirements: 'Google account with YouTube channel',
    docUrl: 'https://developers.google.com/youtube/v3',
    envKeys: ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: '#e60023',
    bg: 'rgba(230,0,35,0.08)',
    borderColor: 'rgba(230,0,35,0.2)',
    requirements: 'Pinterest Business account with approved API access',
    docUrl: 'https://developers.pinterest.com/docs/api/v5/',
    envKeys: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET'],
  },
]

const setupSteps = {
  instagram: [
    'Go to developers.facebook.com and create an app',
    'Add the "Instagram Graph API" product to your app',
    'Connect a Facebook Page and Instagram Business account',
    'Get your App ID and App Secret',
    'Add META_APP_ID and META_APP_SECRET to your environment variables',
    'Click "Connect" below and authenticate',
  ],
  facebook: [
    'Go to developers.facebook.com and create an app (same as Instagram)',
    'Add the "Facebook Login" product',
    'Set up permissions: pages_manage_posts, pages_read_engagement',
    'Add META_APP_ID and META_APP_SECRET to environment variables',
    'Click "Connect" below and select your Facebook Page',
  ],
  youtube: [
    'Go to console.cloud.google.com',
    'Create a new project and enable YouTube Data API v3',
    'Go to Credentials → Create OAuth 2.0 Client ID',
    'Add your domain to authorized redirect URIs',
    'Copy Client ID and Client Secret',
    'Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to environment variables',
    'Click "Connect" below to authenticate your YouTube channel',
  ],
  pinterest: [
    'Go to developers.pinterest.com',
    'Create a new app and request Standard access',
    'Set redirect URI to your-domain.com/api/connect/pinterest/callback',
    'Copy App ID and App Secret',
    'Add PINTEREST_APP_ID and PINTEREST_APP_SECRET to environment variables',
    'Click "Connect" below to link your Pinterest Business account',
  ],
}

export default function ConnectPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Connect Social Accounts</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>
          Link your social media accounts to start posting. Each client connects their own accounts.
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 14, padding: '16px 20px', marginBottom: 28,
        display: 'flex', gap: 12, alignItems: 'flex-start'
      }}>
        <AlertCircle size={20} color="#a78bfa" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa', marginBottom: 4 }}>Setup Required</div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            To connect social accounts, you first need to create developer apps on each platform.
            Expand each platform below to see the exact steps. This is a one-time setup.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PLATFORMS.map(platform => (
          <div key={platform.id} className="glass" style={{ borderRadius: 18, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: platform.bg, border: `1px solid ${platform.borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
              }}>{platform.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{platform.name}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{platform.requirements}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="badge badge-warning">Not Connected</span>
                <button onClick={() => setExpanded(expanded === platform.id ? null : platform.id)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 500
                  }}>
                  {expanded === platform.id ? 'Hide steps' : 'How to setup'}
                </button>
              </div>
            </div>

            {/* Expanded steps */}
            {expanded === platform.id && (
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '20px 24px',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
                  Setup Steps for {platform.name}:
                </h3>
                <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(setupSteps[platform.id as keyof typeof setupSteps]).map((step, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#a78bfa'
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5, paddingTop: 3 }}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <a href={platform.docUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#94a3b8', textDecoration: 'none'
                    }}>
                    <ExternalLink size={14} /> Official Docs
                  </a>
                  <button style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: `linear-gradient(135deg, ${platform.color}, ${platform.color}99)`,
                    border: 'none', color: 'white', cursor: 'pointer',
                    opacity: 0.5
                  }} disabled title="Add your API keys to environment variables first">
                    Connect {platform.name} (Add API keys first)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div style={{
        marginTop: 28, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 14, padding: '20px 24px'
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>✅ Next Steps</div>
        <ol style={{ paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>
          <li>Create developer apps on each platform (one time setup)</li>
          <li>Add the API keys to your Vercel environment variables</li>
          <li>Come back here and click Connect for each platform</li>
          <li>Start posting to all platforms with one click!</li>
        </ol>
      </div>
    </div>
  )
}
