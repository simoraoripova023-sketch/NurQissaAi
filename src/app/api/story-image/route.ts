import { NextRequest, NextResponse } from 'next/server';
import { getOpenAiApiKey } from '@/lib/serverKeys';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory cache for generated images during runtime
const imageCache = new Map<string, { buffer: Buffer; contentType: string }>();

const STYLE_PROMPTS: Record<string, string> = {
  pixar_3d: "3D Disney Pixar animation storybook masterpiece, ultra-smooth character rendering, soft glowing golden hour bedtime lighting, rich warm cinematic colors, 8k resolution, highly detailed texture, lovable expressive facial features",
  watercolor: "authentic gentle fairytale watercolor illustration, soft dreamy gouache washes, fine delicate pencil outlines, heartwarming pastel palette, clean classic children's book painting",
  classic_storybook: "classical vintage children's book illustration, rich warm gouache and oil painting texture, golden sunbeam lighting, heartwarming moral fairytale ambiance",
  disney_2d: "classic Disney 2D hand-drawn animation style, crisp clean lines, vibrant storybook colors, joyful animated child character",
  ghibli_anime: "Studio Ghibli nature-filled anime aesthetic, lush vibrant blooming garden background, gentle morning sunlight, whimsical peaceful fairytale atmosphere"
};

const NEGATIVE_ENHANCERS = "strictly no hats, no wizard hats, no witch hats, no giant caps, no costumes, no floating head, no blurry faces, no distorted eyes, no deformed fingers or extra limbs, no adult features on child, no creepy doll face, no smeared features, no scary elements, high definition sharp focus";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPrompt = searchParams.get('prompt') || 'Islamic bedtime story for children';
    const style = searchParams.get('style') || 'pixar_3d';
    const storyId = searchParams.get('storyId') || '';
    const page = searchParams.get('page') || '1';

    const cacheKey = `${storyId}_p${page}_${rawPrompt.slice(0, 60)}`;
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.pixar_3d;
    const fullPrompt = `${rawPrompt}, ${stylePrompt}, ${NEGATIVE_ENHANCERS}`;

    const apiKey = getOpenAiApiKey();

    if (apiKey) {
      const modelsToTry = ['gpt-image-1-mini', 'gpt-image-1', 'gpt-image-1.5'];
      
      for (const model of modelsToTry) {
        try {
          const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              prompt: fullPrompt.slice(0, 950),
              n: 1,
              size: '1024x1024'
            })
          });

          if (res.ok) {
            const data = await res.json();
            const b64 = data?.data?.[0]?.b64_json;
            if (b64) {
              const imageBuffer = Buffer.from(b64, 'base64');
              imageCache.set(cacheKey, { buffer: imageBuffer, contentType: 'image/png' });

              return new NextResponse(new Uint8Array(imageBuffer), {
                headers: {
                  'Content-Type': 'image/png',
                  'Cache-Control': 'public, max-age=86400, immutable',
                },
              });
            }

            if (data?.data?.[0]?.url) {
              const imgRes = await fetch(data.data[0].url);
              if (imgRes.ok) {
                const imgBuf = Buffer.from(await imgRes.arrayBuffer());
                imageCache.set(cacheKey, { buffer: imgBuf, contentType: 'image/png' });
                return new NextResponse(new Uint8Array(imgBuf), {
                  headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=86400, immutable',
                  },
                });
              }
            }
          } else {
            const err = await res.json().catch(() => ({}));
            console.warn(`OpenAI image notice (${model}):`, err?.error?.message || res.status);
          }
        } catch (err) {
          console.warn(`Error generating image with ${model}:`, err);
        }
      }
    }

    // Fallback: Return a warm glowing bedtime scene placeholder
    const title = decodeURIComponent(rawPrompt).slice(0, 45);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="50%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
          <radialGradient id="glowGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#064e3b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1024" height="768" fill="url(#skyGrad)"/>
        <circle cx="512" cy="320" r="300" fill="url(#glowGrad)"/>
        <path d="M512,120 L535,210 L625,235 L535,260 L512,350 L489,260 L399,235 L489,210 Z" fill="#fbbf24" opacity="0.8"/>
        <text x="512" y="460" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="#fef3c7" text-anchor="middle">NurQissa AI</text>
        <text x="512" y="510" font-family="system-ui, sans-serif" font-size="20" fill="#a7f3d0" text-anchor="middle">${title}...</text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/story-image:', error);
    return new NextResponse('Error generating story image', { status: 500 });
  }
}
