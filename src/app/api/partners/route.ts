import { NextRequest, NextResponse } from 'next/server';

// Dummy partners data
const partners = [
  {
    id: '1',
    partner_code: 'PRT-2025-594589',
    company_name: 'TK. IWAN - CIPUTAT',
    email: 'iwan@example.com',
    status: 'active',
    total_referrals: 5,
    total_conversions: 2,
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: '2',
    partner_code: 'PRT-2025-887867',
    company_name: 'indra',
    email: 'indra@gmail.com',
    status: 'active',
    total_referrals: 3,
    total_conversions: 1,
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: '3',
    partner_code: 'PRT-2025-498546',
    company_name: 'Wilson Trading Co.',
    email: 'robert.w@gmail.com',
    status: 'active',
    total_referrals: 8,
    total_conversions: 4,
    created_at: '2025-02-01T14:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  // Filter
  let filtered = partners;
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.company_name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return NextResponse.json({
    success: true,
    data: {
      partners: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / limit),
      },
    },
  });
}
