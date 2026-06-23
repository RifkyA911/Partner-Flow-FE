import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/** Custom session info for clients — do NOT use /api/auth/session (reserved by NextAuth). */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          partner_code: session.user.partner_code,
          needsOnboarding: (session.user as { needsOnboarding?: boolean })
            .needsOnboarding,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Session error' },
      { status: 500 },
    );
  }
}
