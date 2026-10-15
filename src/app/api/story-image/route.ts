import { NextRequest, NextResponse } from 'next/server';
import { getOpenAiApiKey, getGeminiApiKey, getNanoBananaApiKey } from '@/lib/serverKeys';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory cache for generated images during runtime
const imageCache = new Map<string, { buffer: Buffer; contentType: string }>();
let openAiQuotaExhaustedUntil = 0;

const STYLE_PROMPTS: Record<string, string> = {
  pixar_3d: "delightful 3D Disney Pixar style children's picturebook illustration, adorable lovable cartoon child character, large expressive shining eyes, warm innocent smile, bright vibrant cheerful colors, warm sunny golden daylight, cozy fairytale atmosphere, crisp clean details, heartwarming storybook masterpiece",
  watercolor: "authentic gentle fairytale watercolor illustration, soft dreamy gouache washes, fine delicate pencil outlines, heartwarming pastel palette, clean classic children's book painting, bright sunny atmosphere",
  classic_storybook: "classical vintage children's book illustration, rich warm gouache and oil painting texture, golden sunbeam lighting, heartwarming moral fairytale ambiance, crisp vibrant art",
  disney_2d: "classic Disney 2D hand-drawn animation style, crisp clean lines, vibrant storybook colors, joyful animated child character, charming fairytale illustration",
  ghibli_anime: "Studio Ghibli nature-filled anime aesthetic, lush vibrant blooming garden background, gentle morning sunlight, whimsical peaceful fairytale atmosphere, vivid colors"
};

const NEGATIVE_ENHANCERS = "strictly no photorealism, no realistic human skin, no uncanny valley, no wax figure, no creepy doll face, no adult features, no mature face, no teenagers, no dark moody shadows, no gloomy lighting, no dull muddy colors, no blur, no low resolution, no artifacts, no extra fingers, no distorted anatomy, no text, no watermark, no hats, no wizard hats, no witch hats, no giant caps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPrompt = searchParams.get('prompt') || 'Islamic bedtime story for children';
    const style = searchParams.get('style') || 'pixar_3d';
    const storyId = searchParams.get('storyId') || '';
    const pageStr = searchParams.get('page') || '1';
    const pageNum = parseInt(pageStr, 10) || 1;
    const gender = searchParams.get('gender') || (rawPrompt.toLowerCase().includes('boy') || rawPrompt.toLowerCase().includes("o'g'il") || rawPrompt.toLowerCase().includes('yusuf') ? 'boy' : 'girl');

    const cacheKey = `${storyId}_p${pageStr}_${rawPrompt.slice(0, 60)}`;
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    // Clean duplicate enhancers if caller already included some
    const cleanedBasePrompt = rawPrompt
      .replace(/strictly no photorealism.*$/gi, '')
      .replace(/strictly no hats.*$/gi, '')
      .replace(/delightful 3D Disney Pixar.*$/gi, '')
      .replace(/3D Disney Pixar animation.*$/gi, '')
      .trim();

    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.pixar_3d;
    const fullPrompt = `${cleanedBasePrompt}, ${stylePrompt}, ${NEGATIVE_ENHANCERS}`;

    const isBoy = gender === 'boy' || rawPrompt.toLowerCase().includes('boy') || rawPrompt.toLowerCase().includes("o'g'il") || rawPrompt.toLowerCase().includes('yusuf');

    // -------------------------------------------------------------
    // TIER 1: Nano Banana API (if key configured)
    // -------------------------------------------------------------
    const nanoKey = getNanoBananaApiKey();
    if (nanoKey) {
      try {
        const nanoRes = await fetch('https://nanobnana.com/api/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${nanoKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: fullPrompt.slice(0, 850),
            model: 'nano2',
            width: 1024,
            height: 1024
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (nanoRes.ok) {
          const nanoData = await nanoRes.json();
          const imgUrl = nanoData?.output?.[0] || nanoData?.imageUrl || nanoData?.data?.[0]?.url;
          if (imgUrl) {
            const imgFetch = await fetch(imgUrl, { signal: AbortSignal.timeout(15000) });
            if (imgFetch.ok) {
              const buf = Buffer.from(await imgFetch.arrayBuffer());
              if (buf.length > 5000) {
                imageCache.set(cacheKey, { buffer: buf, contentType: 'image/jpeg' });
                return new NextResponse(new Uint8Array(buf), {
                  headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400, immutable',
                  },
                });
              }
            }
          }
        }
      } catch (nanoErr) {
        console.warn('Nano Banana API notice:', nanoErr);
      }
    }

    // -------------------------------------------------------------
    // TIER 2: Google Imagen 3 API (via Gemini API key)
    // -------------------------------------------------------------
    const geminiKey = getGeminiApiKey();
    if (geminiKey) {
      try {
        const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`;
        const imgRes = await fetch(imagenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: fullPrompt.slice(0, 950) }],
            parameters: {
              sampleCount: 1,
              aspectRatio: '1:1',
              outputOptions: { mimeType: 'image/jpeg' }
            }
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (imgRes.ok) {
          const data = await imgRes.json();
          const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
          if (b64) {
            const buf = Buffer.from(b64, 'base64');
            imageCache.set(cacheKey, { buffer: buf, contentType: 'image/jpeg' });
            return new NextResponse(new Uint8Array(buf), {
              headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, immutable',
              },
            });
          }
        }
      } catch (imagenErr) {
        console.warn('Google Imagen 3 API notice:', imagenErr);
      }
    }

    // -------------------------------------------------------------
    // TIER 3: Real-time Flux Engine (100% Free, Reliable & Instant)
    // -------------------------------------------------------------
    try {
      let hash = 0;
      const seedStr = `${storyId}_p${pageStr}_${cleanedBasePrompt}`;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash * 31 + seedStr.charCodeAt(i)) & 0x7fffffff;
      }
      const seed = hash % 999999;
      const cleanFluxPrompt = encodeURIComponent(`${cleanedBasePrompt}, 3D Disney Pixar style picturebook illustration, bright sunny daylight, cheerful child character, fairytale atmosphere, crisp clean lines`.slice(0, 750));
      const pollUrl = `https://image.pollinations.ai/prompt/${cleanFluxPrompt}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

      const pRes = await fetch(pollUrl, { signal: AbortSignal.timeout(18000) });
      if (pRes.ok) {
        const buf = Buffer.from(await pRes.arrayBuffer());
        if (buf.length > 5000) {
          imageCache.set(cacheKey, { buffer: buf, contentType: 'image/jpeg' });
          return new NextResponse(new Uint8Array(buf), {
            headers: {
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=86400, immutable',
            },
          });
        }
      }
    } catch (pErr) {
      console.warn('Flux engine notice:', pErr);
    }

    // -------------------------------------------------------------
    // TIER 4: OpenAI DALL-E 3 / DALL-E 2 (if quota is healthy)
    // -------------------------------------------------------------
    const openAiApiKey = getOpenAiApiKey();
    const isQuotaExhausted = Date.now() < openAiQuotaExhaustedUntil;

    if (openAiApiKey && !isQuotaExhausted) {
      const modelsToTry = ['dall-e-3', 'dall-e-2'];
      
      for (const model of modelsToTry) {
        try {
          const bodyPayload: Record<string, any> = {
            model: model,
            prompt: fullPrompt.slice(0, 950),
            n: 1,
            size: model === 'dall-e-3' ? '1024x1024' : '512x512',
          };
          if (model === 'dall-e-3') {
            bodyPayload.quality = 'hd';
          }

          const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAiApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPayload),
            signal: AbortSignal.timeout(20000)
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
            const errMsg = err?.error?.message || '';
            if (res.status === 429 || errMsg.includes('credits') || errMsg.includes('quota') || errMsg.includes('billing')) {
              openAiQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000;
              break;
            }
          }
        } catch (err) {
          console.warn(`Error generating image with ${model}:`, err);
        }
      }
    }

    // -------------------------------------------------------------
    // TIER 5: Curated HD Fairytale Storybook Assets
    // -------------------------------------------------------------
    try {
      let samplePath = '';
      if (pageNum === 0) {
        samplePath = isBoy
          ? path.join(process.cwd(), 'public', 'stories', 'yusuf', 'cover.jpeg')
          : path.join(process.cwd(), 'public', 'stories', 'asmo_cover_custom.jpeg');
      } else {
        const safePage = ((Math.max(1, pageNum) - 1) % 8) + 1;
        const folder = isBoy ? 'yusuf' : 'fotima';
        samplePath = path.join(process.cwd(), 'public', 'stories', folder, `page_${safePage}.jpeg`);
      }

      if (!fs.existsSync(samplePath)) {
        samplePath = isBoy
          ? path.join(process.cwd(), 'public', 'stories', 'yusuf', 'cover.jpeg')
          : path.join(process.cwd(), 'public', 'stories', 'fotima', 'page_1.jpeg');
      }

      if (fs.existsSync(samplePath)) {
        const fileBuf = fs.readFileSync(samplePath);
        imageCache.set(cacheKey, { buffer: fileBuf, contentType: 'image/jpeg' });
        return new NextResponse(new Uint8Array(fileBuf), {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        });
      }
    } catch (fsErr) {
      console.warn('Local sample storybook read notice:', fsErr);
    }

    // Final Fallback: Bedtime scene SVG
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
