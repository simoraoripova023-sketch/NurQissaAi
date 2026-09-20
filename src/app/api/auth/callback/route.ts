import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const redirectUrl = new URL('/auth/callback', origin);
  if (code) redirectUrl.searchParams.set('code', code);
  if (error) redirectUrl.searchParams.set('error', error);
  if (errorDescription) redirectUrl.searchParams.set('error_description', errorDescription);

  return NextResponse.redirect(redirectUrl.toString());
}
