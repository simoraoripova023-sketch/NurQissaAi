import { NextRequest, NextResponse } from 'next/server';

const NEGATIVE_ENHANCERS = "strictly no hats, no wizard hats, no witch hats, no giant caps, no costumes, no floating head, no blurry faces, no distorted eyes, no deformed fingers or extra limbs, no adult features on child, no creepy doll face, no smeared features, no scary elements, high definition sharp focus, 8k render, masterpiece";

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
      ? "authentic gentle fairytale watercolor storybook painting, soft dreamy gouache washes, delicate fine pencil lines"
      : style === 'classic_storybook'
      ? "classical vintage children's book illustration, rich warm gouache and oil textures, golden sunbeam lighting"
      : style === 'disney_2d'
      ? "classic Disney 2D hand-drawn animation style, expressive clean lines, vivid storybook colors"
      : style === 'ghibli_anime'
      ? "Studio Ghibli nature-filled anime aesthetic, lush blooming background, whimsical fairytale lighting"
      : "3D Disney Pixar animation storybook masterpiece, ultra-smooth character rendering, soft glowing golden hour bedtime lighting";

    const enhancedPrompt = prompt.includes(name)
      ? `${prompt}, ${styleDescriptor}, ${NEGATIVE_ENHANCERS}`
      : `${characterAnchor} in ${prompt}, ${styleDescriptor}, ${NEGATIVE_ENHANCERS}`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim().startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: enhancedPrompt.slice(0, 980),
            n: 1,
            size: '1024x1024',
            quality: 'hd',
            style: 'vivid'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data?.data?.[0]?.url;
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              source: 'openai-dall-e-3-hd',
              imageUrl,
              revisedPrompt: data?.data?.[0]?.revised_prompt || enhancedPrompt,
            });
          }
        }
      } catch (e) {
        console.warn('OpenAI DALL-E direct call notice:', e);
      }
    }
    
    const imageSeed = seed || Math.floor(Math.random() * 899999) + 100000;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${imageSeed}&enhance=true`;

    return NextResponse.json({
      success: true,
      source: 'flux-consistent-3d',
      imageUrl,
      revisedPrompt: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error generating image' }, { status: 500 });
  }
}
