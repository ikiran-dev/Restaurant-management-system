import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { categories: { include: { dishes: true } } },
    });

    if (!restaurant) {
      return NextResponse.json(
        errorResponse('Restaurant not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(restaurant), { status: 200 });
  } catch (error) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, location, phone, email, logo, theme } = body;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(logo !== undefined && { logo }),
        ...(theme !== undefined && { theme }),
      },
    });

    return NextResponse.json(
      successResponse(restaurant, 'Restaurant updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json(
      successResponse(null, 'Restaurant deleted successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete restaurant error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
