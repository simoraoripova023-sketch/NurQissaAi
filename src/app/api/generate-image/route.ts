import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { prompt, childName, gender, sceneSummary } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 });
    }

    const enhancedPrompt = `Authentic NurQissa Islamic children's storybook 3D animation style (matching Fotima and Yusuf book illustrations), breathtaking warm golden ambient sunlight, adorable innocent child character with beautiful symmetrical face, large sparkling brown eyes, sweet cheerful smile, clean smooth skin, modest clothing, cozy room with plants and books, high quality cinematic 3D render, sharp focus, 8k resolution, masterpiece, strictly no blur, no deformed faces: ${prompt}. Child name: ${childName || 'child'}, ${gender === 'boy' ? 'handsome young boy' : 'sweet pretty young girl'}. ${sceneSummary || ''}`;
    const seed = Math.floor(Math.random() * 899999) + 100000;
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1-mini',
            prompt: enhancedPrompt.slice(0, 1000),
            n: 1,
            size: '1024x1024',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let imageUrl = data?.data?.[0]?.url;
          if (!imageUrl && data?.data?.[0]?.b64_json) {
            try {
              const genDir = path.join(process.cwd(), 'public', 'generated');
              if (!fs.existsSync(genDir)) {
                fs.mkdirSync(genDir, { recursive: true });
              }
              const fileName = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
              const filePath = path.join(genDir, fileName);
              const buffer = Buffer.from(data.data[0].b64_json, 'base64');
              await fs.promises.writeFile(filePath, buffer);
              imageUrl = `/generated/${fileName}`;
            } catch (err) {
              imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
            }
          }
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              source: 'openai-gpt-image',
              imageUrl,
              revisedPrompt: data?.data?.[0]?.revised_prompt,
            });
          }
        }
      } catch (err) {
        console.warn('OpenAI DALL-E call failed, using dynamic AI image:', err);
      }
    }

    // High quality dynamic AI Fairytale image fallback
    return NextResponse.json({
      success: true,
      source: 'pollinations-3d',
      imageUrl: fallbackUrl,
      revisedPrompt: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json({ error: error?.message || 'Server error generating image' }, { status: 500 });
  }
}
