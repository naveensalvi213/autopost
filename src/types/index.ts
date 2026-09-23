export type Platform = 'instagram' | 'facebook' | 'youtube' | 'pinterest'

export interface PlatformCaptions {
  youtube: { title: string; description: string; tags: string }
  instagram: { caption: string; hashtags: string }
  facebook: { caption: string }
  pinterest: { title: string; description: string }
}

export interface SocialAccount {
  id: string
  user_id: string
  platform: Platform
  access_token: string
  refresh_token?: string
  account_name: string
  account_id: string
  connected_at: string
}

export interface Post {
  id: string
  user_id: string
  video_url: string
  thumbnail_url?: string
  description: string
  captions: PlatformCaptions
  platforms: Platform[]
  status: 'draft' | 'posting' | 'posted' | 'failed'
  created_at: string
  platform_results?: PlatformResult[]
}

export interface PlatformResult {
  platform: Platform
  status: 'pending' | 'success' | 'failed'
  error?: string
  post_url?: string
  posted_at?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}
