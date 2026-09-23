'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, Upload, Wand2, Send, CheckCircle, XCircle, Edit3, RotateCcw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Step = 'upload' | 'describe' | 'generating' | 'review' | 'posting' | 'done'

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#e1306c' },
  { id: 'facebook', name: 'Facebook', icon: '👍', color: '#1877f2' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#e60023' },
]

export default function NewPostPage() {
  const [step, setStep] = useState<Step>('upload')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [captions, setCaptions] = useState<any>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'facebook', 'youtube', 'pinterest'])
  const [postResults, setPostResults] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setVideoFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'video/*': [] }, maxFiles: 1, maxSize: 2 * 1024 * 1024 * 1024
  })

  const uploadVideo = async () => {
    if (!videoFile) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', videoFile)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVideoUrl(data.url)
      setStep('describe')
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const generateCaptions = async () => {
    if (!description.trim()) return
    setStep('generating')
    setError('')
    try {
      const res = await fetch('/api/generate-captions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCaptions(data.captions)
      setStep('review')
    } catch (err: any) {
      setError(err.message || 'Caption generation failed')
      setStep('describe')
    }
  }

  const postToAll = async () => {
    setStep('posting')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch('/api/post', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, description, captions, platforms: selectedPlatforms, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPostResults(data.results)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Posting failed')
      setStep('review')
    }
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const steps = ['upload', 'describe', 'review', 'posting', 'done']
  const stepIndex = steps.indexOf(step === 'generating' ? 'describe' : step)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Create New Post</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>Upload once, post everywhere automatically</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {['Upload', 'Describe', 'Review', 'Post'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: i <= stepIndex ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(255,255,255,0.06)',
                color: i <= stepIndex ? 'white' : '#475569',
                border: i === stepIndex ? '2px solid #a78bfa' : '2px solid transparent',
                boxShadow: i <= stepIndex ? '0 0 15px rgba(139,92,246,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>{i < stepIndex ? '✓' : i + 1}</div>
              <span style={{ fontSize: 12, color: i <= stepIndex ? '#a78bfa' : '#475569', fontWeight: i === stepIndex ? 600 : 400 }}>
                {label}
              </span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 2, background: i < stepIndex ? '#8b5cf6' : 'rgba(255,255,255,0.06)', margin: '0 8px', marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 24, color: '#ef4444', fontSize: 14
        }}>{error}</div>
      )}

      {/* STEP 1: Upload */}
      {step === 'upload' && (
        <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Upload Your Video</h2>
          <div {...getRootProps()} style={{
            border: `2px dashed ${isDragActive ? '#8b5cf6' : videoFile ? '#10b981' : 'rgba(139,92,246,0.3)'}`,
            borderRadius: 16, padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
            background: isDragActive ? 'rgba(139,92,246,0.08)' : videoFile ? 'rgba(16,185,129,0.05)' : 'rgba(139,92,246,0.04)',
            transition: 'all 0.3s ease'
          }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: 52, marginBottom: 16 }}>{videoFile ? '✅' : '🎬'}</div>
            {videoFile ? (
              <div>
                <p style={{ color: '#10b981', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{videoFile.name}</p>
                <p style={{ color: '#475569', fontSize: 13 }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB — Ready to upload</p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#a78bfa', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                  {isDragActive ? 'Drop it here!' : 'Drag & drop your video here'}
                </p>
                <p style={{ color: '#475569', fontSize: 13 }}>or click to browse — MP4, MOV, AVI up to 2GB</p>
              </div>
            )}
          </div>
          {videoFile && (
            <button onClick={uploadVideo} className="btn-primary" disabled={uploading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '14px 24px', fontSize: 15 }}>
              {uploading ? <><Loader2 size={18} /> Uploading...</> : <><Upload size={18} /> Upload Video</>}
            </button>
          )}
        </div>
      )}

      {/* STEP 2: Describe */}
      {step === 'describe' && (
        <div className="glass" style={{ padding: 32, borderRadius: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Describe Your Video</h2>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
            Tell Gemini AI what your video is about — it will write perfect captions for each platform.
          </p>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Video description</label>
            <textarea className="input" rows={5}
              placeholder="e.g. A tutorial on how to make homemade pasta from scratch. I show the ingredients, kneading technique, and how to cut it into different shapes. Ends with a plating shot."
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label" style={{ marginBottom: 12 }}>Post to platforms</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderRadius: 12, cursor: 'pointer', border: '2px solid',
                  borderColor: selectedPlatforms.includes(p.id) ? p.color : 'rgba(255,255,255,0.08)',
                  background: selectedPlatforms.includes(p.id) ? `${p.color}15` : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.2s ease', width: '100%', textAlign: 'left'
                }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{p.name}</span>
                  {selectedPlatforms.includes(p.id) && <CheckCircle size={16} color={p.color} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generateCaptions} className="btn-primary" disabled={!description.trim() || selectedPlatforms.length === 0}
            style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15 }}>
            <Wand2 size={18} /> Generate AI Captions
          </button>
        </div>
      )}

      {/* STEP: Generating */}
      {step === 'generating' && (
        <div className="glass" style={{ padding: 48, borderRadius: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🤖</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>Generating Captions...</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28 }}>
            Gemini AI is crafting perfect captions for each platform
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={32} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 'review' && captions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Review & Edit Captions</h2>
            <button onClick={generateCaptions} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 13
            }}>
              <RotateCcw size={14} /> Regenerate
            </button>
          </div>

          {/* YouTube */}
          {selectedPlatforms.includes('youtube') && (
            <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>▶️</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>YouTube</span>
              </div>
              <label className="label">Title</label>
              <input className="input" value={captions.youtube.title}
                onChange={e => setCaptions({ ...captions, youtube: { ...captions.youtube, title: e.target.value } })}
                style={{ marginBottom: 12 }} />
              <label className="label">Description</label>
              <textarea className="input" rows={4} value={captions.youtube.description}
                onChange={e => setCaptions({ ...captions, youtube: { ...captions.youtube, description: e.target.value } })}
                style={{ marginBottom: 12 }} />
              <label className="label">Tags</label>
              <input className="input" value={captions.youtube.tags}
                onChange={e => setCaptions({ ...captions, youtube: { ...captions.youtube, tags: e.target.value } })} />
            </div>
          )}

          {/* Instagram */}
          {selectedPlatforms.includes('instagram') && (
            <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>📸</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Instagram</span>
              </div>
              <label className="label">Caption</label>
              <textarea className="input" rows={3} value={captions.instagram.caption}
                onChange={e => setCaptions({ ...captions, instagram: { ...captions.instagram, caption: e.target.value } })}
                style={{ marginBottom: 12 }} />
              <label className="label">Hashtags</label>
              <input className="input" value={captions.instagram.hashtags}
                onChange={e => setCaptions({ ...captions, instagram: { ...captions.instagram, hashtags: e.target.value } })} />
            </div>
          )}

          {/* Facebook */}
          {selectedPlatforms.includes('facebook') && (
            <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>👍</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Facebook</span>
              </div>
              <label className="label">Caption</label>
              <textarea className="input" rows={3} value={captions.facebook.caption}
                onChange={e => setCaptions({ ...captions, facebook: { ...captions.facebook, caption: e.target.value } })} />
            </div>
          )}

          {/* Pinterest */}
          {selectedPlatforms.includes('pinterest') && (
            <div className="glass" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>📌</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Pinterest</span>
              </div>
              <label className="label">Title</label>
              <input className="input" value={captions.pinterest.title}
                onChange={e => setCaptions({ ...captions, pinterest: { ...captions.pinterest, title: e.target.value } })}
                style={{ marginBottom: 12 }} />
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={captions.pinterest.description}
                onChange={e => setCaptions({ ...captions, pinterest: { ...captions.pinterest, description: e.target.value } })} />
            </div>
          )}

          <button onClick={postToAll} className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: 16 }}>
            <Send size={18} /> Post to {selectedPlatforms.length} Platform{selectedPlatforms.length > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* STEP 4: Posting */}
      {step === 'posting' && (
        <div className="glass" style={{ padding: 48, borderRadius: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>Posting to all platforms...</h2>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>Sit back and relax — we&apos;re handling everything</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 32 }}>
            {PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => (
              <div key={p.id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                <Loader2 size={16} color={p.color} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Done */}
      {step === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Posted Successfully!</h2>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>Your video has been published to all selected platforms</p>
          </div>
          {postResults.map((r: any) => (
            <div key={r.platform} className="glass" style={{ padding: 20, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>{PLATFORMS.find(p => p.id === r.platform)?.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>
                  {PLATFORMS.find(p => p.id === r.platform)?.name}
                </div>
                <div style={{ fontSize: 13, color: r.status === 'success' ? '#10b981' : '#ef4444', marginTop: 2 }}>
                  {r.status === 'success' ? '✓ Posted successfully' : `✗ ${r.error || 'Failed — connect your account first'}`}
                </div>
              </div>
              {r.status === 'success' ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
            </div>
          ))}
          <button onClick={() => { setStep('upload'); setVideoFile(null); setVideoUrl(''); setDescription(''); setCaptions(null); }}
            className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', marginTop: 8 }}>
            Create Another Post
          </button>
        </div>
      )}
    </div>
  )
}
