import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orderService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId talab qilinadi' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    // Only return public verification fields
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status, // 'pending' | 'prepared' | 'paid' | 'cancelled' | 'rejected_underpaid'
        planKey: order.planKey,
        planName: order.planName,
        amount: order.amount,
        isPaid: order.status === 'paid',
      },
    });
  } catch (error: any) {
    console.error('Check order API error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
