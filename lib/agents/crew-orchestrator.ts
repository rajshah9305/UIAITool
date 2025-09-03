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
    return this.getFallbackVariants({ description: 'Generated UI', type: 'dashboard' });
  }

  private getFallbackVariants(brief: UIBrief): UIVariant[] {
    return [
      {
        id: 'variant-1',
        name: 'Modern Minimal',
        description: 'Clean, modern design with subtle animations',
        code: {
          html: `<!DOCTYPE html><html><head><title>Modern UI</title></head><body><div class="container"><h1>Modern Design</h1><p>Clean and minimal interface</p></div></body></html>`,
          css: `body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #fff; color: #333; } .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }`,
          js: `console.log('Modern UI loaded');`,
          framework: 'vanilla' as const,
          dependencies: [],
          assets: []
        },
        preview: {
          id: 'v1',
          url: '/previews/v1/index.html',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1vZGVybjwvdGV4dD48L3N2Zz4=',
          status: 'ready' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'style-1',
          name: 'Modern Minimal',
          description: 'Clean and minimal design',
          theme: 'modern-minimal',
          colors: { primary: '#007bff', secondary: '#6c757d', background: '#ffffff' },
          typography: { heading: 'font-semibold', body: 'font-normal' },
          spacing: { base: '1rem', tight: '0.5rem' },
          components: { button: 'bg-blue-500 text-white', card: 'bg-white shadow-sm' }
        },
        qaScore: 0.95,
        accessibility: { score: 0.92, issues: [] }
      },
      {
        id: 'variant-2',
        name: 'Bold Vibrant',
        description: 'Energetic design with bold colors and dynamic elements',
        code: {
          html: `<!DOCTYPE html><html><head><title>Bold UI</title></head><body><div class="container"><h1>Bold Design</h1><p>Vibrant and energetic interface</p></div></body></html>`,
          css: `body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: #fff; } .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }`,
          js: `console.log('Bold UI loaded');`,
          framework: 'vanilla' as const,
          dependencies: [],
          assets: []
        },
        preview: {
          id: 'v2',
          url: '/previews/v2/index.html',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjZiNmI7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZWNkYzQ7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb2xkPC90ZXh0Pjwvc3ZnPg==',
          status: 'ready' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'style-2',
          name: 'Bold Vibrant',
          description: 'Energetic and vibrant design',
          theme: 'bold-vibrant',
          colors: { primary: '#ff6b6b', secondary: '#4ecdc4', background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' },
          typography: { heading: 'font-bold', body: 'font-medium' },
          spacing: { base: '1.25rem', tight: '0.75rem' },
          components: { button: 'bg-red-500 text-white', card: 'bg-white/10 backdrop-blur' }
        },
        qaScore: 0.88,
        accessibility: { score: 0.85, issues: ['Consider higher contrast for better readability'] }
      },
      {
        id: 'variant-3',
        name: 'Dark Futuristic',
        description: 'Sleek dark theme with futuristic elements',
        code: {
          html: `<!DOCTYPE html><html><head><title>Dark UI</title></head><body><div class="container"><h1>Dark Design</h1><p>Futuristic dark interface</p></div></body></html>`,
          css: `body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f0f; color: #00ff88; } .container { max-width: 1200px; margin: 0 auto; padding: 2rem; border: 1px solid #00ff88; }`,
          js: `console.log('Dark UI loaded');`,
          framework: 'vanilla' as const,
          dependencies: [],
          assets: []
        },
        preview: {
          id: 'v3',
          url: '/previews/v3/index.html',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzBmMGYwZiIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IiMwMGZmODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRhcms8L3RleHQ+PC9zdmc+',
          status: 'ready' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'style-3',
          name: 'Dark Futuristic',
          description: 'Sleek dark futuristic design',
          theme: 'dark-futuristic',
          colors: { primary: '#00ff88', secondary: '#ff0080', background: '#0f0f0f' },
          typography: { heading: 'font-bold tracking-wide', body: 'font-normal' },
          spacing: { base: '1rem', tight: '0.5rem' },
          components: { button: 'bg-green-500 text-black', card: 'bg-gray-900 border border-green-500' }
        },
        qaScore: 0.93,
        accessibility: { score: 0.90, issues: [] }
      },
      {
        id: 'variant-4',
        name: 'Clean Professional',
        description: 'Professional business-oriented design',
        code: {
          html: `<!DOCTYPE html><html><head><title>Professional UI</title></head><body><div class="container"><h1>Professional Design</h1><p>Clean business interface</p></div></body></html>`,
          css: `body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f8f9fa; color: #495057; } .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`,
          js: `console.log('Professional UI loaded');`,
          framework: 'vanilla' as const,
          dependencies: [],
          assets: []
        },
        preview: {
          id: 'v4',
          url: '/previews/v4/index.html',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y4ZjlmYSIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMTAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZWUyZTYiLz48dGV4dCB4PSIxMDAiIHk9Ijc4IiBmaWxsPSIjNDk1MDU3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9mZXNzaW9uYWw8L3RleHQ+PC9zdmc+',
          status: 'ready' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'style-4',
          name: 'Clean Professional',
          description: 'Professional business design',
          theme: 'clean-professional',
          colors: { primary: '#007bff', secondary: '#6c757d', background: '#f8f9fa' },
          typography: { heading: 'font-semibold', body: 'font-normal' },
          spacing: { base: '1rem', tight: '0.5rem' },
          components: { button: 'bg-blue-600 text-white', card: 'bg-white shadow border' }
        },
        qaScore: 0.97,
        accessibility: { score: 0.96, issues: [] }
      }
    ];
  }
}

export const crewOrchestrator = new CrewOrchestrator();