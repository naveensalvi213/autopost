'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordStrength = password.length >= 8 ? 'good' : password.length >= 4 ? 'weak' : 'none'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      })
      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', background: '#07070f',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.1), transparent)'
      }}>
        <div className="glass" style={{ padding: '48px 40px', borderRadius: 24, textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 28
          }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Check your email!</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            We sent a confirmation link to <strong style={{ color: '#f1f5f9' }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
            Go to Login <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: '#07070f',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15), transparent)'
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 20px rgba(139,92,246,0.4)'
            }}>⚡</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>AutoPost</span>
          </Link>
        </div>

        <div className="glass" style={{ padding: '40px 36px', borderRadius: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Create account</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>Start posting smarter today</p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#ef4444', fontSize: 14
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="Your name"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} className="input"
                  placeholder="Minimum 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={8} style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
                    display: 'flex', alignItems: 'center'
                  }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: passwordStrength === 'good' ? '#10b981' : passwordStrength === 'weak' && i === 1 ? '#f59e0b' : 'rgba(255,255,255,0.1)'
                    }} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15 }}>
              {loading ? <Loader2 size={18} /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
