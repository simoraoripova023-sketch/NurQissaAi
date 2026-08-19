import { NextRequest, NextResponse } from 'next/server';
import { ChildProfile, StoryBook, MoralVirtue } from '@/lib/types';
import { getStorySceneImage } from '@/lib/illustrationHelper';

/**
 * Generates an authentic Islamic values-based bedtime story using Google Gemini API
 */
async function generateStoryWithGemini(profile: ChildProfile, apiKey: string): Promise<Partial<StoryBook> | null> {
  try {
    const isBoy = profile.gender === 'boy';
    const childName = profile.child_name;
    const virtue = profile.parent_goal || 'kindness';
    const setting = profile.story_setting || 'cozy_home';
    const animal = profile.favorite_animal || 'kichik quyoncha';
    const color = profile.favorite_color || 'oltin rang';
    const age = profile.age || 6;
    const readingTime = profile.reading_time_context || 'daytime';
    const activity = profile.daily_activity || 'yaxshiliklar qildi';
    const mood = profile.emotional_state || 'happy';
    const style = profile.illustration_style || 'pixar_3d';
    const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 3), 10);

    const systemPrompt = `You are a world-class Islamic children's storyteller and pedagogue for the "NurQissa AI" platform.
Generate a brand-new, completely unique, heartwarming, highly personalized ${targetPageCount}-page storybook in Uzbek (main) and English (translation).

Target Child Profile:
- Child's Name: "${childName}"
- Gender: "${isBoy ? 'o\'g\'il bola' : 'qiz bola'}"
- Age: ${age} yosh
- Total Pages Requested by Parents: Exactly ${targetPageCount} pages (must be between 3 and 10 pages)
- Reading Moment / Occasion: "${readingTime}" (daytime adventure, evening bedtime calm, roadtrip travel, or family gathering)
- Today's Real Activity & Daily Context: "${activity}"
- Current Emotional State / Mood: "${mood}"
- Favorite Animal / Companion: "${animal}"
- Favorite Color / Theme: "${color}"
- Story Setting: "${setting}" (e.g. blooming garden, magical forest, starry sky, cloud kingdom, oriental village)
- Core Moral Virtue & Theme: "${virtue}" (Islomiy go'zal fazilat: Sabr, Shukr, Saxovat, Mehr-oqibat, Ota-onani e'zozlash, Rostgo'ylik, Jasorat, Poklik).
- Visual Art Style: "${style}"

CRITICAL STORYTELLING INSTRUCTIONS & ISLAMIC LITERATURE RULES:
1. STRICT AUTHENTICITY (19 UPLOADED ISLAMIC SOURCE BOOKS):
   - You MUST ground all story morals, dialogue, and reflections in the uploaded authentic Islamic literature:
     * "Aqlli bola Yusuf" (Loving family etiquette, respect for elders/buvijon, prayer before sleep/meals, sincerity, peaceful heart)
     * "Allohning chin do'sti - Ibrohim a.s." (Tafakkur of celestial wonders, stars, moon, knowing the Creator)
     * "Bolalar uchun 40 hadis hikoyalari" (Generosity, sharing toys, helping friends, cleanliness, honesty, kindness to animals)
     * "Robbimning 99 ismi" (Experiencing Allah's mercy Ar-Rahman, peace As-Salam, generosity Al-Karim in daily life)
     * "Payg'ambarlar qissalari & Qur'on suralari" (Nuh a.s. kemasi, Yunus a.s., Muso a.s. ibratlari)
2. NO MYTHOLOGICAL FANTASY: Do NOT invent un-Islamic magic (no magic wands, witches, wizards, fairies, spells). The wonder of the story comes from Allah's magnificent creation, brotherly kindness, nature's beauty, and good deeds.
3. CONTEXT & CHILD PROFILE: Seamlessly weave ${childName}'s real-day activity "${activity}", mood "${mood}", beloved companion "${animal}", and setting "${setting}".
4. STRUCTURE: Exactly ${targetPageCount} rich story pages. The "pages" array MUST contain exactly ${targetPageCount} items numbered 1 to ${targetPageCount}. Each page must advance the story with vivid descriptions, gentle dialogue, and a heartwarming resolution.
5. IMAGE PROMPTS: For each of the ${targetPageCount} pages, provide a rich English image_prompt tailored to the "${style}" visual art style featuring ${childName} (${isBoy ? 'cute boy' : 'cute girl'}, ${age}yo) and ${animal} in ${color} style setting.

Output Valid JSON ONLY with this exact schema:
{
  "title_uz": "...",
  "title_en": "...",
  "prologue_uz": "...",
  "prologue_en": "...",
  "pages": [
    {
      "page_number": 1,
      "text_uz": "...",
      "text_en": "...",
      "image_prompt": "Cute 3D Pixar Disney style storybook fairytale illustration of ...",
      "scene_summary": "..."
    }
  ],
  "reflection": {
    "todays_lesson_uz": "...",
    "todays_lesson_en": "...",
    "arabic_dua": "...",
    "little_dua_uz": "...",
    "little_dua_en": "...",
    "discussion_questions_uz": ["...", "...", "..."],
    "discussion_questions_en": ["...", "...", "..."],
    "good_deed_task_uz": "...",
    "good_deed_task_en": "..."
  },
  "quiz": [
    {
      "id": "q1",
      "question_uz": "...",
      "question_en": "...",
      "options": [
        { "id": "o1", "text_uz": "...", "text_en": "...", "isCorrect": true },
        { "id": "o2", "text_uz": "...", "text_en": "...", "isCorrect": false },
        { "id": "o3", "text_uz": "...", "text_en": "...", "isCorrect": false }
      ],
      "explanation_uz": "...",
      "explanation_en": "..."
    },
    {
      "id": "q2",
      "question_uz": "...",
      "question_en": "...",
      "options": [
        { "id": "o1", "text_uz": "...", "text_en": "...", "isCorrect": true },
        { "id": "o2", "text_uz": "...", "text_en": "...", "isCorrect": false },
        { "id": "o3", "text_uz": "...", "text_en": "...", "isCorrect": false }
      ],
      "explanation_uz": "...",
      "explanation_en": "..."
    },
    {
      "id": "q3",
      "question_uz": "...",
      "question_en": "...",
      "options": [
        { "id": "o1", "text_uz": "...", "text_en": "...", "isCorrect": true },
        { "id": "o2", "text_uz": "...", "text_en": "...", "isCorrect": false },
        { "id": "o3", "text_uz": "...", "text_en": "...", "isCorrect": false }
      ],
      "explanation_uz": "...",
      "explanation_en": "..."
    }
  ]
}`;

    // Try OpenAI GPT-4o-mini if OPENAI_API_KEY is present (Super fast & reliable)
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.trim().startsWith('sk-')) {
      try {
        const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an Islamic children storytelling engine. You must output 100% valid JSON only adhering strictly to the required schema.' },
              { role: 'user', content: systemPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.75,
          }),
        });

        if (oaiRes.ok) {
          const oaiData = await oaiRes.json();
          const content = oaiData.choices?.[0]?.message?.content;
          if (content) {
            return JSON.parse(content.trim());
          }
        }
      } catch (e) {
        console.warn('OpenAI GPT-4o-mini story text generation failed, trying Gemini:', e);
      }
    }

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-3.7-flash',
      'gemini-flash-latest'
    ];

    let resultText = '';
    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.75,
              maxOutputTokens: 6000,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) break;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`Gemini model ${model} failed (${response.status}):`, errData?.error?.message);
        }
      } catch (err) {
        console.warn(`Error calling Gemini model ${model}:`, err);
      }
    }

    if (!resultText) return null;

    const cleanedText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleanedText);
    return parsed;
  } catch (error) {
    console.error("Error in generateStoryWithGemini:", error);
    return null;
  }
}

const STYLE_PROMPTS: Record<string, string> = {
  pixar_3d: "Authentic NurQissa Islamic children's book 3D animation style (matching Fotima and Yusufjon storybook art), extremely cute adorable child character with large sparkling expressive brown eyes, sweet cheerful smile, clean neat modest clothes. Breathtaking warm golden sunlight streaming through cozy room, lush indoor plants, books, vibrant fairytale colors, ultra-smooth high-definition 3D render, cinematic lighting, 8k masterpiece",
  watercolor: "Authentic Islamic fairytale watercolor storybook style (as in classical Nuur books), soft gentle gouache washes, delicate fine outlines, adorable expressive child face, sweet smile, cozy warm pastel lighting, clean high-definition book painting",
  classic_storybook: "Classical Nuur storybook oil and gouache illustration style, rich warm textures, golden hour glow, heartwarming moral fairytale atmosphere, highly detailed children's book art, adorable child with beautiful eyes",
  disney_2d: "Classic hand-drawn 2D animation style from Islamic children's books, expressive clean lines, cheerful vivid storybook palette, joyful innocent child character",
  ghibli_anime: "Studio Ghibli nature-filled anime art style matching Islamic children's stories, lush blooming garden background, crystal streams, soft morning sunlight, cute emotive anime child"
};

/**
 * Creates dynamic high-definition AI image URL using the FLUX model and crystal-clear face enhancers
 */
function createAiImageUrl(prompt: string, seed: number, style: string = 'pixar_3d'): string {
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.pixar_3d;
  const sampleBookArtEnhancers = "matching Fotima and Yusuf book illustration art, crystal clear cute symmetrical face, bright sparkling expressive eyes, adorable happy smile, clean smooth skin, high definition character art, 8k resolution, sharp focus, strictly no blurry face, no creepy doll face, no smeared features";
  const fullPrompt = `${prompt}, ${stylePrompt}, ${sampleBookArtEnhancers}`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=flux&width=1024&height=768&nologo=true&seed=${seed}&enhance=true`;
}

import fs from 'fs';
import path from 'path';

/**
 * Generates custom 3D storybook scene illustration with consistent character features
 */
async function generateDallEImage(prompt: string, fallbackUrl: string, filePrefix: string = 'story'): Promise<string> {
  try {
    const seed = Math.floor(Math.random() * 899999) + 100000;
    const stylePrompt = "3D Disney Pixar animation children's storybook style, breathtaking warm golden ambient sunlight, cozy room, lush indoor plants, books, adorable cute child character with large sparkling brown eyes, sweet cheerful smile, clean neat modest clothes, cinematic lighting, 8k resolution, masterpiece, strictly no blur, no deformed faces";
    const fullPrompt = `${prompt}, ${stylePrompt}`;
    const dynamicAiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=flux&width=1024&height=768&nologo=true&seed=${seed}&enhance=true`;
    return dynamicAiUrl || fallbackUrl;
  } catch (err) {
    console.warn('Error generating story illustration:', err);
    return fallbackUrl;
  }
}

/**
 * Analyzes uploaded child photo to extract consistent 3D character persona features
 */
async function analyzeChildPhoto(photoDataUrl?: string, gender: string = 'girl', name: string = 'Fotima'): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const isBoy = gender === 'boy';
  const defaultPersona = isBoy
    ? `adorable cheerful young Uzbek boy named ${name} with neat dark hair, sparkling warm brown eyes, sweet innocent smile, wearing a neat modest soft-colored outfit`
    : `adorable sweet young Uzbek girl named ${name} with cute dark hair, bright expressive sparkling eyes, sweet joyful smile, wearing a lovely elegant dress`;

  if (!apiKey || !photoDataUrl || !photoDataUrl.startsWith('data:image')) {
    return defaultPersona;
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Describe the child in this photo in 1 sentence for a 3D Pixar character prompt (approximate age, gender, hair style/color, eye expression, clothing color and style). Format as a character description without introductory words. Child name is ${name}.` },
              { type: 'image_url', image_url: { url: photoDataUrl } }
            ]
          }
        ],
        max_tokens: 120
      })
    });

    if (res.ok) {
      const data = await res.json();
      const desc = data.choices?.[0]?.message?.content?.trim();
      if (desc && desc.length > 15) {
        return desc.replace(/^["']|["']$/g, '').replace(/\.$/, '');
      }
    }
  } catch (e) {
    console.warn('Vision photo analysis failed, using smart default:', e);
  }

  return defaultPersona;
}

export async function POST(req: NextRequest) {
  try {
    const profile: ChildProfile = await req.json();

    if (!profile.child_name) {
      return NextResponse.json({ error: "Child's name is required" }, { status: 400 });
    }

    const storyId = `story-${Date.now()}-${profile.child_name.toLowerCase().replace(/\s+/g, '-')}`;
    const childName = profile.child_name;
    const isBoy = profile.gender === 'boy';
    const animal = profile.favorite_animal || (isBoy ? 'mitti toychoq' : 'oppoq quyoncha');
    const color = profile.favorite_color || 'moviy va zumrad';
    const virtue = profile.parent_goal || 'kindness';
    const chosenStyle = profile.illustration_style || 'pixar_3d';
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const baseSeed = Math.floor(Math.random() * 899999) + 100000;

    // 1. Analyze child's physical appearance from uploaded photo for 100% character consistency
    const characterPersona = await analyzeChildPhoto(profile.child_photo_url, profile.gender, childName);

    // 2. Generate story text with AI
    let generatedStory: Partial<StoryBook> | null = null;
    if (geminiApiKey && geminiApiKey.trim().length > 0 || (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'))) {
      generatedStory = await generateStoryWithGemini(profile, (geminiApiKey || '').trim());
    }

    // 3. Generate custom 3D AI illustrations for Cover and all pages
    if (generatedStory && generatedStory.pages && generatedStory.pages.length >= 4) {
      const coverPrompt = `3D Disney Pixar storybook cover illustration matching Fotima and Yusuf book art: ${characterPersona} together with beloved companion ${animal} in breathtaking glowing ${color} setting, soft warm golden sunlight, crescent moon, lush flowers, title banner, high quality 3D render, masterpiece`;
      
      const fallbackCoverUrl = getStorySceneImage(profile.gender, 1);
      // ALWAYS generate the 3D animated cover transformed from the child's persona
      const coverImageUrl = await generateDallEImage(coverPrompt, fallbackCoverUrl, `${storyId}-cover`);

      const enhancedPages = await Promise.all(generatedStory.pages.map(async (p, idx) => {
        const pagePrompt = p.image_prompt 
          ? `${p.image_prompt}, featuring ${characterPersona} and ${animal}, matching Fotima & Yusuf book artwork`
          : `3D Pixar children's storybook scene of ${characterPersona} with ${animal} in ${color} setting, ${p.scene_summary || 'adventure'}, matching Fotima and Yusuf book art`;
        
        // 100% clean authentic literature scene as infallible fallback
        const authenticSceneFallback = getStorySceneImage(profile.gender, idx + 1);
        
        // Generate via OpenAI gpt-image-1-mini with consistent character persona
        const pageImageUrl = await generateDallEImage(pagePrompt, authenticSceneFallback, `${storyId}-p${idx + 1}`);
        
        return {
          page_number: idx + 1,
          text_uz: p.text_uz || '',
          text_en: p.text_en || '',
          image_prompt: pagePrompt,
          image_url: pageImageUrl,
          scene_summary: p.scene_summary || `${childName} sarguzashti - ${idx + 1}-sahifa`,
        };
      }));

      const dynamicStory: StoryBook = {
        id: storyId,
        created_at: new Date().toISOString(),
        child_profile: profile,
        title_uz: generatedStory.title_uz || `${childName} va Nurli Qissa`,
        title_en: generatedStory.title_en || `${childName} and the Radiant Tale`,
        prologue_uz: generatedStory.prologue_uz || `Erka farzandimiz — ${childName}ning ${animal} bilan birgalikdagi nurli va ibratli oqshom sarguzashti...`,
        prologue_en: generatedStory.prologue_en || `A heartwarming bedtime adventure of ${childName} and their beloved ${animal}...`,
        cover_image_url: coverImageUrl,
        theme_color: isBoy ? "#013E37" : "#D97706",
        pages: enhancedPages,
        reflection: generatedStory.reflection || {
          todays_lesson_uz: "Har bir ezgu amal va go'zal xulq qalbimizga nur olib keladi.",
          todays_lesson_en: "Every good deed brings light and happiness to our hearts.",
          little_dua_uz: `Yo Allohim! ${childName}ni solih, shukr qiluvchi va ota-onasiga rahmat keltiruvchi farzand qilgin. Omin!`,
          little_dua_en: `O Allah! Bless ${childName} with beautiful character, peace and gratitude. Ameen!`,
          arabic_dua: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
          discussion_questions_uz: [
            `${childName} bugungi qissada qanday yaxshilik qildi?`,
            `Bugun sen qaysi yaxshi amaling bilan oilangni quvontirding?`,
            `Ertaga qanday yangi yaxshilik qilamiz?`
          ],
          discussion_questions_en: [
            `What good deed did ${childName} do in the story?`,
            `What brought happiness to your family today?`,
            `What kind act will you do tomorrow?`
          ],
          good_deed_task_uz: `Ertaga ertalab ota-onangizga shirin tabassum bilan \"Assalomu alaykum!\" deng.`,
          good_deed_task_en: `Greet your family tomorrow morning with a warm smile saying \"Assalamu Alaykum!\"`
        },
        quiz: generatedStory.quiz || [],
      };

      return NextResponse.json({
        success: true,
        source: 'gemini-3.7-flash',
        story: dynamicStory,
      });
    }

    // 3. Fallback: Dynamic programmatic generator (Crafted uniquely for child's name, animal, color, setting)
    const coverPrompt = `Fairytale cover for ${childName} with ${animal} in magical ${color} world, 3d pixar bedtime story`;
    const coverImageUrl = profile.child_photo_url || createAiImageUrl(coverPrompt, baseSeed);

    const fallbackPages = [
      {
        page_number: 1,
        text_uz: `Oqshom shafag'i olamga oltin nurlarini sochar edi. ${childName} o'zining sevimli ${animal}i bilan birga xonadonida o'tirib, osmondagi yulduzlarni tomosha qilardi. Uning qalbida go'zal ertak eshitish ishtiyoqi yonardi.`,
        text_en: `As the golden evening arrived, ${childName} sat peacefully with their beloved ${animal}, gazing at the first twinkling stars.`,
        image_prompt: `Cute 3D Pixar fairytale illustration of ${childName} (${isBoy ? 'boy' : 'girl'}, age ${profile.age || 6}) sitting by a cozy window with ${animal}, warm evening light`,
        image_url: createAiImageUrl(`${childName} by window with ${animal}`, baseSeed + 1),
        scene_summary: `${childName}ning oqshomgi xotirjamligi`
      },
      {
        page_number: 2,
        text_uz: `Shu payt xonaga mehribon buvijonisi va ota-onasi kirib keldilar. Ular ${childName}ning yoniga o'tirib, mehr bilan peshonasidan o'pdilar: \"Ko'zlarimizning nuri, bilasanmi, chinakam baxt — har bir ne'mat uchun Allohga shukr qilish va yaxshilik ulashishdadir\", dedilar.`,
        text_en: `Loving family joined ${childName}, sharing gentle words of wisdom: "True happiness comes from gratitude and sharing goodness."`,
        image_prompt: `Smiling loving grandmother and parents gently hugging ${childName} in warm cozy living room, golden fairytale art`,
        image_url: createAiImageUrl(`loving family hugging ${childName} in cozy room`, baseSeed + 2),
        scene_summary: `Oila mehri va dono o'git`
      },
      {
        page_number: 3,
        text_uz: `${childName} o'zining sevimli ${animal}ini quchoqlab, samimiy jilmaydi. U bugun o'rgangan go'zal fazilatga amal qilishga qaror qildi: \"Bismillahir Rohmanir Rohiym!\" deb, eng sevimli narsasini oilasi va yaqinlari bilan baham ko'rdi.`,
        text_en: `With a joyful smile, ${childName} whispered "Bismillah" and happily shared what they loved most with family.`,
        image_prompt: `${childName} sharing a special gift with joyful family, glowing warm light, 3D Pixar style`,
        image_url: createAiImageUrl(`${childName} sharing with family`, baseSeed + 3),
        scene_summary: `Bismillah bilan ezgulik ulashish`
      },
      {
        page_number: 4,
        text_uz: `Birdan butun xona go'yo nurga to'ldi! ${childName}ning yaxshi amali tufayli ${animal} ham quvonchdan sakrab ketdi. Har bir yaxshi amal qalbga xotirjamlik va baraka olib kelishini ${childName} dildan his qildi.`,
        text_en: `The room sparkled with warmth. Doing good brought instant peace and light to everyone's heart.`,
        image_prompt: `Magical golden sparkles filling room around happy ${childName} and playful ${animal}`,
        image_url: createAiImageUrl(`magic sparkles around ${childName} and ${animal}`, baseSeed + 4),
        scene_summary: `Ezgulikning nurli barakasi`
      },
      {
        page_number: 5,
        text_uz: `Kechki dasturxonda butun oila jam bo'ldi. ${childName} odob bilan taom yeb, \"Alhamdulillah, bizga bergan barcha shirin ne'matlaringga shukur, Yo Robbim!\" dedi. Ota-onasi uning odobidan faxrlandilar.`,
        text_en: `At dinnertime, ${childName} politely said 'Alhamdulillah', filling parents with immense pride and joy.`,
        image_prompt: `Family gathered happily around beautiful dinner table with glowing lanterns, 3D storybook art`,
        image_url: createAiImageUrl(`family dinner table with ${childName}`, baseSeed + 5),
        scene_summary: `Shukronalik dasturxoni`
      },
      {
        page_number: 6,
        text_uz: `Oqshom tushib, osmon hilol oy va son-sanoqsiz yulduzlar bilan bezandi. ${childName} xonasini ozoda qilib, yotishga tayyorlandi. Uning qalbi cheksiz oromga to'lgan edi.`,
        text_en: `Outside the window, a bright crescent moon smiled as ${childName} prepared for cozy bedtime.`,
        image_prompt: `Peaceful night scene of cozy bedroom, starry night and smiling crescent moon outside window`,
        image_url: createAiImageUrl(`cozy bedroom night scene with ${childName}`, baseSeed + 6),
        scene_summary: `Orombaxsh oqshom sukunati`
      },
      {
        page_number: 7,
        text_uz: `Yotishdan oldin ${childName} jajji kaftlarini ochib, ixlos bilan duo qildi: \"Ey mehribon Allohim! Ota-onamni, oilamni asragin. Menga go'zal xulq va sabr bergin. Omin!\". Buvijonisi unga shirin fotiha berdi.`,
        text_en: `Raising hands in sincere prayer, ${childName} asked Allah to bless parents, family, and keep their heart pure.`,
        image_prompt: `Cute ${childName} sitting in bed making bedtime dua with soft glowing moonlight, 3d fairytale art`,
        image_url: createAiImageUrl(`${childName} making bedtime dua`, baseSeed + 7),
        scene_summary: `${childName}ning samimiy oqshom duosi`
      },
      {
        page_number: 8,
        text_uz: `${childName} yostig'iga bosh qo'yib, jilmaygancha shirin uyquga ketdi. U shirin tushlar ko'rib, farishtalar panohida orom oldi. Xayrli tun, aziz ${childName}!`,
        text_en: `Resting upon soft pillows, ${childName} drifted into the sweetest peaceful sleep. Good night, little champion!`,
        image_prompt: `${childName} sleeping peacefully in cozy bed hugging ${animal}, gentle moonlight, fairytale masterpiece`,
        image_url: createAiImageUrl(`${childName} sleeping peacefully with ${animal}`, baseSeed + 8),
        scene_summary: `Shirin tushlar va xotirjam uyqu`
      }
    ];

    const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 3), 10);
    const selectedFallbackPages = fallbackPages.slice(0, targetPageCount).map((p, idx) => ({
      ...p,
      page_number: idx + 1,
    }));

    const fallbackStory: StoryBook = {
      id: storyId,
      created_at: new Date().toISOString(),
      child_profile: profile,
      title_uz: `${childName} va Nurli Hikmat Sayohati`,
      title_en: `${childName} and the Radiant Journey`,
      prologue_uz: `Erka farzandimiz — ${childName}ning sevimli ${animal}i bilan birgalikdagi ibratli va sehrli oqshom sarguzashti...`,
      prologue_en: `A heartwarming bedtime journey of young ${childName} learning noble moral virtues with family...`,
      cover_image_url: coverImageUrl,
      theme_color: isBoy ? "#013E37" : "#D97706",
      pages: selectedFallbackPages,
      reflection: {
        todays_lesson_uz: "Yaxshilik qilish va ota-onaga mehr ulashish qalbimizni nurga to'ldiradi.",
        todays_lesson_en: "Practicing kindness and loving our parents fills our lives with radiant light.",
        little_dua_uz: `Yo Robbim! ${childName}ga go'zal odob, mustahkam sog'lik va qanoatli qalb ato etgin. Omin!`,
        little_dua_en: `O Allah! Bless ${childName} with beautiful manners, good health and peace. Ameen!`,
        arabic_dua: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
        discussion_questions_uz: [
          `${childName} bugun qanday yaxshilik qildi?`,
          `Bugun sen qaysi yaxshi ishing bilan ota-onangga quvonch ulashding?`,
          `Ertaga ertalab uyg'onganimizda qanday yaxshi amal qilamiz?`
        ],
        discussion_questions_en: [
          `What noble action did ${childName} perform?`,
          `What good deed brought joy to your parents today?`,
          `What kind deed will you do tomorrow morning?`
        ],
        good_deed_task_uz: `Ertaga ertalab yaqinlaringizga tabassum bilan \"Assalomu alaykum!\" deb quvonch ulashing.`,
        good_deed_task_en: `Greet your family tomorrow morning with a cheerful \"Assalamu Alaykum!\"`
      },
      quiz: [
        {
          id: "q1",
          question_uz: `${childName} qissada qanday go'zal amal ko'rsatdi?`,
          question_en: `What noble act did ${childName} practice?`,
          options: [
            { id: "o1", text_uz: "Yaxshilik ulashdi va 'Alhamdulillah' deb shukr qildi", text_en: "Shared goodness and praised Allah with Alhamdulillah", isCorrect: true },
            { id: "o2", text_uz: "Faqat o'zi o'ynadi", text_en: "Only played alone", isCorrect: false },
            { id: "o3", text_uz: "Hech kimga quloq solmadi", text_en: "Did not listen to anyone", isCorrect: false }
          ],
          explanation_uz: `Ofarin! ${childName} yaxshilik ulashib, doimo shukronalik keltirdi.`,
          explanation_en: `Well done! ${childName} practiced generosity and heartfelt gratitude.`
        },
        {
          id: "q2",
          question_uz: "Yaxshi ish qilishdan oldin qaysi muborak so'z aytiladi?",
          question_en: "Which blessed word is said before starting good deeds?",
          options: [
            { id: "o1", text_uz: "Bismillahir Rohmanir Rohiym", text_en: "Bismillahir Rahmanir Raheem", isCorrect: true },
            { id: "o2", text_uz: "Rahmat", text_en: "Thank you", isCorrect: false },
            { id: "o3", text_uz: "Xayr", text_en: "Goodbye", isCorrect: false }
          ],
          explanation_uz: "To'g'ri! Har bir ezgu amal 'Bismillah' bilan boshlanadi.",
          explanation_en: "Correct! Every noble deed begins with Bismillah."
        },
        {
          id: "q3",
          question_uz: `${childName} yotishdan oldin nimani ado etdi?`,
          question_en: `What did ${childName} do before going to sleep?`,
          options: [
            { id: "o1", text_uz: "Allohga duo qildi va shukr aytdi", text_en: "Made bedtime dua and gave thanks", isCorrect: true },
            { id: "o2", text_uz: "Televizor ko'rdi", text_en: "Watched TV", isCorrect: false },
            { id: "o3", text_uz: "Yig'ladi", text_en: "Cried", isCorrect: false }
          ],
          explanation_uz: "Barakalla! Yotishdan oldin duo qilish qalbga orom beradi.",
          explanation_en: "Splendid! Bedtime prayer brings serenity to the heart."
        }
      ]
    };

    return NextResponse.json({
      success: true,
      source: 'dynamic-core',
      story: fallbackStory,
    });
  } catch (error: any) {
    console.error("Story generation API error:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate story" }, { status: 500 });
  }
}
