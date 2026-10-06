import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder, generateOrderSecret } from '@/lib/orderService';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID || '5636799086';
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://nur-qissa.uz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, userName, userPhone, receiptNote, provider = 'card' } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Buyurtma ID si kiritilmadi' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Bunday buyurtma topilmadi' }, { status: 404 });
    }

    // Anti-fraud: cannot submit on already paid or cancelled orders
    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        message: "Ushbu buyurtma allaqachon tasdiqlangan va to'langan!",
      });
    }

    // Update order state
    const updated = await updateOrder(orderId, {
      status: 'verifying',
      userName: userName?.trim() || order.userName,
      userPhone: userPhone?.trim() || order.userPhone,
      provider,
      receiptNote: receiptNote?.trim() || "Mijoz to'lov chekini tasdiqlash uchun yubordi",
    });

    // Generate cryptographic secret token for 1-click owner action
    const sig = generateOrderSecret(order.id);
    const approveUrl = `${DOMAIN}/api/payment/admin-action?orderId=${encodeURIComponent(order.id)}&action=approve&sig=${sig}`;
    const rejectUrl = `${DOMAIN}/api/payment/admin-action?orderId=${encodeURIComponent(order.id)}&action=reject&sig=${sig}`;

    // Provider icon
    const providerEmoji: Record<string, string> = {
      click: '🔵 Click ilovasi',
      uzum: '🟣 Uzum Bank (5% Keshbek)',
      paynet: '🟢 Paynet / QR',
      card: '💳 Bank Kartasi',
    };

    const tgMessage = (
      `🚨 <b>YANGI TO'LOV KELIB TUSHDI! (NurQissa AI)</b>\n\n` +
      `🆔 <b>Buyurtma kodi:</b> <code>${order.id}</code>\n` +
      `📦 <b>Tarif:</b> <b>${order.planName}</b>\n` +
      `💰 <b>Kutilayotgan summa:</b> <code>${Number(order.amount).toLocaleString('uz-UZ')} so'm</code>\n` +
      `🎁 <b>Beriladigan ertaklar:</b> <b>${order.storiesGranted} ta qissa</b>\n` +
      `🏦 <b>To'lov usuli:</b> ${providerEmoji[provider] || provider}\n` +
      `🏢 <b>Hisob egasi:</b> Simora Oripova (AO PAYNET • Rasmiy Milliy QR)\n\n` +
      `👤 <b>Mijoz:</b> ${userName || order.userName}\n` +
      `📞 <b>Telefon raqami:</b> <code>${userPhone || order.userPhone}</code>\n` +
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
      `📝 <b>Chek / Izoh:</b>\n<i>${receiptNote || "Mijoz to'lovni bajarganini bildirdi"}</i>\n\n` +
      `🛡️ <b>FIRIBGARLIKDAN HIMOYA:</b>\n` +
      `Mijoz faqat o'zi tanlagan <b>${order.planName}</b> (${order.storiesGranted} ta qissa) uchun so'rov yuborgan. Kam to'lab qimmatroq tarifni ololmaydi!\n\n` +
      `👇 <i>Paynet hisobingizga to'lov kelgan bo'lsa, quyidagi tugmani bosib 1 soniyada tasdiqlang:</i>`
    );

    // Send to Telegram with 1-click inline buttons
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: tgMessage,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: `✅ 1-bosishda Tasdiqlash (${Number(order.amount).toLocaleString('uz-UZ')} so'm)`, url: approveUrl },
              ],
              [
                { text: '❌ Rad etish (Pul tushmagan / Soxta)', url: rejectUrl },
              ]
            ]
          }
        }),
      });
    } catch (tgErr) {
      console.error('Failed to notify Telegram bot:', tgErr);
    }

    return NextResponse.json({
      success: true,
      order: updated,
      message: "To'lov cheki qabul qilindi va tekshiruvga yuborildi.",
    });
  } catch (error: any) {
    console.error('Error submitting receipt:', error);
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
