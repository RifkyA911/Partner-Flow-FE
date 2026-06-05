import { NextRequest, NextResponse } from 'next/server';

// Dummy referrals data
const referrals = [
  {
    id: '1',
    referral_code: 'REF-2025-123456',
    partner: {
      id: '1',
      company_name: 'TK. IWAN - CIPUTAT',
    },
    referred_name: 'artha',
    referred_phone: '08123456789',
    status: 'pending',
    commission: 50000,
    created_at: '2025-02-01T10:00:00Z',
    converted_at: null,
  },
  {
    id: '2',
    referral_code: 'REF-2025-789012',
    partner: {
      id: '2',
      company_name: 'indra',
    },
    referred_name: 'Jane Doe',
    referred_phone: '+1 (555) 777-6666',
    status: 'pending',
    commission: 50000,
    created_at: '2025-02-15T14:00:00Z',
    converted_at: null,
  },
  {
    id: '3',
    referral_code: 'REF-2025-345678',
    partner: {
      id: '3',
      company_name: 'Wilson Trading Co.',
    },
    referred_name: 'Sarah Wilson',
    referred_phone: '+62987654321',
    status: 'pending',
    commission: 50000,
    created_at: '2025-02-20T09:00:00Z',
    converted_at: null,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || '';
  const partner_id = searchParams.get('partner_id') || '';

  // Filter
  let filtered = referrals;
  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (partner_id) {
    filtered = filtered.filter((r) => r.partner.id === partner_id);
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return NextResponse.json({
    success: true,
    data: {
      referrals: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / limit),
      },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referred_name, referred_phone, notes } = body;

    // Validation
    if (!referred_name || !referred_phone) {
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

    // Generate referral code
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const referral_code = `REF-${year}-${randomNum}`;

    // Create new referral
    const newReferral = {
      id: String(referrals.length + 1),
      referral_code,
      partner: {
        id: '1', // In real app, get from session
        company_name: 'TK. IWAN - CIPUTAT',
      },
      referred_name,
      referred_phone,
      status: 'pending',
      commission: 50000,
      created_at: new Date().toISOString(),
      converted_at: null,
    };

    referrals.push(newReferral);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newReferral.id,
          referral_code: newReferral.referral_code,
          status: newReferral.status,
          share_link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/register?ref=${referral_code}`,
        },
      },
      { status: 201 }
    );
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
