import { NextRequest, NextResponse } from 'next/server';
import { handleClickPrepare, handleClickComplete } from '@/lib/clickHandler';

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
    service: 'Click Combined Webhook endpoint (nur-qissa.uz)',
    endpoints: {
      prepare: '/api/click/prepare',
      complete: '/api/click/complete',
      webhook: '/api/click/webhook',
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const action = String(body.action);

    if (action === '0') {
      const result = await handleClickPrepare(body);
      return NextResponse.json(result);
    } else if (action === '1') {
      const result = await handleClickComplete(body);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({
        error: -3,
        error_note: 'Action not found',
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Click combined webhook error:', error);
    return NextResponse.json({
      error: -8,
      error_note: error.message || 'Server error',
    }, { status: 500 });
  }
}
