import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder, verifyOrderSecret } from '@/lib/orderService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');
  const action = searchParams.get('action'); // 'approve' | 'reject'
  const sig = searchParams.get('sig');

  if (!orderId || !action || !sig) {
    return new Response('Noto\'g\'ri so\'rov parametrlari', { status: 400 });
  }

  // Cryptographic signature check
  if (!verifyOrderSecret(orderId, sig)) {
    return new Response('Ruxsat berilmadi: Xavfsizlik kaliti noto\'g\'ri!', { status: 403 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return new Response('Buyurtma topilmadi!', { status: 404 });
  }

  if (action === 'approve') {
    await updateOrder(orderId, { status: 'paid' });

    // Optional: grant in Supabase directly
    try {
      const { supabase } = await import('@/lib/supabase');
      // If order has phone/user, we can update profiles table if it exists
      if (order.userPhone) {
        await supabase
          .from('profiles')
          .update({
            has_paid_subscription: order.planKey === 'vip',
            // add credits if column exists
          })
          .eq('phone', order.userPhone);
      }
    } catch {}

    const html = `
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>To'lov Tasdiqlandi — NurQissa AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #002621; color: #FFFDF5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #023B33; border: 2px solid #58DCAB; border-radius: 24px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .icon { width: 64px; height: 64px; background: #0F5132; color: #58DCAB; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; }
          h1 { margin: 0 0 8px; font-size: 22px; color: #FFE082; }
          p { margin: 8px 0; font-size: 14px; color: #E0E7FF; line-height: 1.5; }
          .badge { display: inline-block; background: rgba(88, 220, 171, 0.2); border: 1px solid #58DCAB; color: #58DCAB; padding: 6px 14px; border-radius: 99px; font-size: 13px; font-weight: bold; margin: 12px 0; }
          .details { background: rgba(0,0,0,0.3); border-radius: 16px; padding: 16px; margin: 20px 0; text-align: left; font-size: 13px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .row:last-child { margin-bottom: 0; }
          .label { color: #A5B4FC; }
          .val { font-weight: bold; color: #FFF; }
          .btn { display: inline-block; background: #58DCAB; color: #002621; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 14px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✓</div>
          <h1>To'lov Tasdiqlandi!</h1>
          <div class="badge">Faollashtirildi: ${order.storiesGranted} ta qissa</div>
          <p>Mijozning hisobi muvaffaqiyatli to'ldirildi. Saytda kutib turgan foydalanuvchi ekrani darhol yangilanadi.</p>
          
          <div class="details">
            <div class="row"><span class="label">Buyurtma ID:</span><span class="val">${order.id}</span></div>
            <div class="row"><span class="label">Tarif:</span><span class="val">${order.planName}</span></div>
            <div class="row"><span class="label">Summa:</span><span class="val">${Number(order.amount).toLocaleString('uz-UZ')} so'm</span></div>
            <div class="row"><span class="label">Mijoz:</span><span class="val">${order.userName} (${order.userPhone})</span></div>
          </div>

          <a href="https://nur-qissa.uz" class="btn">NurQissa Saytiga O'tish</a>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (action === 'reject') {
    await updateOrder(orderId, { status: 'rejected_underpaid' });

    const html = `
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>To'lov Rad Etildi — NurQissa AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #2A0808; color: #FFFDF5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #3B1111; border: 2px solid #F87171; border-radius: 24px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .icon { width: 64px; height: 64px; background: #7F1D1D; color: #FCA5A5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; }
          h1 { margin: 0 0 8px; font-size: 22px; color: #FCA5A5; }
          p { margin: 8px 0; font-size: 14px; color: #FEE2E2; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✕</div>
          <h1>To'lov Rad Etildi!</h1>
          <p>Ushbu so'rov bekor qilindi (pul tushmagan yoki to'liq to'lanmagan).</p>
          <p>Buyurtma ID: <b>${order.id}</b></p>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response('Noma\'lum amal', { status: 400 });
}
