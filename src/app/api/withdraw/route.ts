import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { baseUrl } from '@/config';

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { amount } = body;

		// Validate amount
		if (!amount || amount <= 0) {
			return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
		}

		// Call backend API to create withdrawal request
		const res = await fetch(`${baseUrl}/api/withdrawals`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: session.user.id,
				amount,
				partner_code: session.user.partner_code,
			}),
		});

		const data = await res.json();

		if (data.success) {
			return NextResponse.json({ success: true, data: data.data });
		} else {
			return NextResponse.json({ success: false, error: data.error || 'Withdrawal failed' }, { status: 400 });
		}
	} catch (error) {
		console.error('Withdrawal error:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
