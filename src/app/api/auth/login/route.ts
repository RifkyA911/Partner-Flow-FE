import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from '@/config';

// Demo accounts for testing
const demoAccounts = [
  {
    email: 'partner@example.com',
    password: 'partner123',
    id: 'demo-partner-1',
    name: 'Partner Demo',
    role: 'partner',
    partner_code: 'PRT-DEMO-001',
  },
  {
    email: 'admin@partnerflow.com',
    password: 'admin123',
    id: 'demo-admin-1',
    name: 'Admin Demo',
    role: 'admin',
    partner_code: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if it's a demo account
    const demoAccount = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (demoAccount) {
      return NextResponse.json({
        success: true,
        data: {
          user: demoAccount,
        },
      });
    }

    // Otherwise, forward to backend API
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
