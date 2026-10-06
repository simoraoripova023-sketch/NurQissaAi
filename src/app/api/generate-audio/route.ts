import { NextRequest, NextResponse } from 'next/server';
import { synthesizeEdgeTts } from '@/lib/edgeTts';

export const runtime = 'nodejs';

// Server-side in-memory cache for audio generation to ensure instant playback (0ms)
const serverAudioCache = new Map<string, { buffer: Buffer; contentType: string }>();

// Voice mapping for authentic, emotional storytelling:
// - uz-UZ-MadinaNeural: Gentle, warm maternal bedtime voice (Ona ovozi)
// - uz-UZ-SardorNeural: Deep, expressive grandfatherly storyteller voice (Suxandon ovozi)
const UZ_VOICE_MAP: Record<string, string> = {
  mother: 'uz-UZ-MadinaNeural',
  narrator: 'uz-UZ-SardorNeural',
  father: 'uz-UZ-SardorNeural',
};

const EN_VOICE_MAP: Record<string, string> = {
  mother: 'en-US-JennyNeural',
  narrator: 'en-US-GuyNeural',
  father: 'en-US-GuyNeural',
};

const ELEVENLABS_VOICE_MAP: Record<string, string> = {
  mother: 'EXAVITQu4vr4xnSDxMaL',
  narrator: 'CwhRBWXzGAHq8TQ4Fs17',
  father: 'pNInz6obpgDQGcFmaJgB',
};

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = 'mother', locale = 'uz' } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Clean text from markdown formatting, quotes and special characters for natural speech
    const cleanText = text
      .replace(/[*_#«»"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const isUzbek = locale === 'uz' || !locale;
    const voiceMap = isUzbek ? UZ_VOICE_MAP : EN_VOICE_MAP;
    const targetEdgeVoice = voiceMap[voiceId] || (isUzbek ? 'uz-UZ-MadinaNeural' : 'en-US-JennyNeural');

    const cacheKey = `${targetEdgeVoice}_${cleanText.slice(0, 100)}_${cleanText.length}`;

    // 1. Check server cache for instant playback
    if (serverAudioCache.has(cacheKey)) {
      const cached = serverAudioCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Content-Length': cached.buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=604800, immutable',
        },
      });
    }

    // 2. Synthesize using Microsoft Edge Neural TTS (100% authentic native Uzbek accent)
    try {
      const audioBuffer = await synthesizeEdgeTts(cleanText, {
        voice: targetEdgeVoice,
        rate: isUzbek ? '-2%' : '-1%',
        pitch: '+0Hz',
      });

      if (audioBuffer && audioBuffer.length > 0) {
        serverAudioCache.set(cacheKey, {
          buffer: audioBuffer,
          contentType: 'audio/mpeg',
        });

        return new NextResponse(new Uint8Array(audioBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=604800, immutable',
          },
        });
      }
    } catch (edgeErr: any) {
      console.warn('Edge TTS synthesis warning, attempting ElevenLabs fallback:', edgeErr?.message || edgeErr);
    }

    // 3. Fallback to ElevenLabs if Edge TTS had an issue
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (apiKey) {
      const elevenVoiceId = ELEVENLABS_VOICE_MAP[voiceId] || ELEVENLABS_VOICE_MAP.mother;
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenVoiceId}`, {
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

      if (response.ok) {
        const audioBuffer = Buffer.from(await response.arrayBuffer());
        serverAudioCache.set(cacheKey, {
          buffer: audioBuffer,
          contentType: 'audio/mpeg',
        });

        return new NextResponse(new Uint8Array(audioBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=604800, immutable',
          },
        });
      }
    }

    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  } catch (error: any) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate audio' }, { status: 500 });
  }
}
