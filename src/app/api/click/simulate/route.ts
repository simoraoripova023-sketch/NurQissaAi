import { NextRequest, NextResponse } from 'next/server';
import { handleClickPrepare, handleClickComplete } from '@/lib/clickHandler';
import { getOrder } from '@/lib/orderService';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Click Sandbox Simulator endpoint (nur-qissa.uz)',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, simulateType = 'success', customAmount } = body;

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    const clickTransId = `click_sim_${Date.now()}`;
    const serviceId = '32849';
    const signTime = new Date().toISOString();

    if (simulateType === 'underpaid') {
      // Simulate underpayment: send e.g. 15,000 UZS instead of expected amount
      const underpaidAmount = customAmount || Math.floor(order.amount / 2);
      const prepareResult = await handleClickPrepare({
        click_trans_id: clickTransId,
        service_id: serviceId,
        merchant_trans_id: order.id,
        amount: underpaidAmount,
        action: 0,
        error: 0,
        sign_time: signTime,
        sign_string: 'SIMULATED_BYPASS',
        isSimulated: true,
      });

      return NextResponse.json({
        success: false,
        scenario: 'underpaid_rejected',
        expectedAmount: order.amount,
        simulatedAmount: underpaidAmount,
        prepareResult,
        message: "Kam to'lash muvaffaqiyatli aniqlandi va tizim tomonidan rad etildi! Botga ogohlantirish yuborildi.",
      });
    }

    // Simulate Success:
    // 1. Prepare
    const prepareResult = await handleClickPrepare({
      click_trans_id: clickTransId,
      service_id: serviceId,
      merchant_trans_id: order.id,
      amount: order.amount,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: 'SIMULATED_BYPASS',
      isSimulated: true,
    });

    if (prepareResult.error !== 0) {
      return NextResponse.json({ success: false, error: prepareResult }, { status: 400 });
    }

    // 2. Complete
    const completeResult = await handleClickComplete({
      click_trans_id: clickTransId,
      service_id: serviceId,
      merchant_trans_id: order.id,
      merchant_prepare_id: order.id,
      amount: order.amount,
      action: 1,
      error: 0,
      sign_time: signTime,
      sign_string: 'SIMULATED_BYPASS',
      isSimulated: true,
    });

    return NextResponse.json({
      success: true,
      scenario: 'success',
      orderId: order.id,
      amount: order.amount,
      completeResult,
      message: "Click orqali to'lov muvaffaqiyatli tasdiqlandi va Telegram botga hisobot yetkazildi!",
    });
  } catch (error: any) {
    console.error('Click simulation error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
