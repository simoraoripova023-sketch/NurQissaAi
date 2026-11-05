import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orderService';
import { CLICK_PLANS } from '@/lib/click';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(`create_order:${ip}`, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Buyurtmalar soni me'yoridan oshdi. Birozdan so'ng urinib ko'ring." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { planKey = 'pack10', userName, userPhone, provider } = body;

    // Strict validation
    const validPlanKey = (planKey === 'pack3' || planKey === 'vip') ? planKey : 'pack10';
    const plan = CLICK_PLANS[validPlanKey];

    const sanitizedUserName = typeof userName === 'string' ? userName.slice(0, 80).trim() : 'Mijoz';
    const sanitizedUserPhone = typeof userPhone === 'string' ? userPhone.slice(0, 30).trim() : '';
    const validProvider = provider === 'click' ? 'click' : 'card';

    const order = await createOrder({
      planKey: validPlanKey,
      userName: sanitizedUserName || 'Mijoz',
      userPhone: sanitizedUserPhone,
      provider: validProvider,
    });

    // Smart telegram deep-link that opens @nurqissaaa_bot with this order ID prefilled
    const telegramBotUrl = `https://t.me/nurqissaaa_bot?start=pay_${order.id}`;

    // Smart web pay URL that opens the order directly
    const directWebPayUrl = `https://nur-qissa.uz/?pay_order=${order.id}&amount=${order.amount}`;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        planKey: order.planKey,
        planName: order.planName,
        amount: order.amount,
        formattedAmount: `${Number(order.amount).toLocaleString('uz-UZ')} so'm`,
        storiesGranted: order.storiesGranted,
        status: order.status,
      },
      telegramBotUrl,
      directWebPayUrl,
      cardNumber: process.env.NEXT_PUBLIC_PAYMENT_CARD_NUMBER || "",
      cardHolder: process.env.NEXT_PUBLIC_PAYMENT_CARD_HOLDER || "",
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Buyurtma yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}
