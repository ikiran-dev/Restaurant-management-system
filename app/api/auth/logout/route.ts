import { logoutUser } from '@/lib/auth';
import { successResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await logoutUser();
    return NextResponse.json(
      successResponse(null, 'Logged out successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
