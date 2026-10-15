import { NextRequest, NextResponse } from 'next/server';
import { getOpenAiApiKey } from '@/lib/serverKeys';

export const runtime = 'edge';

const NEGATIVE_ENHANCERS = "strictly no photorealism, no realistic human skin, no uncanny valley, no wax figure, no creepy doll face, no adult features, no mature face, no teenagers, no dark moody shadows, no gloomy lighting, no dull muddy colors, no blur, no low resolution, no artifacts, no extra fingers, no distorted anatomy, no text, no watermark, no hats, no wizard hats, no witch hats, no giant caps";

export async function POST(req: NextRequest) {
  try {
    const { prompt, childName, gender, sceneSummary, style = 'pixar_3d', seed } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 });
    }

    const isBoy = gender === 'boy';
    const name = childName || (isBoy ? 'Yusuf' : 'Fotima');
    
    const characterAnchor = isBoy
      ? `adorable handsome 6-year-old Uzbek boy named ${name}, neat short dark wavy hair, sparkling warm brown eyes, sweet innocent smile, wearing a neat modest white shirt and soft emerald-green vest`
      : `adorable sweet 5-year-old Uzbek girl named ${name}, shiny dark hair with soft bangs, sparkling luminous brown eyes, sweet joyful smile, wearing a lovely elegant pastel dress`;

    const styleDescriptor = style === 'watercolor'
      ? "authentic gentle fairytale watercolor storybook painting, soft dreamy gouache washes, delicate fine pencil lines, bright sunny day"
      : style === 'classic_storybook'
      ? "classical vintage children's book illustration, rich warm gouache and oil textures, golden sunbeam lighting, crisp vibrant art"
      : style === 'disney_2d'
      ? "classic Disney 2D hand-drawn animation style, expressive clean lines, vivid storybook colors, joyful child character"
      : style === 'ghibli_anime'
      ? "Studio Ghibli nature-filled anime aesthetic, lush blooming background, whimsical fairytale lighting, vivid colors"
      : "delightful 3D Disney Pixar style children's picturebook illustration, adorable lovable cartoon child character, large expressive shining eyes, warm innocent smile, bright vibrant cheerful colors, warm sunny golden daylight, crisp clean details, heartwarming storybook masterpiece";

    const enhancedPrompt = prompt.includes(name)
      ? `${prompt}, ${styleDescriptor}, ${NEGATIVE_ENHANCERS}`
      : `${characterAnchor} in ${prompt}, ${styleDescriptor}, ${NEGATIVE_ENHANCERS}`;

    const apiKey = getOpenAiApiKey();

    if (apiKey) {
      const modelsToTry = ['dall-e-3', 'dall-e-2'];
      
      for (const model of modelsToTry) {
        try {
          const bodyPayload: Record<string, any> = {
            model: model,
            prompt: enhancedPrompt.slice(0, 950),
            n: 1,
            size: model === 'dall-e-3' ? '1024x1024' : '512x512',
          };
          if (model === 'dall-e-3') {
            bodyPayload.quality = 'hd';
          }

          const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyPayload),
          });

          if (response.ok) {
            const data = await response.json();
            const b64 = data?.data?.[0]?.b64_json;
            if (b64) {
              return NextResponse.json({
                success: true,
                source: `openai-${model}`,
                imageUrl: `data:image/png;base64,${b64}`,
                revisedPrompt: enhancedPrompt,
              });
            }
            const imageUrl = data?.data?.[0]?.url;
            if (imageUrl) {
              return NextResponse.json({
                success: true,
                source: `openai-${model}`,
                imageUrl,
                revisedPrompt: data?.data?.[0]?.revised_prompt || enhancedPrompt,
              });
            }
          } else {
            const errJson = await response.json().catch(() => ({}));
            const errMsg = errJson?.error?.message || '';
            console.warn(`OpenAI image notice with ${model}:`, errMsg || response.status);
            if (response.status === 429 || errMsg.includes('credits') || errMsg.includes('quota') || errMsg.includes('billing')) {
              break;
            }
          }
        } catch (e) {
          console.warn(`OpenAI call notice with ${model}:`, e);
        }
      }
    }
    
    // Direct authentic storybook artwork fallback
    const safePage = ((Math.max(1, seed || 1) - 1) % 8) + 1;
    const fallbackUrl = isBoy
      ? (seed === 0 ? '/stories/yusuf/cover.jpeg' : `/stories/yusuf/page_${safePage}.jpeg`)
      : (seed === 0 ? '/stories/asmo_cover_custom.jpeg' : `/stories/fotima/page_${safePage}.jpeg`);

    return NextResponse.json({
      success: true,
      source: 'authentic-storybook-asset',
      imageUrl: fallbackUrl,
      revisedPrompt: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error generating image' }, { status: 500 });
  }
}
