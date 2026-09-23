import axios from 'axios'

export async function postToInstagram(account: any, videoUrl: string, caption: any) {
  const { access_token, account_id } = account
  const fullCaption = `${caption.caption}\n\n${caption.hashtags}`

  // Step 1: Create media container
  const containerRes = await axios.post(
    `https://graph.facebook.com/v19.0/${account_id}/media`,
    {
      video_url: videoUrl,
      caption: fullCaption,
      media_type: 'REELS',
    },
    { params: { access_token } }
  )

  const containerId = containerRes.data.id

  // Step 2: Wait for container to be ready
  let status = 'IN_PROGRESS'
  let attempts = 0
  while (status === 'IN_PROGRESS' && attempts < 30) {
    await new Promise(r => setTimeout(r, 5000))
    const statusRes = await axios.get(
      `https://graph.facebook.com/v19.0/${containerId}`,
      { params: { fields: 'status_code', access_token } }
    )
    status = statusRes.data.status_code
    attempts++
  }

  if (status !== 'FINISHED') throw new Error(`Instagram container status: ${status}`)

  // Step 3: Publish
  await axios.post(
    `https://graph.facebook.com/v19.0/${account_id}/media_publish`,
    { creation_id: containerId },
    { params: { access_token } }
  )
}
