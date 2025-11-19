import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { validateImageFile } from '@/lib/image-utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        errorResponse('No file provided'),
        { status: 400 }
      );
    }

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json(
        errorResponse(validationError),
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json(
      successResponse({ url: dataUrl }, 'Image uploaded successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      errorResponse('Failed to upload image'),
      { status: 500 }
    );
  }
}
