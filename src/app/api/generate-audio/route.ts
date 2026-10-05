import { NextRequest, NextResponse } from 'next/server';

// Server-side in-memory cache for audio generation to save API quota and ensure instant playback
const serverAudioCache = new Map<string, { buffer: ArrayBuffer; contentType: string }>();

// Voice mapping for warm children's storytelling
const VOICE_MAP: Record<string, string> = {
  mother: 'EXAVITQu4vr4xnSDxMaL',   // Sarah - gentle, soft maternal bedtime voice
  narrator: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - warm, expressive grandfatherly storyteller
  father: 'pNInz6obpgDQGcFmaJgB',   // Adam - friendly, calm fatherly voice
};

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = 'mother' } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Clean text from markdown formatting and emojis for clean natural speech
    const cleanText = text
      .replace(/[*_#«»"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const targetVoiceId = VOICE_MAP[voiceId] || voiceId || VOICE_MAP.mother;
    const cacheKey = `${targetVoiceId}_${cleanText.slice(0, 100)}_${cleanText.length}`;

    // 1. Check server cache
    if (serverAudioCache.has(cacheKey)) {
      const cached = serverAudioCache.get(cacheKey)!;
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Content-Length': cached.buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=604800, immutable',
        },
      });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API Key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.85,
          style: 0.20,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('ElevenLabs API response not OK:', response.status, errText);
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    // Cache the result
    serverAudioCache.set(cacheKey, {
      buffer: audioBuffer,
      contentType: 'audio/mpeg',
    });

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate audio' }, { status: 500 });
  }
}
