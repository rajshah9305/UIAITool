import { NextResponse } from 'next/server';
import { cerebrasClient } from '@/lib/cerebras-client';

export async function POST() {
  try {
    const testMessages = [
      {
        role: 'system',
        content: 'You are a UI design expert. Respond with creative design suggestions.'
      },
      {
        role: 'user', 
        content: 'Create a modern dashboard design with dark theme'
      }
    ];

    const response = await cerebrasClient.generateCompletion(testMessages, {
      temperature: 0.7,
      maxTokens: 500
    });

    return NextResponse.json({
      success: true,
      response,
      hasApiKey: !!process.env.CEREBRAS_API_KEY,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasApiKey: !!process.env.CEREBRAS_API_KEY
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cerebras API Test Endpoint',
    hasApiKey: !!process.env.CEREBRAS_API_KEY,
    status: 'ready'
  });
}