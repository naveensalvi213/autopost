import { NextRequest, NextResponse } from 'next/server'
import { generateCaptions } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    const captions = await generateCaptions(description)
    return NextResponse.json({ captions, success: true })
  } catch (error: any) {
    console.error('Caption generation error:', error)
    return NextResponse.json({ error: error.message || 'Caption generation failed' }, { status: 500 })
  }
}
