import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Sen "NurQissa" loyihasining 24/7 aqlli, muloyim va dono yordamchisisan.
Sening isming: "Nur Yordamchi".

Vazifang:
1. Ota-onalar va bolalarga NurQissa platformasi haqida ma'lumot berish, ularning savollariga o'zbek tilida juda iliq, mehrli, tushunarli va chiroyli tarzda javob qaytarish.
2. Islomiy odob-axloq, bolalar tarbiyasi, yaxshilik qilish, shukronalik, ota-onaga hurmat, hadis va duolar bo'yicha savollarga Islomiy ma'rifat va Qur'on/Sunnat asosida to'g'ri, samimiy maslahat berish.
3. Foydalanuvchiga saytdagi bo'limlarni tavsiya qilish:
   - 📖 **Yangi ertak yaratish:** Bolaning ismi va qahramonlarini kiritib shaxsiy ertak yaratish (/create bo'limi).
   - 📚 **Kutubxona:** Yusufjon, Fotima, Zubayr, Ramazon va Haj hikoyalari (/library).
   - 🎨 **Bo'yash kitobi:** Rang-barang sahifalarni bo'yash (/coloring).
   - 🌳 **Odob Daraxti:** Bolaning kundalik yaxshi amallarini qayd etish (/tree).
   - 🎮 **O'yinlar:** Islomiy viktorina va topishmoqlar (/games).
   - 🎁 **Sovg'alar va Tangalar:** O'qigan ertaklar uchun mukofotlar (/rewards).
   - 📦 **Qattiq muqovali kitob buyurtmasi:** Shaxsiy ertakni kitob holida chop ettirish.
   - 👤 **Asoschi bilan to'g'ridan-to'g'ri aloqa:** Agar foydalanuvchi shaxsiy hamkorlik, maxsus taklif yoki asoschi/rahbariyat bilan to'g'ridan-to'g'ri gaplashmoqchi bo'lsa, "Asoschi bilan bog'lanish" bo'limini tavsiya qil.

Javob berish qoidalari:
- Xushmuomala, samimiy, dono va qisqa-lo'nda javob ber.
- Emojilardan o'rinli foydalan (✨, 🌿, 📖, 🌸, 🤲, 💡, 👤).
- O'zingni "Nur Yordamchi" deb tanishtir.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage } = await req.json();

    if (!userMessage && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: 'Xabar kiritilmadi' }, { status: 400 });
    }

    const conversation = messages || [{ role: 'user', content: userMessage }];

    // 1. Try OpenAI GPT-4o-mini first
    if (OPENAI_API_KEY) {
      try {
        const oaiMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversation.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ];

        const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: oaiMessages,
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (oaiRes.ok) {
          const data = await oaiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('OpenAI chat fallback notice:', err);
      }
    }

    // 2. Try Gemini Models fallback
    if (GEMINI_API_KEY) {
      const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const model of models) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          
          const geminiContents = [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nFoydalanuvchi savoli: ${userMessage || conversation[conversation.length - 1]?.content}` }]
            }
          ];

          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: geminiContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800
              }
            })
          });

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({ reply });
            }
          }
        } catch (geminiErr) {
          console.warn(`Gemini ${model} notice:`, geminiErr);
        }
      }
    }

    // Fallback smart reply if no keys reachable
    return NextResponse.json({
      reply: "Assalomu alaykum! NurQissa AI platformasiga xush kelibsiz! 🌟 Sizga bolalar uchun ibratli ertaklar yaratish, odob daraxti yoki kitob buyurtma qilishda yordam bera olaman. Savolingizni bemalol bering!"
    });

  } catch (error: any) {
    console.error('Support Chat API error:', error);
    return NextResponse.json({
      reply: "Assalomu alaykum! Texnik uzilish sababli xabar yetib bormadi. Iltimos, qayta urinib ko'ring yoki @nurqissaaa_bot orqali yozing."
    }, { status: 200 });
  }
}
