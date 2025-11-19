import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        errorResponse('Not authenticated'),
        { status: 401 }
      );
    }

    // In production, validate token properly
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(user), { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
