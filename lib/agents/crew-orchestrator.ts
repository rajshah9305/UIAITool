import { cerebrasClient } from '../cerebras-client';
import { UIBrief, UIVariant, AgentResponse } from '../types';

interface Agent {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  systemPrompt: string;
}

class CrewOrchestrator {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const agents = [
      {
        name: 'architect',
        role: 'UI/UX Architect',
        goal: 'Design intuitive and scalable user interface structures',
        backstory: 'You are an experienced UI architect with deep knowledge of design patterns, user experience principles, and modern web technologies.',
        systemPrompt: 'You are a UI Architect. Analyze user requirements and create logical component structures, layouts, and user flows. Focus on usability, accessibility, and scalability.'
      },
      {
        name: 'style-curator',
        role: 'Creative Design Director',
        goal: 'Create visually stunning and cohesive design systems',
        backstory: 'You are a creative visionary with expertise in color theory, typography, and modern design trends.',
        systemPrompt: 'You are a Style Curator. Create beautiful, modern design systems with cohesive color palettes, typography, and visual themes. Stay current with design trends while ensuring usability.'
      },
      {
        name: 'code-generator',
        role: 'Full-Stack Developer',
        goal: 'Transform designs into clean, performant, and maintainable code',
        backstory: 'You are a skilled developer with expertise in modern web technologies and best practices.',
        systemPrompt: 'You are a Code Generator. Convert UI designs into clean, semantic HTML, efficient CSS, and interactive JavaScript. Follow modern web standards and best practices.'
      },
      {
        name: 'qa-specialist',
        role: 'QA Engineer & Accessibility Expert',
        goal: 'Ensure code quality, accessibility, and performance standards',
        backstory: 'You are a meticulous QA engineer with deep expertise in web standards and accessibility guidelines.',
        systemPrompt: 'You are a QA Specialist. Review code for quality, accessibility (WCAG compliance), performance, and cross-browser compatibility. Provide actionable feedback and recommendations.'
      }
    ];

    agents.forEach(agent => {
      this.agents.set(agent.name, agent);
    });
  }

  async executeWorkflow(brief: UIBrief): Promise<UIVariant[]> {
    try {
      // Step 1: Architect analyzes the brief
      const architectAnalysis = await this.executeAgentTask('architect', 
        `Analyze this UI brief and create a component structure: "${brief.description}". 
        Consider the type: ${brief.type || 'general'}.
        Provide a JSON structure with components, layout, and navigation.`
      );

      // Step 2: Style Curator creates 4 different themes
      const styleVariants = await this.executeAgentTask('style-curator',
        `Based on this UI structure: ${architectAnalysis}
        Create 4 distinct visual themes with different aesthetics:
        1. Modern/Minimal
        2. Bold/Vibrant  
        3. Dark/Futuristic
        4. Clean/Professional
        
        For each theme, provide colors, typography, and styling approach.`
      );

      // Step 3: Code Generator creates implementations
      const codeImplementations = await this.executeAgentTask('code-generator',
        `Generate HTML, CSS, and JavaScript code for these designs:
        Structure: ${architectAnalysis}
        Styles: ${styleVariants}
        
        Create 4 complete implementations, one for each theme.`
      );

      // Step 4: QA validates the implementations
      const qaResults = await this.executeAgentTask('qa-specialist',
        `Review these code implementations for quality and accessibility:
        ${codeImplementations}
        
        Provide scores and recommendations for each variant.`
      );

      // Parse results and create variants
      return this.parseWorkflowResults(architectAnalysis, styleVariants, codeImplementations, qaResults);

    } catch (error) {
      console.error('Workflow execution failed:', error);
      return this.getFallbackVariants(brief);
    }
  }

  private async executeAgentTask(agentName: string, task: string): Promise<string> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    const messages = [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: task }
    ];

    return await cerebrasClient.generateCompletion(messages, {
      temperature: 0.7,
      maxTokens: 2048
    });
  }

  async handleAgentChat(message: string, agentName?: string): Promise<string> {
    const targetAgent = agentName || this.determineAgent(message);
    const agent = this.agents.get(targetAgent);
    
    if (!agent) {
      return 'I\'m not sure which agent can help with that. Could you be more specific?';
    }

    const messages = [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: message }
    ];

    return await cerebrasClient.generateCompletion(messages, {
      temperature: 0.6,
      maxTokens: 1024
    });
  }

  private determineAgent(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('color') || messageLower.includes('style') || messageLower.includes('theme')) {
      return 'style-curator';
    }
    
    if (messageLower.includes('layout') || messageLower.includes('structure') || messageLower.includes('component')) {
      return 'architect';
    }
    
    if (messageLower.includes('code') || messageLower.includes('implement') || messageLower.includes('function')) {
      return 'code-generator';
    }
    
    if (messageLower.includes('accessibility') || messageLower.includes('quality') || messageLower.includes('test')) {
      return 'qa-specialist';
    }
    
    return 'architect'; // Default
  }

  private parseWorkflowResults(
    architectAnalysis: string,
    styleVariants: string, 
    codeImplementations: string,
    qaResults: string
  ): UIVariant[] {
    // For now, return structured mock data
    // In production, this would parse the AI responses
    return this.getFallbackVariants(brief);
  }

  private async getFallbackVariants(brief: UIBrief): Promise<UIVariant[]> {
    const generatedCode = await cerebrasClient.generateUI(brief.description);

    return [
      {
        id: 'variant-1',
        name: 'Generated UI',
        description: brief.description,
        code: generatedCode,
        preview: {
          id: 'v1',
          url: '/previews/v1/index.html',
          thumbnail: '', // This will be generated dynamically later
          status: 'pending' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'style-1',
          name: 'Generated Style',
          description: 'Dynamically generated style',
          theme: 'dynamic',
          colors: { primary: '#000000', secondary: '#000000', background: '#ffffff' },
          typography: { heading: 'font-sans', body: 'font-sans' },
          spacing: { base: '1rem', tight: '0.5rem' },
          components: { button: '', card: '' }
        },
        qaScore: 0,
        accessibility: { score: 0, issues: [] }
      }
    ];

  
}

export const crewOrchestrator = new CrewOrchestrator();
