import axios from 'axios'

export async function postToFacebook(account: any, videoUrl: string, caption: any) {
  const { access_token, account_id } = account

  // Post video to Facebook Page
  await axios.post(
    `https://graph.facebook.com/v19.0/${account_id}/videos`,
    {
      file_url: videoUrl,
      description: caption.caption,
      published: true,
    },
    { params: { access_token } }
  )
}
