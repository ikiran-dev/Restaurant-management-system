import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const menu = await prisma.menu.findUnique({
      where: { slug },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
            phone: true,
            email: true,
            logo: true,
            theme: true,
            categories: {
              include: {
                dishes: {
                  where: { available: true },
                  orderBy: { displayOrder: 'asc' },
                },
              },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!menu || !menu.isPublic) {
      return NextResponse.json(
        errorResponse('Menu not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(menu), { status: 200 });
  } catch (error) {
    console.error('Get menu error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
