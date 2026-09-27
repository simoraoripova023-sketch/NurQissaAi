import { NextRequest, NextResponse } from 'next/server';
import { handleClickPrepare } from '@/lib/clickHandler';

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

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Click Prepare Webhook endpoint (nur-qissa.uz)',
    action: 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const result = await handleClickPrepare(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Click prepare endpoint error:', error);
    return NextResponse.json({
      error: -8,
      error_note: error.message || 'Server error',
    }, { status: 500 });
  }
}
