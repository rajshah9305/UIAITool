import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Magic UI Elite API is working',
    timestamp: new Date().toISOString(),
    previews: [
      { id: 'v1', url: '/previews/v1/index.html', status: 'ready' },
      { id: 'v2', url: '/previews/v2/index.html', status: 'ready' },
      { id: 'v3', url: '/previews/v3/index.html', status: 'ready' },
      { id: 'v4', url: '/previews/v4/index.html', status: 'ready' }
    ]
  });
}