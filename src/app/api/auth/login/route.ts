import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from '@/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Server error' },
      },
      { status: 500 },
    );
  }
}
