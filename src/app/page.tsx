'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: '⚡', title: 'Upload Once', desc: 'Drop your video one time — we handle the rest across all platforms automatically.' },
  { icon: '🤖', title: 'AI Captions', desc: 'Gemini AI writes the perfect caption, title, hashtags and description for each platform.' },
  { icon: '🔒', title: 'Client Privacy', desc: 'Each client connects their own accounts. You never see their passwords or tokens.' },
  { icon: '📊', title: 'Live Status', desc: 'Watch your post go live on each platform in real time with a beautiful status board.' },
  { icon: '📅', title: 'Schedule Posts', desc: 'Pick a date and time — your video gets posted automatically while you sleep.' },
  { icon: '👥', title: 'Multi-Client', desc: 'Manage unlimited clients from one dashboard. Perfect for agencies and freelancers.' },
]

const platforms = [
  { name: 'Instagram', color: '#e1306c', gradient: 'from-pink-500 to-orange-400', icon: '📸' },
  { name: 'Facebook', color: '#1877f2', gradient: 'from-blue-500 to-blue-700', icon: '👍' },
  { name: 'YouTube', color: '#ff0000', gradient: 'from-red-500 to-red-700', icon: '▶️' },
  { name: 'Pinterest', color: '#e60023', gradient: 'from-red-500 to-pink-600', icon: '📌' },
]

export default function LandingPage() {
  const [email, setEmail] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#07070f' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7, 7, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 15px rgba(139,92,246,0.4)'
          }}>⚡</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>AutoPost</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{
            color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500,
            padding: '8px 16px', borderRadius: 10,
            transition: 'color 0.2s'
          }}>Log in</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', padding: '140px 24px 80px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 20, padding: '6px 14px', marginBottom: 32,
          fontSize: 13, color: '#a78bfa', fontWeight: 500
        }}>
          <Star size={12} fill="currentColor" />
          AI-Powered Social Media Automation
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
          margin: '0 auto 24px'
        }}>
          Post Once.
          <br />
          <span className="gradient-text">Reach Everywhere.</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#94a3b8', maxWidth: 560,
          margin: '0 auto 48px', lineHeight: 1.7
        }}>
          Upload one video and AutoPost instantly publishes it to Instagram, Facebook,
          YouTube, and Pinterest — with AI-crafted captions for each platform.
        </p>

        {/* Platform pills */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          {platforms.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '8px 16px',
              fontSize: 14, color: '#e2e8f0', fontWeight: 500
            }}>
              <span>{p.icon}</span> {p.name}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: 'white', textDecoration: 'none',
            padding: '16px 32px', borderRadius: 14, fontWeight: 700,
            fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 30px rgba(139,92,246,0.4)',
            transition: 'all 0.3s ease'
          }}>
            Start for Free <ArrowRight size={18} />
          </Link>
          <Link href="/login" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e2e8f0', textDecoration: 'none',
            padding: '16px 32px', borderRadius: 14, fontWeight: 600,
            fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Visual demo */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
            {/* Upload bar */}
            <div style={{
              background: 'rgba(139,92,246,0.1)', border: '2px dashed rgba(139,92,246,0.3)',
              borderRadius: 16, padding: 40, textAlign: 'center', marginBottom: 24
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
              <p style={{ color: '#a78bfa', fontWeight: 600, fontSize: 16 }}>Drop your video here</p>
              <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>MP4, MOV, AVI up to 2GB</p>
            </div>
            {/* Platform results */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {platforms.map((p, i) => (
                <div key={p.name} className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, fontSize: 20,
                    background: `rgba(${p.color}, 0.1)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>✓ AI caption ready</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: i < 2 ? '#10b981' : '#f59e0b' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}>
            Everything you need
          </h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 56, fontSize: 16 }}>
            Built for agencies and creators who post at scale
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="glass" style={{ padding: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>{f.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div className="glass" style={{ maxWidth: 600, margin: '0 auto', padding: '48px 40px', borderRadius: 24 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Ready to save hours every week?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 16 }}>
            Join agencies and creators already automating their social media.
          </p>
          <Link href="/signup" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: 'white', textDecoration: 'none',
            padding: '16px 40px', borderRadius: 14, fontWeight: 700,
            fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 30px rgba(139,92,246,0.4)'
          }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>⚡ AutoPost</span>
        <span style={{ color: '#475569', fontSize: 13 }}>© 2025 AutoPost. All rights reserved.</span>
      </footer>
    </div>
  )
}
