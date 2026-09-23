import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoPost — Post Once, Reach Everywhere',
  description: 'Upload one video and automatically post to Instagram, Facebook, YouTube, and Pinterest with AI-generated captions.',
  keywords: 'social media, auto post, instagram, facebook, youtube, pinterest, video posting',
  openGraph: {
    title: 'AutoPost — Post Once, Reach Everywhere',
    description: 'Upload one video and automatically post to all your social media platforms.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
