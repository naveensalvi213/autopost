'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Film } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', icon: '👍' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
]

export default function HistoryPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setPosts(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Post History</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>All your published and scheduled posts</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="loading-skeleton" style={{ height: 80, borderRadius: 14 }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass" style={{ padding: '64px 32px', borderRadius: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>No posts yet</h2>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>Create your first post to see it here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map(post => (
            <div key={post.id} className="glass" style={{ padding: '20px 24px', borderRadius: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
              }}>🎬</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 6,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.description?.slice(0, 80) || 'Untitled post'}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(post.platforms || []).map((p: string) => {
                    const pl = PLATFORMS.find(pl => pl.id === p)
                    return pl ? (
                      <span key={p} style={{
                        fontSize: 12, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.06)', color: '#94a3b8'
                      }}>{pl.icon} {pl.name}</span>
                    ) : null
                  })}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ marginBottom: 6 }}>
                  <span className={`badge badge-${post.status === 'posted' ? 'success' : post.status === 'failed' ? 'error' : 'warning'}`}>
                    {post.status === 'posted' ? '✓' : post.status === 'failed' ? '✗' : '⏳'} {post.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
