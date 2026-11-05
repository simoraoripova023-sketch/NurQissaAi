import { NextRequest, NextResponse } from 'next/server';
import { verifyOTPCode } from '@/lib/smsService';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Telefon raqam va tasdiqlash kodi kiritilishi shart' },
        { status: 400 }
      );
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const cleanCode = String(code).trim();

    if (!/^\d{4}$/.test(cleanCode)) {
      return NextResponse.json(
        { error: "Tasdiqlash kodi 4 xonali raqam bo'lishi shart" },
        { status: 400 }
      );
    }

    // Rate limiting / brute-force protection: max 5 attempts per 15 minutes
    const rateKey = `verify_otp:${cleanDigits}`;
    const rateCheck = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Kodni kiritish bo'yicha urinishlar soni oshdi. Iltimos, ${rateCheck.resetInSeconds} soniyadan keyin qayta urinib ko'ring.`,
        },
        { status: 429 }
      );
    }

    const verification = await verifyOTPCode(cleanDigits, cleanCode);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message },
        { status: 400 }
      );
    }

    // Reset rate limit counter on success
    resetRateLimit(rateKey);

    return NextResponse.json({
      success: true,
      message: verification.message,
    });
  } catch (error: any) {
    console.error('Verify SMS error:', error);
    return NextResponse.json(
      { error: error?.message || 'Kodni tasdiqlashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
