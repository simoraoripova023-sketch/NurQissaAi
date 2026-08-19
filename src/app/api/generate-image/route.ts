import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, childName, gender, sceneSummary, style = 'pixar_3d' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 });
    }

    const isBoy = gender === 'boy';
    const characterType = isBoy ? 'cute handsome young Uzbek boy' : 'cute sweet young Uzbek girl';
    
    // Curated high-aesthetic 3D Pixar & Fairytale style prompt
    const enhancedPrompt = `3D Disney Pixar animation storybook illustration, adorable innocent ${characterType} named ${childName || 'Yusuf'}, large sparkling brown eyes, sweet cheerful smile, clean neat modest clothes, ${prompt}, cozy warm golden sunlight, lush blooming garden and cozy room, cinematic lighting, 8k resolution, masterpiece, sharp focus, no blur, no deformed faces`;
    
    const seed = Math.floor(Math.random() * 899999) + 100000;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`;

    return NextResponse.json({
      success: true,
      source: 'pollinations-flux-3d',
      imageUrl,
      revisedPrompt: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error generating image' }, { status: 500 });
  }
}
