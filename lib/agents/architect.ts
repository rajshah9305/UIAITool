import { UIBrief, UIStructure, AgentResponse } from '../types';

class ArchitectAgent {
  async analyze(brief: UIBrief): Promise<AgentResponse<UIStructure>> {
    // Analyze the brief and create structural foundation
    const structure = this.createStructure(brief);
    
    return {
      agent: 'architect',
      success: true,
      data: structure,
      reasoning: `Analyzed "${brief.description}" and created ${structure.components.length} component structure`
    };
  }

  private createStructure(brief: UIBrief): UIStructure {
    const components = this.identifyComponents(brief.description);
    const layout = this.determineLayout(brief.description);
    
    return {
      type: this.determineType(brief.description),
      layout,
      components,
      navigation: this.determineNavigation(brief.description),
      responsive: true,
      accessibility: {
        level: 'AA',
        features: ['keyboard-nav', 'screen-reader', 'high-contrast']
      }
    };
  }

  private identifyComponents(description: string): Array<{name: string, type: string, props: any}> {
    const components = [];
    
    if (description.includes('dashboard')) {
      components.push(
        { name: 'Header', type: 'navigation', props: { sticky: true } },
        { name: 'Sidebar', type: 'navigation', props: { collapsible: true } },
        { name: 'StatsGrid', type: 'data-display', props: { columns: 4 } },
        { name: 'ChartSection', type: 'data-visualization', props: { responsive: true } }
      );
    }
    
    if (description.includes('landing')) {
      components.push(
        { name: 'Hero', type: 'hero-section', props: { fullHeight: true } },
        { name: 'Features', type: 'content-section', props: { grid: true } },
        { name: 'CTA', type: 'call-to-action', props: { centered: true } }
      );
    }
    
    if (description.includes('form') || description.includes('contact')) {
      components.push(
        { name: 'FormContainer', type: 'form', props: { validation: true } },
        { name: 'InputGroup', type: 'form-field', props: { required: true } }
      );
    }
    
    return components.length > 0 ? components : [
      { name: 'Container', type: 'layout', props: { maxWidth: 'lg' } },
      { name: 'Content', type: 'content', props: { padding: true } }
    ];
  }

  private determineLayout(description: string): string {
    if (description.includes('sidebar')) return 'sidebar';
    if (description.includes('grid')) return 'grid';
    if (description.includes('column')) return 'column';
    return 'flex';
  }

  private determineType(description: string): string {
    if (description.includes('dashboard')) return 'dashboard';
    if (description.includes('landing')) return 'landing-page';
    if (description.includes('form')) return 'form';
    if (description.includes('blog')) return 'blog';
    return 'general';
  }

  private determineNavigation(description: string): any {
    return {
      type: description.includes('sidebar') ? 'sidebar' : 'header',
      items: ['Home', 'About', 'Services', 'Contact'],
      mobile: true
    };
  }

  async planRefinement(feedback: string): Promise<any> {
    return {
      changes: this.parseFeedback(feedback),
      priority: 'high',
      scope: 'component'
    };
  }

  private parseFeedback(feedback: string): string[] {
    const changes = [];
    if (feedback.includes('color')) changes.push('update-colors');
    if (feedback.includes('layout')) changes.push('adjust-layout');
    if (feedback.includes('spacing')) changes.push('fix-spacing');
    return changes;
  }
}

export const architect = new ArchitectAgent();