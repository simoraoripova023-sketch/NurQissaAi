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

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status, // 'pending' | 'verifying' | 'paid' | 'rejected_underpaid'
        planKey: order.planKey,
        planName: order.planName,
        amount: order.amount,
        storiesGranted: order.storiesGranted,
        isPaid: order.status === 'paid',
        isRejected: order.status === 'rejected_underpaid',
      },
    });
  } catch (error: any) {
    console.error('Check payment status error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
