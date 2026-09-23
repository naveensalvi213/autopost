import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { postToInstagram } from '@/lib/platforms/instagram'
import { postToFacebook } from '@/lib/platforms/facebook'
import { postToYouTube } from '@/lib/platforms/youtube'
import { postToPinterest } from '@/lib/platforms/pinterest'

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, description, captions, platforms, userId } = await request.json()

    if (!videoUrl || !captions || !platforms?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save post to database
    const { data: post, error: dbError } = await supabase.from('posts').insert({
      user_id: userId,
      video_url: videoUrl,
      description,
      captions,
      platforms,
      status: 'posting',
    }).select().single()

    if (dbError) throw dbError

    // Get user's connected social accounts
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)

    const accountMap = (accounts || []).reduce((acc: any, account: any) => {
      acc[account.platform] = account
      return acc
    }, {})

    // Post to each platform
    const results = await Promise.allSettled(
      platforms.map(async (platform: string) => {
        const account = accountMap[platform]
        if (!account) {
          return { platform, status: 'failed', error: 'Account not connected. Go to Connect Accounts to link your ' + platform }
        }

        try {
          switch (platform) {
            case 'instagram':
              await postToInstagram(account, videoUrl, captions.instagram)
              break
            case 'facebook':
              await postToFacebook(account, videoUrl, captions.facebook)
              break
            case 'youtube':
              await postToYouTube(account, videoUrl, captions.youtube)
              break
            case 'pinterest':
              await postToPinterest(account, videoUrl, captions.pinterest)
              break
          }
          return { platform, status: 'success' }
        } catch (err: any) {
          return { platform, status: 'failed', error: err.message }
        }
      })
    )

    const finalResults = results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { platform: platforms[i], status: 'failed', error: 'Unknown error' }
    )

    const allFailed = finalResults.every((r: any) => r.status === 'failed')

    // Update post status
    await supabase.from('posts').update({
      status: allFailed ? 'failed' : 'posted',
      platform_results: finalResults,
    }).eq('id', post.id)

    return NextResponse.json({ results: finalResults, success: true })
  } catch (error: any) {
    console.error('Post error:', error)
    return NextResponse.json({ error: error.message || 'Posting failed' }, { status: 500 })
  }
}
