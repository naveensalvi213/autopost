import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateCaptions(prompt: string): Promise<{
  youtube: { title: string; description: string; tags: string }
  instagram: { caption: string; hashtags: string }
  facebook: { caption: string }
  pinterest: { title: string; description: string }
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const systemPrompt = `You are a social media expert. Given a video description, generate optimized content for each platform.
  Return ONLY valid JSON with this exact structure:
  {
    "youtube": { "title": "...", "description": "...", "tags": "tag1,tag2,tag3" },
    "instagram": { "caption": "...", "hashtags": "#tag1 #tag2 #tag3" },
    "facebook": { "caption": "..." },
    "pinterest": { "title": "...", "description": "..." }
  }
  
  Guidelines:
  - YouTube title: SEO optimized, 60-70 chars, engaging
  - YouTube description: 200-300 words, includes keywords
  - Instagram caption: conversational, engaging, 150 chars max before hashtags
  - Instagram hashtags: 15-20 relevant hashtags
  - Facebook caption: friendly, 100-150 chars
  - Pinterest title: 50-100 chars, keyword rich
  - Pinterest description: 100-200 chars`

  const result = await model.generateContent(`${systemPrompt}\n\nVideo description: ${prompt}`)
  const text = result.response.text()
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse AI response')
  
  return JSON.parse(jsonMatch[0])
}
