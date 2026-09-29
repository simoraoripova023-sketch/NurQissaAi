import { NextRequest, NextResponse } from 'next/server';
import { ChildProfile, StoryBook } from '@/lib/types';
import { getOpenAiApiKey, getGeminiApiKey } from '@/lib/serverKeys';
import { generateDynamicIslamicStory } from '@/lib/storyFallbackEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Builds an immutable Master Character Visual Anchor to guarantee 100% character consistency across all pages.
 */
function buildMasterCharacterAnchor(profile: ChildProfile): string {
  const isBoy = profile.gender === 'boy';
  const name = profile.child_name || (isBoy ? 'Yusuf' : 'Fotima');
  const age = profile.age || 6;

  const defaultClothing = isBoy
    ? "a neat modest white collared shirt under a soft emerald-green embroidered vest, tailored beige trousers, clean shoes"
    : "a lovely modest pastel-colored floral dress with gentle long sleeves, delicate embroidery, and a cute little flower clip in hair";

  const defaultAppearance = isBoy
    ? `adorable handsome ${age}-year-old Uzbek boy named ${name}, neat short dark wavy hair, large sparkling expressive warm brown eyes, cute round rosy cheeks, sweet gentle innocent smile`
    : `adorable sweet ${age}-year-old Uzbek girl named ${name}, shiny dark shoulder-length hair with neat bangs, large sparkling luminous brown eyes, rosy cute cheeks, gentle radiant smile`;

  const baseAppearance = profile.character_appearance_description && profile.character_appearance_description.trim().length > 10
    ? profile.character_appearance_description.trim()
    : defaultAppearance;

  const companion = profile.favorite_animal ? `accompanied by a cute friendly ${translateAnimalToEnglish(profile.favorite_animal)}` : '';

  return `${baseAppearance}, wearing ${defaultClothing}${companion ? `, ${companion}` : ''}`;
}

const STYLE_PROMPTS: Record<string, string> = {
  pixar_3d: "3D Disney Pixar animation storybook masterpiece, ultra-smooth character rendering, soft glowing golden hour bedtime lighting, rich warm cinematic colors, 8k resolution, highly detailed texture, lovable expressive facial features",
  watercolor: "authentic gentle fairytale watercolor illustration, soft dreamy gouache washes, fine delicate pencil outlines, heartwarming pastel palette, clean classic children's book painting",
  classic_storybook: "classical vintage children's book illustration, rich warm gouache and oil painting texture, golden sunbeam lighting, heartwarming moral fairytale ambiance",
  disney_2d: "classic Disney 2D hand-drawn animation style, crisp clean lines, vibrant storybook colors, joyful animated child character",
  ghibli_anime: "Studio Ghibli nature-filled anime aesthetic, lush vibrant blooming garden background, gentle morning sunlight, whimsical peaceful fairytale atmosphere"
};

const NEGATIVE_ENHANCERS = "strictly no hats, no wizard hats, no witch hats, no giant caps, no costumes, no floating head, no blurry faces, no distorted eyes, no deformed fingers or extra limbs, no adult features on child, no creepy doll face, no smeared features, no scary elements, high definition sharp focus";

function translateAnimalToEnglish(animalStr: string): string {
  const lower = (animalStr || '').toLowerCase();
  if (lower.includes('quyon')) return 'a cute little white fluffy bunny rabbit';
  if (lower.includes('kabutar') || lower.includes('kaptar')) return 'a gentle friendly white dove bird';
  if (lower.includes('mushuk')) return 'an adorable sweet fluffy little kitten';
  if (lower.includes('bo\'taloq') || lower.includes('tuya')) return 'a cute gentle baby camel';
  if (lower.includes('qo\'zi') || lower.includes('qozi')) return 'a sweet little white fluffy baby lamb';
  if (lower.includes('bulbul') || lower.includes('qush')) return 'a cheerful little colorful songbird';
  return 'a lovely cute companion animal';
}

function translateColorToEnglish(colorStr: string): string {
  const lower = (colorStr || '').toLowerCase();
  if (lower.includes('yashil') || lower.includes('zumrad')) return 'warm emerald green and golden light';
  if (lower.includes('ko\'k') || lower.includes('moviy')) return 'peaceful pastel blue and warm golden sunlight';
  if (lower.includes('pushti')) return 'gentle pastel rose pink and soft warm tones';
  if (lower.includes('oltin') || lower.includes('sariq')) return 'radiant amber gold and cozy cream';
  return 'warm glowing golden bedtime lighting';
}

/**
 * Generates custom 3D storybook scene illustration with consistent character features using OpenAI
 */
async function generateDallEImage(prompt: string, fallbackUrl: string): Promise<string> {
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
            prompt: prompt.slice(0, 950),
            n: 1,
            size: '1024x1024'
          })
        });

        if (res.ok) {
          const data = await res.json();
          const b64 = data?.data?.[0]?.b64_json;
          if (b64) {
            return `data:image/png;base64,${b64}`;
          }
          if (data?.data?.[0]?.url) {
            return data.data[0].url;
          }
        } else {
          const err = await res.json().catch(() => ({}));
          console.warn(`OpenAI image notice with ${model}:`, err?.error?.message || res.status);
        }
      } catch (err) {
        console.warn(`Error fetching OpenAI image with ${model}:`, err);
      }
    }
  }

  return fallbackUrl;
}

/**
 * Creates dynamic high-definition AI image URL using the server-side story-image endpoint
 */
function createAiImageUrl(prompt: string, storyId: string, pageNum: number, style: string = 'pixar_3d'): string {
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.pixar_3d;
  const fullPrompt = `${prompt}, ${stylePrompt}, ${NEGATIVE_ENHANCERS}`;
  return `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=${pageNum}&prompt=${encodeURIComponent(fullPrompt)}&style=${encodeURIComponent(style)}`;
}

/**
 * Analyzes uploaded child photo to extract consistent 3D character persona features
 */
async function analyzeChildPhoto(photoDataUrl?: string, gender: string = 'boy', name: string = 'Yusuf'): Promise<string> {
  const apiKey = getOpenAiApiKey();

  const isBoy = gender === 'boy';
  const defaultPersona = isBoy
    ? `adorable cheerful 6-year-old Uzbek boy named ${name} with neat dark hair, sparkling warm brown eyes, sweet innocent smile, wearing a neat modest soft-colored outfit`
    : `adorable sweet 5-year-old Uzbek girl named ${name} with cute dark hair, bright expressive sparkling eyes, sweet joyful smile, wearing a lovely elegant dress`;

  if (!apiKey || !photoDataUrl || !photoDataUrl.startsWith('data:image')) {
    return defaultPersona;
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Describe the child in this photo in 1 precise sentence for a 3D Pixar character prompt (approximate age, gender, hair style/color, facial features, eye expression, clothing color and style). Format as a character description without introductory words. Child name is ${name}.` },
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
    console.warn('Vision photo analysis notice:', e);
  }

  return defaultPersona;
}

/**
 * Generates an authentic Islamic values-based bedtime story using Google Gemini or OpenAI
 */
async function generateStoryWithAi(profile: ChildProfile, masterAnchor: string, apiKey: string): Promise<Partial<StoryBook> | null> {
  try {
    const isBoy = profile.gender === 'boy';
    const childName = profile.child_name;
    const virtue = profile.parent_goal || 'kindness';
    const setting = profile.story_setting || 'cozy_home';
    const animal = profile.favorite_animal || (isBoy ? 'oq kabutar' : 'mitti quyoncha');
    const color = profile.favorite_color || 'zumrad yashil va oltin rang';
    const age = profile.age || 6;
    const readingTime = profile.reading_time_context || 'bedtime';
    const activity = profile.daily_activity || 'yaxshiliklar qildi';
    const mood = profile.emotional_state || 'happy';
    const chosenStyle = profile.illustration_style || 'pixar_3d';
    const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 3), 10);

    const systemPrompt = `You are a master Islamic children's author and pedagogue for the "NurQissa AI" platform.
Your mission is to craft an authentic, heartwarming, deeply meaningful ${targetPageCount}-page children's story in rich literary Uzbek (primary) and English (secondary).
Strictly draw from the proven narrative models of classical and modern Islamic children's masterworks:
- "Payg'ambarimiz sallallohu alayhi vasallam nima qilgan bo'lardilar" (Mo'tabar Xamrayeva)
- "Zahro va yo'qolgan mushukcha" (Ummu Zahro)
- "Onajon bugun nima ovqat yeymiz" (Ummu Zakariyya)
- "Imron va xafa bo'lgan o'yinchoqlar" (Umida Bahodir qizi)
- "Aqilli bola Yusuf" & "Bolalar uchun 40 Hadis hikoyalari"

TARGET CHILD & STORY CONTEXT:
- Child Name: "${childName}"
- Gender: "${isBoy ? 'o\'g\'il bola' : 'qiz bola'}"
- Age: ${age} yosh
- Total Pages: Exactly ${targetPageCount} pages (numbered 1 to ${targetPageCount})
- Reading Context: "${readingTime}"
- Today's Activity: "${activity}"
- Child Mood: "${mood}"
- Companion: "${animal}"
- Setting: "${setting}"
- Core Moral Virtue: "${virtue}" (Islomiy fazilatlar: Shukronalik, Taom odobi, Poklik va tartib, Jonzotlarga shafqat, Isrofga yo'l qo'ymaslik, Saxovat va muhtojlarga ehson, Ota-onani e'zozlash, Qalb sakinati va namoz).
- LOCKED CHARACTER VISUAL ANCHOR: "${masterAnchor}"

MANDATORY NARRATIVE & LITERARY QUALITY RULES:
1. RICH DEPTH & LENGTH (NO SUPERFICIAL 1-SENTENCE PAGES):
   - Every single page MUST contain 3 to 5 richly developed sentences (minimum 50-70 words per page in Uzbek).
   - Weave in sensory descriptions: the warm aroma of home cooking, the amber twilight light, the trembling whimper of a cold kitten, the colorful scattered blocks on the carpet, the soft whisper of evening prayer.
2. NATURAL DIALOGUE & RESPECTFUL UZBEK SPEECH:
   - Dialogue is MANDATORY on most pages.
   - Use warm Uzbek affectionate terms: «Ko'zimning oqi», «Jon bolam», «Onajon», «Dadajon», «Buvijon».
   - Use proper quotes («...») for speech.
3. THE PROPHETIC SUNNAH PEDAGOGICAL FORMULA:
   - Start with a realistic childhood friction: reluctance to clean up, wanting a new snack instead of wholesome food, noticing an animal in need, or hesitation.
   - The loving parent or elder gently guides with the central question:
     «Payg'ambarimiz sallallohu alayhi vasallam bu vaziyatda nima qilgan bo'lardilar?»
   - Cite an authentic Sunnah or Hadith (e.g. mercy to the deer/kitten, not criticizing food, tidiness being half of faith, sharing what you love).
4. INNER EMOTIONAL TRANSFORMATION (REALIZATION):
   - The child reflects deeply: «Men xatoyimni tushundim...», «Kichkina yaxshilik ham kim uchundir eng katta yordam bo'lishi mumkin».
   - Concrete positive action: tidying up, sharing food or toys with a needy neighbor, embracing mother with «Alhamdulillah».
5. SAKINAT & SINCERE BEDTIME DUA:
   - Conclude with genuine spiritual peace (Sakinat), cupping hands for Dua with parents, and drifting to sleep under the watchful care of angels.
6. ZERO MYTHOLOGY: Strictly NO magic wands, wizards, witches, fairies, or mythological spells.

CRITICAL IMAGE PROMPT CONSISTENCY INSTRUCTION:
For EVERY page, you MUST generate an "image_prompt" in ENGLISH following this exact formula:
Formula: [LOCKED CHARACTER ANCHOR] + [PRECISE SCENE ACTION & EXPRESSION] + [ENVIRONMENT & OBJECTS] + [LIGHTING & 3D PIXAR RENDER STYLE]
Example: "${masterAnchor} is sitting at a low wooden dining table holding hands with smiling mother wearing pastel hijab, looking remorseful yet enlightened over a steaming bowl of soup, warm golden sunset light, traditional Uzbek home interior, 3D Pixar animation storybook masterpiece, 8k render"

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
      "image_prompt": "...",
      "scene_summary": "..."
    }
  ],
  "reflection": {
    "todays_lesson_uz": "...",
    "todays_lesson_en": "...",
    "hadith_sharif_uz": "«...» (Hadisi Sharif)",
    "hadith_sharif_en": "«...» (Prophetic Hadith)",
    "arabic_dua": "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
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
    }
  ]
}`;

    // 1. Try OpenAI GPT-4o-mini if key exists
    const openAiKey = getOpenAiApiKey();
    if (openAiKey) {
      try {
        const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an authentic Islamic children storytelling engine. Output 100% valid JSON only adhering strictly to the schema.' },
              { role: 'user', content: systemPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.72,
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
        console.warn('OpenAI GPT-4o-mini generation notice, trying Gemini:', e);
      }
    }

    // 2. Try Google Gemini models (prioritizing 200 OK models)
    const geminiKey = getGeminiApiKey();
    const modelsToTry = [
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ];

    let resultText = '';
    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.72,
              maxOutputTokens: 7500,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) break;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`Gemini ${model} returned ${response.status}:`, errData?.error?.message?.slice(0, 100));
        }
      } catch (err) {
        console.warn(`Gemini model ${model} notice:`, err);
      }
    }

    if (!resultText) return null;

    const cleanedText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error in generateStoryWithAi:", error);
    return null;
  }
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
    const animal = profile.favorite_animal || (isBoy ? 'oq kabutar' : 'mitti quyoncha');
    const color = profile.favorite_color || 'zumrad yashil va oltin rang';
    const chosenStyle = profile.illustration_style || 'pixar_3d';
    const geminiApiKey = getGeminiApiKey();
    const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 3), 10);

    // 1. Build locked Master Character Anchor (from vision photo analysis or precise traits)
    let characterPersona = buildMasterCharacterAnchor(profile);
    if (profile.child_photo_url && profile.child_photo_url.startsWith('data:image')) {
      const visionPersona = await analyzeChildPhoto(profile.child_photo_url, profile.gender, childName);
      if (visionPersona && visionPersona.length > 20) {
        characterPersona = visionPersona;
      }
    }

    // 2. Generate Story Narrative with strict Character Anchor adherence
    const generatedStory = await generateStoryWithAi(profile, characterPersona, geminiApiKey.trim());

    if (generatedStory && generatedStory.pages && generatedStory.pages.length >= 3) {
      const coverPrompt = `${characterPersona}, together with companion ${translateAnimalToEnglish(animal)} in cozy warm glowing ${translateColorToEnglish(color)} room, gentle ambient sunlight, smiling warmly with joyful eyes, title banner, 8k resolution, cinematic lighting, masterpiece`;
      
      // Generate Cover Art: OpenAI gpt-image-1-mini or stream endpoint
      const fallbackAiCoverUrl = createAiImageUrl(coverPrompt, storyId, 0, chosenStyle);
      const coverImageUrl = await generateDallEImage(coverPrompt, fallbackAiCoverUrl);

      // Generate 100% new, unique AI illustrations for every single page
      const enhancedPages = generatedStory.pages.map((p, idx) => {
        const actionText = p.scene_summary || p.text_uz?.slice(0, 150) || 'heartwarming bedtime moment';
        
        const pagePrompt = p.image_prompt && p.image_prompt.includes(childName)
          ? `${p.image_prompt}, ${STYLE_PROMPTS[chosenStyle] || STYLE_PROMPTS.pixar_3d}, ${NEGATIVE_ENHANCERS}`
          : `${characterPersona} in ${actionText}, ${translateColorToEnglish(color)} setting, soft warm golden lighting, adorable cheerful expression, ${STYLE_PROMPTS[chosenStyle] || STYLE_PROMPTS.pixar_3d}, ${NEGATIVE_ENHANCERS}`;

        const pageImageUrl = createAiImageUrl(pagePrompt, storyId, idx + 1, chosenStyle);

        return {
          page_number: idx + 1,
          text_uz: p.text_uz || '',
          text_en: p.text_en || '',
          image_prompt: pagePrompt,
          image_url: pageImageUrl,
          scene_summary: p.scene_summary || `${childName} sarguzashti - ${idx + 1}-sahifa`,
        };
      });

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
          good_deed_task_uz: `Ertaga ertalab ota-onangizga shirin tabassum bilan "Assalomu alaykum!" deng.`,
          good_deed_task_en: `Greet your family tomorrow morning with a warm smile saying "Assalamu Alaykum!"`
        },
        quiz: generatedStory.quiz || [],
      };

      return NextResponse.json({
        success: true,
        source: 'ai-consistent-engine',
        story: dynamicStory,
      });
    }

    // 3. Fallback: Multi-Archetype Islamic Tale Generator directly powered by literature
    const chosenStylePrompt = STYLE_PROMPTS[chosenStyle] || STYLE_PROMPTS.pixar_3d;
    const dynamicIslamicFallback = generateDynamicIslamicStory(
      profile,
      characterPersona,
      chosenStylePrompt,
      NEGATIVE_ENHANCERS
    );

    return NextResponse.json({
      success: true,
      source: 'islamic-literature-archetype-engine',
      story: dynamicIslamicFallback,
    });
  } catch (error: any) {
    console.error("Story generation API error:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate story" }, { status: 500 });
  }
}
