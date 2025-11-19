import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        errorResponse('restaurantId is required'),
        { status: 400 }
      );
    }

    const menus = await prisma.menu.findMany({
      where: { restaurantId },
    });

    return NextResponse.json(successResponse(menus), { status: 200 });
  } catch (error) {
    console.error('Get menus error:', error);
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

    const body = await req.json();
    const { restaurantId, name, slug } = body;

    if (!restaurantId || !name || !slug) {
      return NextResponse.json(
        errorResponse('restaurantId, name, and slug are required'),
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingMenu = await prisma.menu.findUnique({
      where: { slug },
    });

    if (existingMenu) {
      return NextResponse.json(
        errorResponse('Slug already exists'),
        { status: 409 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        restaurantId,
        name,
        slug,
        isPublic: true,
      },
    });

    return NextResponse.json(
      successResponse(menu, 'Menu created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create menu error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
