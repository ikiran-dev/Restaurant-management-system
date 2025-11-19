import { neon } from '@neondatabase/serverless';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        errorResponse('DATABASE_URL environment variable not set'),
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const schemaPath = path.join(process.cwd(), 'scripts', 'init-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    
   
    const statements = schemaSQL
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await sql(statement);
    }

    return NextResponse.json(
      successResponse({ initialized: true }, 'Database schema initialized successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    console.error( error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to initialize database'),
      { status: 500 }
    );
  }
}
