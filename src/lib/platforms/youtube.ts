import axios from 'axios'
import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as os from 'os'

export async function postToYouTube(account: any, videoUrl: string, caption: any) {
  const { access_token, refresh_token } = account

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
  )

  oauth2Client.setCredentials({ access_token, refresh_token })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

  // Download video to temp file
  const tmpPath = path.join(os.tmpdir(), `yt_${Date.now()}.mp4`)
  await downloadFile(videoUrl, tmpPath)

  try {
    await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: caption.title,
          description: caption.description,
          tags: caption.tags.split(',').map((t: string) => t.trim()),
          categoryId: '22', // People & Blogs
        },
        status: { privacyStatus: 'public' },
      },
      media: {
        mimeType: 'video/mp4',
        body: fs.createReadStream(tmpPath),
      },
    })
  } finally {
    fs.unlinkSync(tmpPath)
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, res => {
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err) })
  })
}
