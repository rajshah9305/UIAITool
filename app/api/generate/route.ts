import { NextRequest, NextResponse } from 'next/server';
import { crewOrchestrator } from '@/lib/agents/crew-orchestrator';
import { UIBrief } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, type, requirements } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const brief: UIBrief = {
      description,
      type: type || 'general',
      requirements: requirements || []
    };

    const variants = await crewOrchestrator.executeWorkflow(brief);

    return NextResponse.json({
      success: true,
      variants,
      message: `Generated ${variants.length} UI variants successfully`
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate UI variants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Magic UI Elite Generation API',
    endpoints: {
      POST: 'Generate UI variants from description',
      body: {
        description: 'string (required)',
        type: 'string (optional)',
        requirements: 'string[] (optional)'
      }
    }
  });
}