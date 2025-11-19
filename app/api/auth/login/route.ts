import { loginUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    const user = await loginUser(email, password);

    return NextResponse.json(
      successResponse(user, 'Login successful'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      errorResponse(message),
      { status: 401 }
    );
  }
}
