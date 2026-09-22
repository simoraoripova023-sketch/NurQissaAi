import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID;
const FEEDBACKS_FILE = path.join(process.cwd(), 'data', 'feedbacks.json');

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

    // 1. Save to Supabase (if table exists)
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('feedbacks').insert([{
        type: newFeedback.type,
        name: newFeedback.name,
        contact: newFeedback.contact,
        message: newFeedback.message,
        created_at: newFeedback.created_at
      }]);
    } catch (dbErr) {
      console.warn('Supabase feedback insert notice:', dbErr);
    }

    // 2. Safe local backup (only when filesystem is writable)
    try {
      if (fs && typeof fs.mkdirSync === 'function') {
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
      }
    } catch {
      // Serverless environments like Vercel have read-only filesystem, which is normal
    }

    const emojiMap: Record<string, string> = {
      taklif: '💡 YANGI TAKLIF',
      shikoyat: '⚠️ YANGI SHIKOYAT / MUAMMO',
      savol: '❓ YANGI SAVOL / MUROJAAT',
      asoschi: '👑 ASOSCHI / RAHBARIYATGA SHAXSIY MUROJAAT',
      buyurtma: '📚 YANGI KITOB BUYURTMASI (QATTIQ MUQOVA)'
    };

    const typeTitle = emojiMap[type] || '📩 YANGI MUROJAAT';

    const tgMessage = (
      `<b>${typeTitle} (NurQissa AI)</b>\n\n` +
      `👤 <b>Kimdan:</b> ${newFeedback.name}\n` +
      `📞 <b>Aloqa:</b> ${newFeedback.contact}\n` +
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
      `📝 <b>Matn:</b>\n<i>${newFeedback.message}</i>`
    );

    // 4. Send notification to owner/admin if configured
    if (BOT_TOKEN && ADMIN_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: tgMessage,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.error('Error forwarding feedback to Telegram:', err);
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
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(20);
    if (data && data.length > 0) {
      return NextResponse.json({ feedbacks: data });
    }
  } catch (dbErr) {
    console.warn('Supabase fetch notice:', dbErr);
  }

  try {
    if (fs.existsSync(FEEDBACKS_FILE)) {
      const data = JSON.parse(fs.readFileSync(FEEDBACKS_FILE, 'utf-8'));
      return NextResponse.json({ feedbacks: data });
    }
    return NextResponse.json({ feedbacks: [] });
  } catch {
    return NextResponse.json({ feedbacks: [] });
  }
}
