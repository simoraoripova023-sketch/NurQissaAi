import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, sendSMSVerification } from '@/lib/smsService';
import { isUzbekPhoneValid } from '@/lib/phoneHelper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Telefon raqam kiritilishi shart' },
        { status: 400 }
      );
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const nineDigits = cleanDigits.startsWith('998') ? cleanDigits.slice(3) : cleanDigits;

    if (!isUzbekPhoneValid(nineDigits)) {
      return NextResponse.json(
        { error: "Telefon raqam 9 xonali bo'lishi shart (masalan: 90 123 45 67)" },
        { status: 400 }
      );
    }

    const otpCode = generateOTP();
    const result = await sendSMSVerification(nineDigits, otpCode, name);

    return NextResponse.json({
      success: true,
      message: "Tasdiqlash kodi telefon raqamingizga yuborildi!",
      displayPhone: result.displayPhone,
      demoCode: result.code, // Useful for smooth user onboarding & demo environments
      sentViaEskiz: result.sentViaEskiz,
    });
  } catch (error: any) {
    console.error('Send SMS error:', error);
    return NextResponse.json(
      { error: error?.message || 'SMS yuborishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
