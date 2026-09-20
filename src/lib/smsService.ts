// SMS Service for Uzbekistan phone verification (Eskiz.uz gateway & Telegram Bot delivery)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID || '5636799086';

// Global OTP store for server runtime (keyed by clean 9-digit or full phone)
declare global {
  // eslint-disable-next-line no-var
  var __nurqissa_otp_store: Map<string, { code: string; expiresAt: number }> | undefined;
}

const otpStore = globalThis.__nurqissa_otp_store ?? new Map<string, { code: string; expiresAt: number }>();
globalThis.__nurqissa_otp_store = otpStore;

/**
 * Generates a random 4-digit numeric verification code
 */
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Sends OTP verification code via Eskiz (if configured) & Telegram notification
 */
export async function sendSMSVerification(phoneDigits: string, code: string, parentName?: string) {
  const cleanPhone = phoneDigits.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('998') ? cleanPhone : `998${cleanPhone}`;
  const displayPhone = `+998 (${cleanPhone.slice(-9, -7)}) ${cleanPhone.slice(-7, -4)}-${cleanPhone.slice(-4, -2)}-${cleanPhone.slice(-2)}`;

  // Store in memory for 5 minutes
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(cleanPhone, { code, expiresAt });
  otpStore.set(fullPhone, { code, expiresAt });

  let sentViaEskiz = false;
  let eskizError: string | null = null;

  // 1. Send via Eskiz SMS Gateway if credentials exist
  const eskizEmail = process.env.ESKIZ_EMAIL;
  const eskizPassword = process.env.ESKIZ_PASSWORD;

  if (eskizEmail && eskizPassword) {
    try {
      // Login to Eskiz to get token
      const authRes = await fetch('https://notify.eskiz.uz/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: eskizEmail, password: eskizPassword }),
      });
      const authData = await authRes.json();
      const token = authData?.data?.token;

      if (token) {
        const smsRes = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobile_phone: fullPhone,
            message: `NurQissa AI: Tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`,
            from: '4546',
          }),
        });
        const smsData = await smsRes.json();
        if (smsData?.status === 'waiting' || smsData?.id) {
          sentViaEskiz = true;
        } else {
          eskizError = smsData?.message || 'Eskiz SMS error';
        }
      }
    } catch (err: any) {
      eskizError = err?.message || 'Eskiz connection failed';
    }
  }

  // 2. Deliver code to Telegram Bot (instant real-time delivery to Owner/Admin)
  try {
    const tgMessage = (
      `🔐 <b>[NURQISSA AI — SMS KOD]</b>\n\n` +
      `👤 <b>Foydalanuvchi:</b> ${parentName || "Ota-ona"}\n` +
      `📞 <b>Telefon raqami:</b> <code>${displayPhone}</code>\n` +
      `🔑 <b>Tasdiqlash kodi:</b> <code>${code}</code>\n` +
      `⏳ <b>Amal qilish muddati:</b> 5 daqiqa\n` +
      `🌐 <b>Eskiz holati:</b> ${sentViaEskiz ? 'Yuborildi ✅' : eskizError ? `Xato: ${eskizError}` : "Demo rejim (Telegram orqali yetkazildi) 📲"}`
    );

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: tgMessage,
        parse_mode: 'HTML',
      }),
    });
  } catch (tgErr) {
    console.warn('Telegram OTP notification error:', tgErr);
  }

  return {
    success: true,
    sentViaEskiz,
    displayPhone,
    code, // Returned for instant UI feedback / demo / test verification
  };
}

/**
 * Validates the entered OTP code
 */
export function verifyOTPCode(phoneDigits: string, inputCode: string): { valid: boolean; message: string } {
  const cleanPhone = phoneDigits.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('998') ? cleanPhone : `998${cleanPhone}`;

  // Master demo code for testing
  if (inputCode === '7777') {
    return { valid: true, message: "Kod tasdiqlandi!" };
  }

  const stored = otpStore.get(cleanPhone) || otpStore.get(fullPhone);
  if (!stored) {
    return { valid: false, message: "Tasdiqlash kodi topilmadi yoki muddati o'tgan. Iltimos, qayta kod so'rang." };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanPhone);
    otpStore.delete(fullPhone);
    return { valid: false, message: "Kodni amal qilish muddati (5 daqiqa) tugagan. Yangi kod so'rang." };
  }

  if (stored.code.trim() !== inputCode.trim()) {
    return { valid: false, message: "Noto'g'ri kod kiritildi. Iltimos, tekshirib qayta kiriting." };
  }

  // Clear upon successful verification
  otpStore.delete(cleanPhone);
  otpStore.delete(fullPhone);
  return { valid: true, message: "Telefon raqamingiz muvaffaqiyatli tasdiqlandi!" };
}
