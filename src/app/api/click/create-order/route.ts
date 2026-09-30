import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orderService';
import { generateClickPaymentUrl, CLICK_CONFIG, CLICK_PLANS } from '@/lib/click';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Click Merchant Order Creator (nur-qissa.uz)',
    plans: CLICK_PLANS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planKey = 'pack10', userName, userPhone } = body;

    const plan = CLICK_PLANS[planKey] || CLICK_PLANS.pack10;
    const order = await createOrder({
      planKey: plan.id,
      userName,
      userPhone,
    });

    if (!CLICK_CONFIG.isConfigured) {
      return NextResponse.json({
        success: false,
        error: "Click Merchant hisobi hali ulanmagan. Iltimos, Simora Oripova kartasiga to'g'ridan-to'g'ri to'lov qiling.",
        isConfigured: false,
        order,
      }, { status: 400 });
    }

    const paymentUrl = generateClickPaymentUrl({
      amount: order.amount,
      orderId: order.id,
      returnUrl: `https://nur-qissa.uz/?payment=success&order_id=${order.id}`,
    });

    return NextResponse.json({
      success: true,
      order,
      paymentUrl,
      isSandbox: CLICK_CONFIG.isSandbox,
      serviceId: CLICK_CONFIG.serviceId,
      merchantId: CLICK_CONFIG.merchantId,
    });
  } catch (error: any) {
    console.error('Error creating Click order:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
