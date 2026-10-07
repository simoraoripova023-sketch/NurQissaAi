const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID;

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

  // Sync with Supabase for persistent serverless reliability
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('otps').upsert([
      { phone: cleanPhone, code, expires_at: expiresAt },
      { phone: fullPhone, code, expires_at: expiresAt },
    ]);
  } catch {}

  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('feedbacks').insert([
      { type: 'otp', contact: cleanPhone, name: code, message: expiresAt.toString() },
      { type: 'otp', contact: fullPhone, name: code, message: expiresAt.toString() },
    ]);
  } catch {}

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

  // 2. Deliver code to Telegram Bot (if configured)
  if (BOT_TOKEN && ADMIN_CHAT_ID) {
    try {
      const tgMessage = (
        `🔐 <b>[NURQISSA AI — SMS KOD]</b>\n\n` +
        `👤 <b>Foydalanuvchi:</b> ${parentName || "Ota-ona"}\n` +
        `📞 <b>Telefon raqami:</b> <code>${displayPhone}</code>\n` +
        `🔑 <b>Tasdiqlash kodi:</b> <code>${code}</code>\n` +
        `⏳ <b>Amal qilish muddati:</b> 5 daqiqa\n` +
        `🌐 <b>Eskiz holati:</b> ${sentViaEskiz ? 'Yuborildi ✅' : eskizError ? `Xato: ${eskizError}` : "Telegram orqali yetkazildi 📲"}`
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
  }

  return {
    success: true,
    sentViaEskiz,
    displayPhone,
    code,
  };
}

/**
 * Validates the entered OTP code (checks in-memory store and Supabase database)
 */
export async function verifyOTPCode(phoneDigits: string, inputCode: string): Promise<{ valid: boolean; message: string }> {
  const cleanPhone = phoneDigits.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('998') ? cleanPhone : `998${cleanPhone}`;

  // Master demo code for development testing only
  if (process.env.NODE_ENV !== 'production' && inputCode === '7777') {
    return { valid: true, message: "Kod tasdiqlandi!" };
  }

  let stored = otpStore.get(cleanPhone) || otpStore.get(fullPhone);

  // If not found in memory (e.g. serverless cold start), check Supabase primary table
  if (!stored) {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data } = await supabase
        .from('otps')
        .select('*')
        .or(`phone.eq.${cleanPhone},phone.eq.${fullPhone}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.code && data.expires_at) {
        stored = { code: data.code, expiresAt: Number(data.expires_at) };
      }
    } catch {}
  }

  // Fallback to feedbacks audit storage if otps table is unavailable
  if (!stored) {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('type', 'otp')
        .or(`contact.eq.${cleanPhone},contact.eq.${fullPhone}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.name && data.message) {
        stored = { code: data.name, expiresAt: Number(data.message) };
      }
    } catch {}
  }

  if (!stored) {
    return { valid: false, message: "Tasdiqlash kodi topilmadi yoki muddati o'tgan. Iltimos, qayta kod so'rang." };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanPhone);
    otpStore.delete(fullPhone);
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('otps').delete().or(`phone.eq.${cleanPhone},phone.eq.${fullPhone}`);
    } catch {}
    return { valid: false, message: "Kodni amal qilish muddati (5 daqiqa) tugagan. Yangi kod so'rang." };
  }

  if (stored.code.trim() !== inputCode.trim()) {
    return { valid: false, message: "Noto'g'ri kod kiritildi. Iltimos, tekshirib qayta kiriting." };
  }

  // Clear upon successful verification
  otpStore.delete(cleanPhone);
  otpStore.delete(fullPhone);
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('otps').delete().or(`phone.eq.${cleanPhone},phone.eq.${fullPhone}`);
  } catch {}
  return { valid: true, message: "Telefon raqamingiz muvaffaqiyatli tasdiqlandi!" };
}
