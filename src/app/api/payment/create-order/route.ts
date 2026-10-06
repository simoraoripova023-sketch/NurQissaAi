import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orderService';
import { CLICK_PLANS } from '@/lib/click';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planKey = 'pack10', userName, userPhone, provider } = body;

    // Strict validation
    const validPlanKey = (planKey === 'pack3' || planKey === 'vip') ? planKey : 'pack10';
    const plan = CLICK_PLANS[validPlanKey];

    const order = await createOrder({
      planKey: validPlanKey,
      userName: userName || 'Mijoz',
      userPhone: userPhone || '',
      provider: provider || 'card',
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
      // Dedicated card
      cardNumber: process.env.NEXT_PUBLIC_PAYMENT_CARD_NUMBER || "9860 0803 1682 3584",
      cardHolder: process.env.NEXT_PUBLIC_PAYMENT_CARD_HOLDER || "Simora Oripova",
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Buyurtma yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}
