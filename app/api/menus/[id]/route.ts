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
    const { name, isPublic } = body;

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return NextResponse.json(
      successResponse(menu, 'Menu updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update menu error:', error);
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

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json(
      successResponse(null, 'Menu deleted successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete menu error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
