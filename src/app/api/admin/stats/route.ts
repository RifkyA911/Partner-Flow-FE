import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Dummy stats data
  const stats = {
    total_partners: 28,
    active_partners: 25,
    total_referrals: 150,
    pending_referrals: 12,
    total_conversions: 45,
    total_commission_paid: 2250000,
    total_commission_pending: 600000,
    recent_activities: [
      {
        id: '1',
        action: 'new_referral',
        description: 'TOKO MAKMUR mereferensikan Artha',
        created_at: '2025-03-01T08:00:00Z',
      },
      {
        id: '2',
        action: 'conversion',
        description: 'artha berhasil dikonversi menjadi partner',
        created_at: '2025-02-28T14:30:00Z',
      },
      {
        id: '3',
        action: 'signup',
        description: 'Partner baru terdaftar: Wilson Trading Co.',
        created_at: '2025-02-27T10:15:00Z',
      },
    ],
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
}
