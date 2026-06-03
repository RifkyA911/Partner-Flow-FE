import { NextRequest, NextResponse } from 'next/server';

// Dummy data storage (in real app, use database)
const users = [
  {
    id: '1',
    email: 'admin@partnerflow.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'partner@example.com',
    password: 'partner123',
    name: 'TK. IWAN - CIPUTAT',
    role: 'partner',
    partner_code: 'PRT-2025-594589',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
          },
        },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials',
          },
        },
        { status: 401 }
      );
    }

    // Return user data (in real app, set session cookie)
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          partner_code: user.partner_code,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Server error',
        },
      },
      { status: 500 }
    );
  }
}
