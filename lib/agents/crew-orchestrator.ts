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
        systemPrompt: 'You are a UI Architect. Analyze user requirements and create logical component structures, layouts, and user flows. Focus on usability, accessibility, and scalability. Provide the output as a JSON object with keys: components, layout, navigation.'
      },
      {
        name: 'style-curator',
        role: 'Creative Design Director',
        goal: 'Create visually stunning and cohesive design systems',
        backstory: 'You are a creative visionary with expertise in color theory, typography, and modern design trends.',
        systemPrompt: 'You are a Style Curator. Create beautiful, modern design systems with cohesive color palettes, typography, and visual themes. Stay current with design trends while ensuring usability. Provide 4 distinct visual themes as a JSON array of objects, each with keys: name, description, colors (object with primary, secondary, background, surface, accent), typography (object with heading, body), spacing (object with base, tight, loose), components (object with button, card).'
      },
      {
        name: 'code-generator',
        role: 'Full-Stack Developer',
        goal: 'Transform designs into clean, performant, and maintainable code',
        backstory: 'You are a skilled developer with expertise in modern web technologies and best practices.',
        systemPrompt: 'You are a Code Generator. Convert UI designs into clean, semantic HTML, efficient CSS, and interactive JavaScript. Follow modern web standards and best practices. For each of the 4 themes provided, generate the HTML, CSS, and JS code. Provide the output as a JSON array of objects, each with keys: themeName, html, css, js.'
      },
      {
        name: 'qa-specialist',
        role: 'QA Engineer & Accessibility Expert',
        goal: 'Ensure code quality, accessibility, and performance standards',
        backstory: 'You are a meticulous QA engineer with deep expertise in web standards and accessibility guidelines.',
        systemPrompt: 'You are a QA Specialist. Review code for quality, accessibility (WCAG compliance), performance, and cross-browser compatibility. Provide actionable feedback and recommendations. For each of the 4 code implementations, provide a QA score (0-1) and an array of accessibility issues. Provide the output as a JSON array of objects, each with keys: themeName, qaScore, accessibilityIssues (array of strings).'
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
      return this.parseWorkflowResults(brief, architectAnalysis, styleVariants, codeImplementations, qaResults);

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
      maxTokens: 4096 // Increased maxTokens for more complex outputs
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
    brief: UIBrief,
    architectAnalysis: string,
    styleVariants: string, 
    codeImplementations: string,
    qaResults: string
  ): UIVariant[] {
    try {
      const parsedArchitectAnalysis = JSON.parse(architectAnalysis);
      const parsedStyleVariants = JSON.parse(styleVariants);
      const parsedCodeImplementations = JSON.parse(codeImplementations);
      const parsedQaResults = JSON.parse(qaResults);

      const variants: UIVariant[] = [];

      for (let i = 0; i < parsedStyleVariants.length; i++) {
        const style = parsedStyleVariants[i];
        const code = parsedCodeImplementations.find((c: any) => c.themeName === style.name);
        const qa = parsedQaResults.find((q: any) => q.themeName === style.name);

        if (code && qa) {
          variants.push({
            id: `variant-${i + 1}`,
            name: style.name,
            description: style.description,
            code: {
              html: code.html,
              css: code.css,
              js: code.js,
              framework: 'vanilla',
              dependencies: [],
              assets: []
            },
            preview: {
              id: `v${i + 1}`,
              url: `/api/preview-test?variant=v${i + 1}`,
              thumbnail: '', // This will be generated dynamically later
              status: 'pending' as const,
              lastUpdated: new Date().toISOString()
            },
            style: style,
            qaScore: qa.qaScore,
            accessibility: {
              score: qa.qaScore, // Assuming qaScore also represents accessibility score for now
              issues: qa.accessibilityIssues || []
            }
          });
        }
      }
      return variants;
    } catch (error) {
      console.error('Error parsing workflow results:', error);
      return this.getFallbackVariants(brief);
    }
  }

  private async getFallbackVariants(brief: UIBrief): Promise<UIVariant[]> {
    // Generate a more complete and visually appealing fallback UI
    const generatedCode = await cerebrasClient.generateUI(`A simple landing page with a hero section, a feature section, and a call to action, based on the brief: ${brief.description}`);

    return [
      {
        id: 'fallback-variant-1',
        name: 'Basic Landing Page (Fallback)',
        description: `A basic UI generated as a fallback due to workflow issues: ${brief.description}`,
        code: generatedCode,
        preview: {
          id: 'fb-v1',
          url: '/previews/fallback/index.html',
          thumbnail: '', // This will be generated dynamically later
          status: 'pending' as const,
          lastUpdated: new Date().toISOString()
        },
        style: {
          id: 'fallback-style-1',
          name: 'Clean & Simple',
          description: 'A clean and simple design with a focus on readability and usability.',
          theme: 'fallback',
          colors: {
            primary: '#4A90E2',
            secondary: '#50E3C2',
            background: '#F8F8F8',
            surface: '#FFFFFF',
            accent: '#FF6B6B'
          },
          typography: {
            heading: 'font-sans text-2xl font-bold',
            body: 'font-sans text-base'
          },
          spacing: {
            base: '1rem',
            tight: '0.5rem',
            loose: '2rem'
          },
          components: {
            button: 'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600',
            card: 'bg-white shadow-md rounded-lg p-6'
          }
        },
        qaScore: 0.7, // Assign a default QA score for fallback
        accessibility: { score: 0.7, issues: ['Ensure sufficient color contrast for text.'] } // Default accessibility issues
      }
    ];
  }
}

export const crewOrchestrator = new CrewOrchestrator();


