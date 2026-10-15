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
    ? `adorable handsome ${age}-year-old Uzbek boy named ${name}, cute young child, neat short dark wavy hair, large sparkling expressive warm brown cartoon eyes, cute round rosy cheeks, sweet gentle innocent smile`
    : `adorable sweet ${age}-year-old Uzbek girl named ${name}, cute young child, shiny dark shoulder-length hair with neat bangs, large sparkling luminous brown cartoon eyes, rosy cute cheeks, gentle radiant smile`;

  const baseAppearance = profile.character_appearance_description && profile.character_appearance_description.trim().length > 10
    ? profile.character_appearance_description.trim()
    : defaultAppearance;

  return `${baseAppearance}, wearing ${defaultClothing}`;
}

const STYLE_PROMPTS: Record<string, string> = {
  pixar_3d: "delightful 3D Disney Pixar style children's picturebook illustration, adorable lovable cartoon child character, large expressive shining eyes, warm innocent smile, bright vibrant cheerful colors, warm sunny golden daylight, cozy fairytale atmosphere, crisp clean details, heartwarming storybook masterpiece",
  watercolor: "authentic gentle fairytale watercolor illustration, soft dreamy gouache washes, fine delicate pencil outlines, heartwarming pastel palette, clean classic children's book painting, bright sunny atmosphere",
  classic_storybook: "classical vintage children's book illustration, rich warm gouache and oil painting texture, golden sunbeam lighting, heartwarming moral fairytale ambiance, crisp vibrant art",
  disney_2d: "classic Disney 2D hand-drawn animation style, crisp clean lines, vibrant storybook colors, joyful animated child character, charming fairytale illustration",
  ghibli_anime: "Studio Ghibli nature-filled anime aesthetic, lush vibrant blooming garden background, gentle morning sunlight, whimsical peaceful fairytale atmosphere, vivid colors"
};

const NEGATIVE_ENHANCERS = "strictly no photorealism, no realistic human skin, no uncanny valley, no wax figure, no creepy doll face, no adult features, no mature face, no teenagers, no dark moody shadows, no gloomy lighting, no dull muddy colors, no blur, no low resolution, no artifacts, no extra fingers, no distorted anatomy, no text, no watermark, no hats, no wizard hats, no witch hats, no giant caps";

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
    const modelsToTry = ['dall-e-3', 'dall-e-2'];
    for (const model of modelsToTry) {
      try {
        const bodyPayload: Record<string, any> = {
          model: model,
          prompt: prompt.slice(0, 950),
          n: 1,
          size: model === 'dall-e-3' ? '1024x1024' : '512x512',
        };
        if (model === 'dall-e-3') {
          bodyPayload.quality = 'hd';
        }

        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyPayload)
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
function createAiImageUrl(cleanPrompt: string, storyId: string, pageNum: number, style: string = 'pixar_3d', gender: string = 'girl'): string {
  return `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=${pageNum}&prompt=${encodeURIComponent(cleanPrompt)}&style=${encodeURIComponent(style)}&gender=${encodeURIComponent(gender)}`;
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
- "Onajon bugun nima ovqat yeymiz" (Ummu Zakariyya)
- "Aqilli bola Yusuf" & "Bolalar uchun 40 Hadis hikoyalari"
- "Farishtalar va Iymon saboqlari"

TARGET CHILD & STORY CONTEXT:
- Child Name: "${childName}"
- Gender: "${isBoy ? 'o\'g\'il bola' : 'qiz bola'}"
- Age: ${age} yosh
- Total Pages: Exactly ${targetPageCount} pages (numbered 1 to ${targetPageCount})
- Reading Context: "${readingTime}"
- Today's Activity: "${activity}"
- Child Mood: "${mood}"
- Setting: "${setting}"
- Core Moral Virtue: "${virtue}" (Islomiy fazilatlar: Shukronalik, Taom odobi, Poklik va tartib, Kattalarga va buvijonga hurmat, Ota-onani e'zozlash, Namoz va masjid odoblari, Saxovat va muhtojlarga ehson, Isrofga yo'l qo'ymaslik, Qalb sakinati).
- LOCKED CHARACTER VISUAL ANCHOR: "${masterAnchor}"

MANDATORY NARRATIVE & ISLAMIC PEDAGOGY RULES:
1. STRICTLY HUMAN CHARACTERS & NO ANIMAL PROTAGONISTS:
   - The characters MUST be real human beings: the child (${childName}), loving mother (Onajonisi), caring father (Dadasi), wise luminous grandmother (Buvijonisi) or grandfather (Bobojonisi), siblings, and elders.
   - Do NOT use animals as main characters, talking creatures, or constant pet companions. The story revolves around human moral choices, Islamic family bonds, and spiritual growth.
2. RICH DEPTH & LENGTH (NO SUPERFICIAL 1-SENTENCE PAGES):
   - Every single page MUST contain 3 to 5 richly developed sentences (minimum 50-70 words per page in Uzbek).
   - Weave in sensory descriptions: the fragrance of blooming apricot trees, the fresh breeze across ancient domes and courtyards, the cheerful chirping of spring birds, the warm aroma of fresh tandoor bread, the gentle turning of gilded book pages, the resonant melodious Adhan.
3. NATURAL DIALOGUE & RESPECTFUL UZBEK SPEECH:
   - Dialogue is MANDATORY on most pages.
   - Use warm Uzbek affectionate terms: «Ko'zimning oqi», «Jon bolam», «Onajon», «Dadajon», «Buvijon».
   - Use proper quotes («...») for speech.
4. DIVERSE & ADVENTUROUS STORY OPENINGS (NOT ALWAYS BEDTIME OR MORNING!):
   - The story MUST NOT always start at bedtime or morning in a bedroom. Allow dynamic, thrilling, and engaging beginnings based on the reading context ("${readingTime}") and setting ("${setting}"):
     * ADVENTURE & DISCOVERY: An expedition to historical monuments (Samarkand, Bukhara, ancient caravanserais), finding an antique illustrated manuscript, exploring a grandfather's woodcraft workshop, embarking on a quest to solve a mystery through wisdom.
     * NATURE & LIVING WORLD: A sunny hike through green hills, walking beside a clear bubbling river, discovering a thirsty or injured songbird in a flowering orchard, planting a fruit tree, or discovering the wondrous creations of Allah in nature.
     * NEIGHBORHOOD & COMMUNITY: A mission with friends in the mahalla to do a secret act of kindness, helping an elder carry groceries, cleaning a public water fountain, building a bird shelter.
     * FAMILY & CELEBRATION: Visiting a lively spice and fruit bazaar, preparing a joyous family dinner, receiving a special guest.
     * BEDTIME SAKINAT: Only when explicitly requested, use a quiet, cozy evening bedtime ambiance.
   - Weave in the Sunnah pedagogical moment: faced with a dilemma, challenge, or choice, the loving elder gently asks:
     «Payg'ambarimiz sallallohu alayhi vasallam bu vaziyatda nima qilgan bo'lardilar?»
   - Cite an authentic Sunnah or Hadith (mercy to creatures, honesty in trade, sharing knowledge, respecting elders, courage in truth).
5. INNER EMOTIONAL TRANSFORMATION (REALIZATION):
   - The child reflects deeply: «Men tushundim...», «Alloh taolo ezgulik qiluvchilarni va tirishqoqlarni yaxshi ko'radi».
   - Concrete positive action: solving the challenge, rescuing the creature, helping others, completing the quest with «Bismillah».
6. DYNAMIC & JOYFUL RESOLUTIONS (MATCHING THE CONTEXT):
   - If the story is an ADVENTURE or DAYTIME journey: conclude with celebratory triumph («Biz buni uddaladik!», «Alhamdulillah!»), warm family embraces, pride in achieving something meaningful, a grateful Dua, and enthusiastic readiness for tomorrow's good deeds.
   - If the story is BEDTIME: conclude with serene Sakinat, cupping hands for heartfelt Dua, and peaceful sweet dreams under angelic protection.
7. ZERO MYTHOLOGY: Strictly NO magic wands, wizards, witches, fairies, talking beasts, or mythological spells. Real Islamic reality only.

CRITICAL IMAGE PROMPT CONSISTENCY INSTRUCTION:
For EVERY page, you MUST generate an "image_prompt" in ENGLISH following this exact formula:
Formula: [LOCKED CHARACTER ANCHOR] + [PRECISE SCENE ACTION & EXPRESSION] + [ENVIRONMENT & OBJECTS] + [LIGHTING & STORYBOOK ART STYLE]
Example: "${masterAnchor} is standing happily in a sunlit blooming orchard holding a crafted wooden birdhouse with smiling father, sunny golden daylight, delightful 3D Disney Pixar style children's picturebook illustration, crisp clean details, vibrant cheerful colors, masterpiece"

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

    // 2. Try Google Gemini models
    const geminiKey = getGeminiApiKey();
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-2.0-flash',
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
      const coverPrompt = `${characterPersona} in a cozy warm glowing ${translateColorToEnglish(color)} room, gentle ambient sunlight, loving peaceful Islamic family ambiance, smiling warmly with joyful eyes, title banner, crisp clean children picturebook illustration, masterpiece`;
      
      // Generate Cover Art: OpenAI DALL-E 3 HD or stream endpoint
      const fallbackAiCoverUrl = createAiImageUrl(coverPrompt, storyId, 0, chosenStyle, profile.gender);
      const coverImageUrl = await generateDallEImage(
        `${coverPrompt}, ${STYLE_PROMPTS[chosenStyle] || STYLE_PROMPTS.pixar_3d}, ${NEGATIVE_ENHANCERS}`,
        fallbackAiCoverUrl
      );

      // Generate 100% new, unique AI illustrations for every single page
      const enhancedPages = generatedStory.pages.map((p, idx) => {
        const actionText = p.scene_summary || p.text_uz?.slice(0, 150) || 'heartwarming bedtime moment';
        
        const pagePrompt = p.image_prompt && p.image_prompt.includes(childName)
          ? p.image_prompt
          : `${characterPersona} in ${actionText}, ${translateColorToEnglish(color)} setting, soft warm golden lighting, adorable cheerful expression`;

        const pageImageUrl = createAiImageUrl(pagePrompt, storyId, idx + 1, chosenStyle, profile.gender);

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
        prologue_uz: generatedStory.prologue_uz || `Erka farzandimiz — ${childName}ning oilaviy mehr-oqibat va ezgu fazilatlarga to'la nurli oqshom sarguzashti...`,
        prologue_en: generatedStory.prologue_en || `A heartwarming bedtime journey of ${childName} filled with kindness, respect, and Islamic values...`,
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
