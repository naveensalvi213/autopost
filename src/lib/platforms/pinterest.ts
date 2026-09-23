import axios from 'axios'

export async function postToPinterest(account: any, videoUrl: string, caption: any) {
  const { access_token, account_id } = account

  // Step 1: Register media upload
  const registerRes = await axios.post(
    'https://api.pinterest.com/v5/media',
    { media_type: 'video' },
    { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' } }
  )

  const { media_id, upload_url, upload_parameters } = registerRes.data

  // Step 2: Upload video to Pinterest's S3
  const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' })
  const formData = new FormData()
  Object.entries(upload_parameters).forEach(([k, v]) => formData.append(k, v as string))
  formData.append('file', new Blob([videoRes.data], { type: 'video/mp4' }))
  await axios.post(upload_url, formData)

  // Step 3: Create Pin
  await axios.post(
    'https://api.pinterest.com/v5/pins',
    {
      board_id: account_id,
      title: caption.title,
      description: caption.description,
      media_source: {
        source_type: 'video_id',
        cover_image_url: '',
        media_id,
      },
    },
    { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' } }
  )
}
