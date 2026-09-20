import { NextRequest, NextResponse } from 'next/server';
import { verifyOTPCode } from '@/lib/smsService';

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
    const verification = verifyOTPCode(cleanDigits, code);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message },
        { status: 400 }
      );
    }

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
