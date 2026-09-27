import { NextRequest, NextResponse } from 'next/server';
import { handleClickComplete } from '@/lib/clickHandler';

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await req.json();
  }
  const formData = await req.formData();
  const obj: Record<string, any> = {};
  formData.forEach((val, key) => {
    obj[key] = val;
  });
  return obj;
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const result = await handleClickComplete(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Click complete endpoint error:', error);
    return NextResponse.json({
      error: -8,
      error_note: error.message || 'Server error',
    }, { status: 500 });
  }
}
