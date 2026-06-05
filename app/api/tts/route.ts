import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'nova' } = await req.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Strip any config/metadata lines before sending to TTS
    const cleanText = text
      .replace(/SETUP_COMPLETE/g, '')
      .replace(/INTERVIEW_COMPLETE/g, '')
      .replace(/CONFIG:\{.*?\}/g, '')
      .trim()

    if (!cleanText) {
      return NextResponse.json({ error: 'Empty text after cleaning' }, { status: 400 })
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice, // nova = warm female, onyx = deep male, alloy = neutral
      input: cleanText,
      speed: 1.0,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
