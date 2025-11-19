import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      console.error( dbError.message);
      
      if (dbError.message.includes('relation') || dbError.message.includes('does not exist')) {
        return NextResponse.json(
          errorResponse('Database not initialized. Please initialize the database first by calling POST /api/db/init'),
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        errorResponse('Database connection failed: ' + dbError.message),
        { status: 503 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        errorResponse('User already exists'),
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: 'RESTAURANT_OWNER',
      },
    });

    return NextResponse.json(
      successResponse(
        { id: user.id, email: user.email, name: user.name },
        'User created successfully'
      ),
      { status: 201 }
    );
  } catch (error: any) {
    console.error( error.message);
    return NextResponse.json(
      errorResponse(error.message || 'Internal server error'),
      { status: 500 }
    );
  }
}
