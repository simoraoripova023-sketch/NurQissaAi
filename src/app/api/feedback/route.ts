import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';
const FEEDBACKS_FILE = path.join(process.cwd(), 'data', 'feedbacks.json');
const ADMIN_ID_FILE = path.join(process.cwd(), 'data', 'admin_chats.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = 'taklif', name, contact, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Xabar matni kiritilishi shart' }, { status: 400 });
    }

    const newFeedback = {
      id: `fb_${Date.now()}`,
      type: type, // 'taklif' | 'shikoyat' | 'savol'
      name: name || 'Anonim',
      contact: contact || "Ko'rsatilmadi",
      message: message.trim(),
      created_at: new Date().toISOString()
    };

    // 1. Save to data/feedbacks.json
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
    let feedbacks = [];
    if (fs.existsSync(FEEDBACKS_FILE)) {
      try {
        feedbacks = JSON.parse(fs.readFileSync(FEEDBACKS_FILE, 'utf-8'));
      } catch {
        feedbacks = [];
      }
    }
    feedbacks.unshift(newFeedback);
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');

    // 2. Format notification for Telegram
    const emojiMap: Record<string, string> = {
      taklif: '💡 YANGI TAKLIF',
      shikoyat: '⚠️ YANGI SHIKOYAT / MUAMMO',
      savol: '❓ YANGI SAVOL / MUROJAAT'
    };

    const typeTitle = emojiMap[type] || '📩 YANGI MUROJAAT';

    const tgMessage = (
      `<b>${typeTitle} (NurQissa AI)</b>\n\n` +
      `👤 <b>Kimdan:</b> ${newFeedback.name}\n` +
      `📞 <b>Aloqa:</b> ${newFeedback.contact}\n` +
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
      `📝 <b>Matn:</b>\n<i>${newFeedback.message}</i>`
    );

    // 3. Send EXCLUSIVELY to owner's personal chat ID
    const ownerId = process.env.ADMIN_TELEGRAM_ID || '5636799086';
    const adminChats = [ownerId];

    for (const chatId of adminChats) {
      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgMessage,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.error('Error forwarding to admin chatId', chatId, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Taklif va shikoyatingiz qabul qilindi!",
      feedback: newFeedback 
    });

  } catch (error: any) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(FEEDBACKS_FILE)) {
      const data = JSON.parse(fs.readFileSync(FEEDBACKS_FILE, 'utf-8'));
      return NextResponse.json({ feedbacks: data });
    }
    return NextResponse.json({ feedbacks: [] });
  } catch (e: any) {
    return NextResponse.json({ feedbacks: [] });
  }
}
