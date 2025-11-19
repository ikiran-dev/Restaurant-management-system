import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const categoryId = req.nextUrl.searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        errorResponse('categoryId is required'),
        { status: 400 }
      );
    }

    const dishes = await prisma.dish.findMany({
      where: { categoryId },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(successResponse(dishes), { status: 200 });
  } catch (error) {
    console.error('Get dishes error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categoryId, name, description, price, image } = body;

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json(
        errorResponse('categoryId, name, and price are required'),
        { status: 400 }
      );
    }

    const dish = await prisma.dish.create({
      data: {
        categoryId,
        name,
        description,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json(
      successResponse(dish, 'Dish created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create dish error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
