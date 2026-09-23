'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, Film } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const platforms = [
  { name: 'Instagram', icon: '📸', color: '#e1306c', bg: 'rgba(225,48,108,0.1)' },
  { name: 'Facebook', icon: '👍', color: '#1877f2', bg: 'rgba(24,119,242,0.1)' },
  { name: 'YouTube', icon: '▶️', color: '#ff0000', bg: 'rgba(255,0,0,0.1)' },
  { name: 'Pinterest', icon: '📌', color: '#e60023', bg: 'rgba(230,0,35,0.1)' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setPosts(data || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const stats = [
    { label: 'Total Posts', value: posts.length, icon: Film, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Posted', value: posts.filter(p => p.status === 'posted').length, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Pending', value: posts.filter(p => p.status === 'draft').length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Failed', value: posts.filter(p => p.status === 'failed').length, icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ]

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there'

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
          Hey, {firstName} 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>
          Here&apos;s your posting overview
        </p>
      </div>

      {/* Quick action */}
      <Link href="/dashboard/new-post" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', borderRadius: 16, textDecoration: 'none',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.1))',
        border: '1px solid rgba(139,92,246,0.25)', marginBottom: 28,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(139,92,246,0.4)'
          }}>
            <PlusCircle size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Create New Post</div>
            <div style={{ fontSize: 13, color: '#a78bfa', marginTop: 2 }}>Upload once → post to all platforms with AI captions</div>
          </div>
        </div>
        <ArrowRight size={20} color="#a78bfa" />
      </Link>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass" style={{ padding: '20px 20px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
            }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Connect platforms */}
      <div className="glass" style={{ padding: '24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Connected Platforms</h2>
          <Link href="/dashboard/connect" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            Manage →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {platforms.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>Not connected</div>
              </div>
              <Link href="/dashboard/connect" style={{
                fontSize: 12, color: '#a78bfa', textDecoration: 'none',
                padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(139,92,246,0.3)',
                fontWeight: 500
              }}>Connect</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Recent Posts</h2>
          <Link href="/dashboard/history" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
            <p style={{ color: '#475569', fontSize: 15 }}>No posts yet. Create your first one!</p>
            <Link href="/dashboard/new-post" className="btn-primary"
              style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>
              <PlusCircle size={16} /> Create Post
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map((post) => (
              <div key={post.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8, background: 'rgba(139,92,246,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>🎬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.description?.slice(0, 60) || 'Untitled post'}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge badge-${post.status === 'posted' ? 'success' : post.status === 'failed' ? 'error' : 'warning'}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
