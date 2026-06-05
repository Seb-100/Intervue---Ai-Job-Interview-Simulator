import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { contextId } = await req.json().catch(() => ({}));

    const apiKey = process.env.LIVEAVATAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing LIVEAVATAR_API_KEY' }, { status: 500 });
    }

    // Use Alex context for setup, Jordan context for interview
    const resolvedContextId = contextId
      || process.env.LIVEAVATAR_JORDAN_CONTEXT_ID
      || process.env.LIVEAVATAR_ALEX_CONTEXT_ID;

    const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        mode: 'FULL',
        is_sandbox: true,           // ← flip to false for production
        avatar_id: process.env.LIVEAVATAR_AVATAR_ID,
        interactivity_type: 'CONVERSATIONAL',
        avatar_persona: {
          voice_id: process.env.LIVEAVATAR_VOICE_ID,
          context_id: resolvedContextId, // ← your prompt lives here
          language: 'en',
          voice_settings: {
            provider: 'elevenLabs',
            speed: 1,
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0,
            use_speaker_boost: true,
            model: 'eleven_flash_v2_5',
          },
        },
        video_settings: {
          quality: 'high',
          encoding: 'H264',
        },
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('LiveAvatar token error:', resData);
      return NextResponse.json(
        { error: resData.message || `LiveAvatar error ${response.status}` },
        { status: response.status }
      );
    }

    const token = resData.data?.session_token;
    if (!token) {
      return NextResponse.json(
        { error: 'session_token missing from LiveAvatar response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Session route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}