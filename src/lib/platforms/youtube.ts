import { createReadStream, unlinkSync, createWriteStream } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { get } from 'https'

export async function postToYouTube(account: any, videoUrl: string, caption: any) {
  const { access_token } = account

  // Download video to temp file
  const tmpPath = join(tmpdir(), `yt_${Date.now()}.mp4`)
  await downloadFile(videoUrl, tmpPath)

  try {
    // Upload video using YouTube resumable upload API
    const metadata = {
      snippet: {
        title: caption.title,
        description: caption.description,
        tags: caption.tags.split(',').map((t: string) => t.trim()),
        categoryId: '22',
      },
      status: { privacyStatus: 'public' },
    }

    // Step 1: Initiate resumable upload session
    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': 'video/mp4',
        },
        body: JSON.stringify(metadata),
      }
    )

    if (!initRes.ok) {
      const err = await initRes.text()
      throw new Error(`YouTube init failed: ${err}`)
    }

    const uploadUrl = initRes.headers.get('location')
    if (!uploadUrl) throw new Error('No upload URL from YouTube')

    // Step 2: Upload the video file
    const { readFileSync, statSync } = await import('fs')
    const fileBuffer = readFileSync(tmpPath)
    const fileSize = statSync(tmpPath).size

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize.toString(),
      },
      body: fileBuffer,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      throw new Error(`YouTube upload failed: ${err}`)
    }
  } finally {
    try { unlinkSync(tmpPath) } catch {}
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    get(url, res => {
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', err => { try { unlinkSync(dest) } catch {}; reject(err) })
  })
}
