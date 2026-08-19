import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, childName, gender, sceneSummary, childPhotoUrl } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 });
    }

    const isBoy = gender === 'boy';
    const characterType = isBoy ? 'cute handsome young Uzbek boy' : 'cute sweet young Uzbek girl';
    
    // Curated high-aesthetic 3D Pixar & Fairytale style prompt
    const enhancedPrompt = `3D Disney Pixar animation storybook illustration: adorable cute ${characterType} named ${childName || 'Yusuf'}, large sparkling brown eyes, sweet cheerful smile, clean neat modest clothes, ${prompt}, cozy warm golden sunlight, lush blooming garden and cozy room, cinematic lighting, 8k resolution, masterpiece, sharp focus, no blur, no deformed faces`;

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
            prompt: enhancedPrompt.slice(0, 950),
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data?.data?.[0]?.url;
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              source: 'openai-dall-e-3',
              imageUrl,
              revisedPrompt: data?.data?.[0]?.revised_prompt || enhancedPrompt,
            });
          }
        }
      } catch (e) {
        console.warn('OpenAI DALL-E direct call notice:', e);
      }
    }
    
    const seed = Math.floor(Math.random() * 899999) + 100000;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`;

    return NextResponse.json({
      success: true,
      source: 'dynamic-ai-3d',
      imageUrl,
      revisedPrompt: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error generating image' }, { status: 500 });
  }
}
