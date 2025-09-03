import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get('variant') || 'v1';
  
  try {
    const previewPath = join(process.cwd(), 'public', 'previews', variant, 'index.html');
    
    if (!existsSync(previewPath)) {
      return NextResponse.json({ 
        error: 'Preview not found',
        path: previewPath,
        variant 
      }, { status: 404 });
    }
    
    const content = readFileSync(previewPath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to load preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}