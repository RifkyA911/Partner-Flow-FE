import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from '@/config';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({
      success: true,
      data: { valid: false, code: '', message: 'No referral code' },
    });
  }

  try {
    const res = await fetch(
      `${baseUrl}/api/referrals/validate?code=${encodeURIComponent(code)}`,
      { next: { revalidate: 0 } },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Validation service unavailable' },
      { status: 500 },
    );
  }
}
