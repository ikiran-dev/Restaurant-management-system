import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        errorResponse('restaurantId is required'),
        { status: 400 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: { dishes: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(successResponse(categories), { status: 200 });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId, name, description } = body;

    if (!restaurantId || !name) {
      return NextResponse.json(
        errorResponse('restaurantId and name are required'),
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        restaurantId,
        name,
        description,
      },
    });

    return NextResponse.json(
      successResponse(category, 'Category created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
