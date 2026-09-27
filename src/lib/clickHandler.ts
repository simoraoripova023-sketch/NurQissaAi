import { NextRequest, NextResponse } from 'next/server';
import { 
  CLICK_CONFIG, 
  CLICK_ERROR, 
  verifyClickPrepareSignature, 
  verifyClickCompleteSignature 
} from './click';
import { getOrder, updateOrder } from './orderService';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID || '5636799086';

async function sendTelegramAlert(text: string) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

/**
 * Handle Click Prepare (Action = 0)
 */
export async function handleClickPrepare(params: {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id?: string;
  merchant_trans_id: string;
  amount: string | number;
  action: string | number;
  error: string | number;
  error_note?: string;
  sign_time: string;
  sign_string: string;
  isSimulated?: boolean;
}) {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    error,
    sign_time,
    sign_string,
    isSimulated = false,
  } = params;

  // 1. Signature check (skip if simulation with explicit bypass)
  if (!isSimulated && !verifyClickPrepareSignature({
    clickTransId: click_trans_id,
    serviceId: service_id,
    merchantTransId: merchant_trans_id,
    amount,
    action,
    signTime: sign_time,
    signString: sign_string,
  })) {
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: CLICK_ERROR.SIGN_CHECK_FAILED,
      error_note: 'SIGN CHECK FAILED!',
    };
  }

  // 2. Order existence check
  const order = await getOrder(merchant_trans_id);
  if (!order) {
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: CLICK_ERROR.TRANSACTION_NOT_FOUND,
      error_note: 'Buyurtma topilmadi',
    };
  }

  // 3. Already paid check
  if (order.status === 'paid') {
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: CLICK_ERROR.ALREADY_PAID,
      error_note: 'Ushbu buyurtma uchun avval to\'lov amalga oshirilgan',
    };
  }

  // 4. CRITICAL UNDERPAYMENT & AMOUNT CHECK
  const paidAmount = Number(amount);
  const expectedAmount = Number(order.amount);

  if (paidAmount < expectedAmount) {
    // Underpayment detected! Reject and alert admin bot!
    await updateOrder(order.id, {
      status: 'rejected_underpaid',
      clickTransId: click_trans_id,
    });

    await sendTelegramAlert(
      `🚨 <b>CLICK TO'LOV BLOKLANDI — KAM TO'LASH ANIQLANDI!</b>\n\n` +
      `❌ <b>Holat:</b> Mijoz belgilangan summadan KAM to'lashga urindi!\n` +
      `💰 <b>Kutilgan summa:</b> <code>${expectedAmount.toLocaleString('uz-UZ')} so'm</code>\n` +
      `⚠️ <b>Click yuborgan summa:</b> <code>${paidAmount.toLocaleString('uz-UZ')} so'm</code>\n` +
      `📦 <b>Tarif:</b> ${order.planName}\n` +
      `🆔 <b>Buyurtma ID:</b> <code>${order.id}</code>\n` +
      `👤 <b>Mijoz:</b> ${order.userName} (${order.userPhone})\n\n` +
      `🛑 <b>QAROR:</b> Click tranzaksiyasi (Action 0) avtomatik rad etildi. Obuna faollashtirilmadi!`
    );

    return {
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: null,
      error: CLICK_ERROR.INCORRECT_AMOUNT,
      error_note: `Noto'g'ri to'lov summasi. Kutilgan summa: ${expectedAmount} so'm`,
    };
  }

  // 5. Update order to prepared
  await updateOrder(order.id, {
    status: 'prepared',
    clickTransId: click_trans_id,
  });

  return {
    click_trans_id,
    merchant_trans_id,
    merchant_prepare_id: order.id,
    error: CLICK_ERROR.SUCCESS,
    error_note: 'Success',
  };
}

/**
 * Handle Click Complete (Action = 1)
 */
export async function handleClickComplete(params: {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id?: string;
  merchant_trans_id: string;
  merchant_prepare_id: string;
  amount: string | number;
  action: string | number;
  error: string | number;
  error_note?: string;
  sign_time: string;
  sign_string: string;
  isSimulated?: boolean;
}) {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    merchant_prepare_id,
    amount,
    action,
    error,
    sign_time,
    sign_string,
    isSimulated = false,
  } = params;

  // 1. Signature check
  if (!isSimulated && !verifyClickCompleteSignature({
    clickTransId: click_trans_id,
    serviceId: service_id,
    merchantTransId: merchant_trans_id,
    merchantPrepareId: merchant_prepare_id,
    amount,
    action,
    signTime: sign_time,
    signString: sign_string,
  })) {
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: null,
      error: CLICK_ERROR.SIGN_CHECK_FAILED,
      error_note: 'SIGN CHECK FAILED!',
    };
  }

  const order = await getOrder(merchant_trans_id);
  if (!order) {
    return {
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: null,
      error: CLICK_ERROR.TRANSACTION_NOT_FOUND,
      error_note: 'Buyurtma topilmadi',
    };
  }

  // 2. Click reported error or cancellation (error < 0)
  if (Number(error) < 0) {
    await updateOrder(order.id, {
      status: 'cancelled',
      clickTransId: click_trans_id,
    });

    await sendTelegramAlert(
      `⚠️ <b>CLICK TO'LOVI BEKOR QILINDI (NurQissa AI)</b>\n\n` +
      `🆔 <b>Buyurtma ID:</b> <code>${order.id}</code>\n` +
      `📦 <b>Tarif:</b> ${order.planName}\n` +
      `👤 <b>Mijoz:</b> ${order.userName} (${order.userPhone})\n` +
      `❌ <b>Xatolik kodi:</b> ${error}`
    );

    return {
      click_trans_id,
      merchant_trans_id,
      error: CLICK_ERROR.TRANSACTION_CANCELLED,
      error_note: 'Transaction cancelled',
    };
  }

  // 3. Successful payment completion!
  await updateOrder(order.id, {
    status: 'paid',
    clickTransId: click_trans_id,
  });

  // Notify Owner via Telegram Bot
  await sendTelegramAlert(
    `🎉 <b>CLICK TO'LOVI MUVAFFAQIYATLI QABUL QILINDI! (NurQissa AI)</b>\n\n` +
    `💰 <b>Summa:</b> <code>${Number(order.amount).toLocaleString('uz-UZ')} so'm</code>\n` +
    `📦 <b>Tarif:</b> <b>${order.planName}</b>\n` +
    `🆔 <b>Buyurtma ID:</b> <code>${order.id}</code>\n` +
    `💳 <b>Click Trans ID:</b> <code>${click_trans_id}</code>\n` +
    `👤 <b>Mijoz:</b> ${order.userName}\n` +
    `📞 <b>Telefon:</b> ${order.userPhone}\n` +
    `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
    `✅ <b>NATIJA:</b> To'lov 100% rasmiy tasdiqlandi. Foydalanuvchi hisobiga ertaklar taqdim etildi!`
  );

  return {
    click_trans_id,
    merchant_trans_id,
    merchant_confirm_id: order.id,
    error: CLICK_ERROR.SUCCESS,
    error_note: 'Success',
  };
}
