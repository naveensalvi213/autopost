'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Link as LinkIcon, History, Settings, LogOut, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/new-post', icon: PlusCircle, label: 'New Post' },
  { href: '/dashboard/connect', icon: LinkIcon, label: 'Connect Accounts' },
  { href: '/dashboard/history', icon: History, label: 'Post History' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 16px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 8px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 15px rgba(139,92,246,0.3)'
        }}>⚡</div>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>AutoPost</span>
      </Link>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
              fontSize: 14, fontWeight: active ? 600 : 500,
              color: active ? '#a78bfa' : '#94a3b8',
              background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
              border: active ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 10, width: '100%',
        background: 'none', border: '1px solid transparent', cursor: 'pointer',
        fontSize: 14, fontWeight: 500, color: '#64748b',
        transition: 'all 0.2s ease',
      }}
        onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ef4444'; (e.target as HTMLElement).style.borderColor = 'rgba(239,68,68,0.2)' }}
        onMouseLeave={e => { (e.target as HTMLElement).style.color = '#64748b'; (e.target as HTMLElement).style.borderColor = 'transparent' }}>
        <LogOut size={18} />
        Log out
      </button>
    </aside>
  )
}
