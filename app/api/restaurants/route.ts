import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        errorResponse('Not authenticated'),
        { status: 401 }
      );
    }

    // Get first user (simplified - in production use proper session validation)
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { userId: user.id },
      include: { categories: true },
    });

    return NextResponse.json(successResponse(restaurants), { status: 200 });
  } catch (error) {
    console.error('Get restaurants error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        errorResponse('Not authenticated'),
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, description, location, phone, email } = body;

    if (!name) {
      return NextResponse.json(
        errorResponse('Restaurant name is required'),
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        userId: user.id,
        name,
        description,
        location,
        phone,
        email,
      },
    });

    return NextResponse.json(
      successResponse(restaurant, 'Restaurant created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create restaurant error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
