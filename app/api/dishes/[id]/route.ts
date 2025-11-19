import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, price, image, available, displayOrder } = body;

    const dish = await prisma.dish.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image !== undefined && { image }),
        ...(available !== undefined && { available }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    });

    return NextResponse.json(
      successResponse(dish, 'Dish updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update dish error:', error);
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

    await prisma.dish.delete({
      where: { id },
    });

    return NextResponse.json(
      successResponse(null, 'Dish deleted successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete dish error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
