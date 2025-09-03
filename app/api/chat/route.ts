import { NextRequest, NextResponse } from 'next/server';
import { crewOrchestrator } from '@/lib/agents/crew-orchestrator';
import { ChatMessage, AgentChatResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, variantId, agent } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Process the chat message and generate agent response
    const response = await crewOrchestrator.handleAgentChat(message, agent);

    return NextResponse.json({
      success: true,
      response: {
        message: response,
        suggestions: [
          'Adjust colors and styling',
          'Modify layout structure', 
          'Add interactive features',
          'Export the design'
        ]
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Removed - now handled by crewOrchestrator

// Removed - now handled by crewOrchestrator

// Removed - now handled by crewOrchestrator

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

// Removed - handled by CrewAI

export async function GET() {
  return NextResponse.json({
    message: 'Magic UI Elite Agent Chat API',
    agents: [
      'architect - UI structure and layout',
      'style-curator - Visual design and themes',
      'code-generator - Implementation and functionality',
      'qa - Quality assurance and accessibility',
      'exporter - Project export and deployment'
    ]
  });
}