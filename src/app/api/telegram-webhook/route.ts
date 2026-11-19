import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEB_APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.WEB_APP_URL || 'https://nurqissa.uz';

async function sendTelegramMessage(chatId: number | string, text: string, replyMarkup?: any) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const firstName = update.message.from?.first_name || 'Aziz doʻstim';

      if (text.startsWith('/start')) {
        const welcomeMessage = `✨ <b>Assalomu alaykum va rahmatullohi va barakatuh, ${firstName}!</b>\n\n` +
          `🌟 <b>NurQissa AI</b> — farzandingiz bosh qahramon bo'lgan ibratli va mehrli bolalar ertaklari platformasiga xush kelibsiz!\n\n` +
          `📖 Bu yerda siz:\n` +
          `• Farzandingiz ismiga mos maxsus 3D Pixar ertak kitoblar yaratishingiz;\n` +
          `• Oʻzbek tilidagi samimiy audio ertaklarni tinglashingiz;\n` +
          `• Montessori taʼlimiy oʻyinlari va boʻyash studiyasidan foydalanishingiz;\n` +
          `• Yaxshi amallar daraxtini birgalikda oʻstirishingiz mumkin! 🌱\n\n` +
          `👇 Quyidagi tugmani bosing va ertaklar olamiga kiring:`;

        const replyMarkup = {
          inline_keyboard: [
            [
              {
                text: '📖 NurQissa Mini App ni ochish 🚀',
                web_app: { url: WEB_APP_URL },
              },
            ],
            [
              {
                text: '✨ Yangi ertak yaratish',
                web_app: { url: `${WEB_APP_URL}/create` },
              },
              {
                text: '🎮 Taʼlimiy oʻyinlar',
                web_app: { url: `${WEB_APP_URL}/games` },
              },
            ],
            [
              {
                text: '📞 Biz bilan bogʻlanish',
                url: 'https://t.me/nurqissa_admin',
              },
            ],
          ],
        };

        await sendTelegramMessage(chatId, welcomeMessage, replyMarkup);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook processing error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'online', 
    service: 'NurQissa Telegram Webhook',
    configured: Boolean(TELEGRAM_BOT_TOKEN) 
  });
}
