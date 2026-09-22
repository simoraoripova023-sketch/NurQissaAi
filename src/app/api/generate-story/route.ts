import { NextRequest, NextResponse } from 'next/server';
import { ChildProfile, StoryBook } from '@/lib/types';
import { getOpenAiApiKey, getGeminiApiKey } from '@/lib/serverKeys';

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

    const systemPrompt = `You are a world-class Islamic children's storytelling pedagogue and art director for the "NurQissa AI" platform.
Generate an authentic, highly personalized, heartwarming ${targetPageCount}-page Islamic storybook in rich literary Uzbek (main) and English (translation), strictly grounded in authentic Islamic children's literature (drawing directly from masterworks like "Payg'ambarimiz nima qilgan bo'lardilar", "Zahro va yo'qolgan mushukcha", "Zakariyo va kechagi taom", "Imron va xafa bo'lgan o'yinchoqlar", "Aqilli bola Yusuf", "Allohning chin do'sti").

TARGET CHILD PROFILE & CHARACTER ANCHOR:
- Child Name: "${childName}"
- Gender: "${isBoy ? 'o\'g\'il bola' : 'qiz bola'}"
- Age: ${age} yosh
- Total Pages: Exactly ${targetPageCount} pages (numbered 1 to ${targetPageCount})
- Reading Occasion: "${readingTime}"
- Today's Activity: "${activity}"
- Mood: "${mood}"
- Companion Animal: "${animal}"
- Palette / Theme: "${color}"
- Setting: "${setting}"
- Core Moral Virtue: "${virtue}" (Islomiy fazilat: Sabr, Shukr, Saxovat, Mehr-oqibat, Ota-onani e'zozlash, Rostgo'ylik, Odob-axloq, Poklik va tartib, Isrof qilmaslik, Jonzotlarga shafqat, Muhtojlarga ehson).
- LOCKED CHARACTER VISUAL ANCHOR: "${masterAnchor}"

PEDAGOGICAL STORY ARC ARCHETYPE (Follow this proven structure from Payg'ambarimiz nima qilgan bo'lardilar, Zahro, Zakariyo & Imron):
1. REALISTIC CHILD SITUATION: Start with a relatable childhood moment (e.g. playing happily with toys/companion, dinnertime with family, encountering a weak creature/kitten, hesitation or momentary complaint/messiness).
2. TENDER PARENTAL WISDOM & SUNNAH QUESTION: Loving mother/father/grandparent gently teaches the wisdom, asking: «Payg'ambarimiz sallallohu alayhi vasallam bu vaziyatda nima qilgan bo'lardilar?» (e.g. teaching gratitude for home/food, remembering less fortunate children, kindness to animals, avoiding isrof/waste, Quranic ayat like «Agar shukr qilsangiz, albatta, sizga ziyoda qilurman» [Ibrohim, 7] or Prophetic Hadiths).
3. INNER REALIZATION & POSITIVE ACTION: The child realizes the blessing, corrects the mistake (e.g. happily helping the kitten/animal, tidying room, sorting out unused toys/clothes to donate to needy neighbor children, eating with "Bismillah" and "Alhamdulillah", warmly hugging parents).
4. SAKINAT & BEDTIME DUA: Peaceful feeling of Barakah in the family, concluding with sincere bedtime Dua and sweet dreams under Allah's protection.

CRITICAL IMAGE PROMPT CONSISTENCY INSTRUCTION:
For EVERY page, you MUST generate an "image_prompt" in ENGLISH following this exact 4-part formula:
Formula: [LOCKED CHARACTER ANCHOR] + [EXACT SCENE PHYSICAL ACTION & EMOTION] + [ENVIRONMENT & ATMOSPHERE] + [LIGHTING & 3D PIXAR RENDER STYLE]
Examples:
- "${masterAnchor} is sitting at a cozy wooden dining table with loving mother wearing soft beige hijab, smiling with large brown sparkling eyes over a traditional ceramic bowl of warm pilaf and fresh fruit basket, warm golden sunlight through window, framed Arabic calligraphy on wall, 3D Pixar animation storybook masterpiece, vivid colors, 8k render"
- "${masterAnchor} is kneeling on a soft bedroom carpet happily organizing colorful toy blocks and cars into neat storage boxes, bedroom with neat book shelves and soft ambient glow, 3D Pixar animation style, vivid colors, 8k render, masterpiece"

AUTHENTIC ISLAMIC LITERATURE RULES:
1. HADITH & PROPHETIC SUNNAH: Weave authentic Hadiths naturally into dialogue (e.g., «Tabassum qilish ham sadaqadir», «Poklik iymondandir», «Ota-onaga yaxshilik qilish eng ulug' amallardandir»).
2. DUA & SUNNAH HABITS: Opening with "Bismillahir Rohmanir Rohiym", praising Allah with "Alhamdulillah", bedtime prayer with open palms («Bismika Allohumma amutu va ahya»), and Dua for parents.
3. ZERO MYTHOLOGY: Absolutely NO magic wands, spells, fairies, witches, or wizards.
4. RICH PEDAGOGICAL TONE: Pure, warm, and inspiring bedtime language in literary Uzbek.

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
    }
  ]
}`;

    // 1. Try OpenAI GPT-4o-mini
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

    // 2. Try Google Gemini models
    const geminiKey = getGeminiApiKey();
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
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
              maxOutputTokens: 6500,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) break;
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

    // 3. Fallback: High-Quality Programmatic Islamic Tale with 100% newly generated AI scene images
    const animalEn = translateAnimalToEnglish(animal);
    const colorEn = translateColorToEnglish(color);

    const rawFallbackPages = [
      {
        page_number: 1,
        text_uz: `Oqshom shafag'i olamga oltin nurlarini sochar edi. ${childName} o'zining sevimli ${animal}i bilan birga xonadonida o'tirib, osmondagi yulduzlarni tomosha qilardi. Uning qalbida go'zal ibratli ertak tinglash ishtiyoqi yonardi.`,
        text_en: `As the golden evening arrived, ${childName} sat peacefully with their beloved ${animal}, gazing at the first twinkling stars.`,
        scene_summary: `${childName}ning oqshomgi xotirjamligi va tafakkuri`,
        scene_prompt: `${characterPersona}, sitting cozily beside ${animalEn} looking at twilight stars through the window, warm golden sunset rays, peaceful cozy room with soft patterned rug, soft ambient glow`
      },
      {
        page_number: 2,
        text_uz: `Shu payt xonaga mehribon buvijonisi va ota-onasi kirib keldilar. Ular ${childName}ning yoniga o'tirib, mehr bilan peshonasidan o'pdilar: "Ko'zlarimizning nuri, bilasanmi, chinakam baxt — har bir ne'mat uchun Allohga shukr qilish va yaxshilik ulashishdadir", dedilar.`,
        text_en: `Loving family joined ${childName}, sharing gentle words of wisdom: "True happiness comes from gratitude and sharing goodness."`,
        scene_summary: `Oila mehri va nuryuzli buvijonisining o'giti`,
        scene_prompt: `${characterPersona}, sitting affectionately beside loving smiling grandmother and parents, grandmother gently touching child's shoulder, smiling warmly, warm tea cups on low table, cozy living room`
      },
      {
        page_number: 3,
        text_uz: `${childName} o'zining sevimli ${animal}ini quchoqlab, samimiy jilmaydi. U bugun o'rgangan go'zal fazilatga amal qilishga qaror qildi: "Bismillahir Rohmanir Rohiym!" deb, eng sevimli narsasini oilasi va yaqinlari bilan baham ko'rdi.`,
        text_en: `With a joyful smile, ${childName} whispered "Bismillah" and happily shared what they loved most with family.`,
        scene_summary: `Bismillah bilan ezgulik va saxovat ko'rsatish`,
        scene_prompt: `${characterPersona}, happily sharing sweet fruits and treats with family members, cheerful joyful smile, holding hands out politely, bright warm inviting Islamic arch decor room`
      },
      {
        page_number: 4,
        text_uz: `Birdan butun xona go'yo nurga to'ldi! ${childName}ning yaxshi amali tufayli ${animal} ham quvonchdan sakrab ketdi. Har bir yaxshi amal qalbga xotirjamlik va baraka olib kelishini ${childName} dildan his qildi.`,
        text_en: `The room sparkled with warmth. Doing good brought instant peace and light to everyone's heart.`,
        scene_summary: `Ezgulikning nurli barakasi va qalb sakinatlari`,
        scene_prompt: `${characterPersona}, standing happily with open joyful arms in a bright room illuminated with soft glowing golden magical sparkles, cute ${animalEn} jumping playfully in excitement, pure happiness and radiant warm light`
      },
      {
        page_number: 5,
        text_uz: `Kechki dasturxonda butun oila jam bo'ldi. ${childName} odob bilan taom yeb, "Alhamdulillah, bizga bergan barcha shirin ne'matlaringga shukur, Yo Robbim!" dedi. Ota-onasi uning odobidan cheksiz faxrlandilar.`,
        text_en: `At dinnertime, ${childName} politely said 'Alhamdulillah', filling parents with immense pride and joy.`,
        scene_summary: `Shukronalik dasturxoni va go'zal odob`,
        scene_prompt: `${characterPersona}, sitting politely with parents at dinner table filled with fresh bread and tea, holding hands in gratitude prayer, smiling proudly, warm cozy dining room lanterns`
      },
      {
        page_number: 6,
        text_uz: `Oqshom tushib, osmon hilol oy va son-sanoqsiz yulduzlar bilan bezandi. ${childName} xonasini ozoda qilib, yotishga tayyorlandi. Uning qalbi cheksiz oromga to'lgan edi.`,
        text_en: `Outside the window, a bright crescent moon smiled as ${childName} prepared for cozy bedtime.`,
        scene_summary: `Orombaxsh oqshom sukunati va xona ozodaligi`,
        scene_prompt: `${characterPersona}, tidying up storybooks in a neat clean bedroom, glowing crescent moon and stars outside large window, serene calming bedtime ambient lighting`
      },
      {
        page_number: 7,
        text_uz: `Yotishdan oldin ${childName} jajji kaftlarini ochib, ixlos bilan duo qildi: "Ey mehribon Allohim! Ota-onamni, oilamni asragin. Menga go'zal xulq va sabr bergin. Omin!". Buvijonisi unga shirin fotiha berdi.`,
        text_en: `Raising hands in sincere prayer, ${childName} asked Allah to bless parents, family, and keep their heart pure.`,
        scene_summary: `${childName}ning samimiy oqshomgi duosi`,
        scene_prompt: `${characterPersona}, kneeling on a soft prayer carpet with cupped open hands making heartfelt bedtime Dua prayer, soft divine golden moonlight, calm tranquil spiritual atmosphere`
      },
      {
        page_number: 8,
        text_uz: `${childName} yostig'iga bosh qo'yib, jilmaygancha shirin uyquga ketdi. U shirin tushlar ko'rib, farishtalar panohida orom oldi. Xayrli tun, aziz ${childName}!`,
        text_en: `Resting upon soft pillows, ${childName} drifted into the sweetest peaceful sleep. Good night, little champion!`,
        scene_summary: `Shirin tushlar va farishtalar panohidagi uyqu`,
        scene_prompt: `${characterPersona}, sleeping soundly under a cozy soft blanket with a gentle innocent smile, ${animalEn} curled up peacefully beside bed, gentle soothing star night lamp, fairytale bedtime serenity`
      }
    ];

    const fallbackCoverPrompt = `${characterPersona}, together with companion ${animalEn} in cozy warm glowing ${colorEn} room, gentle ambient sunlight, smiling warmly with joyful eyes, title banner, 8k resolution, cinematic lighting, masterpiece`;
    const fallbackCoverUrl = createAiImageUrl(fallbackCoverPrompt, storyId, 0, chosenStyle);
    const coverImageUrl = await generateDallEImage(fallbackCoverPrompt, fallbackCoverUrl);

    const selectedPages = rawFallbackPages.slice(0, targetPageCount).map((p, idx) => {
      const prompt = `${p.scene_prompt}, ${colorEn}, ${STYLE_PROMPTS[chosenStyle] || STYLE_PROMPTS.pixar_3d}, ${NEGATIVE_ENHANCERS}`;
      return {
        ...p,
        page_number: idx + 1,
        image_prompt: prompt,
        image_url: createAiImageUrl(prompt, storyId, idx + 1, chosenStyle),
      };
    });

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
      pages: selectedPages,
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
        good_deed_task_uz: `Ertaga ertalab yaqinlaringizga tabassum bilan "Assalomu alaykum!" deb quvonch ulashing.`,
        good_deed_task_en: `Greet your family tomorrow morning with a cheerful "Assalamu Alaykum!"`
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
