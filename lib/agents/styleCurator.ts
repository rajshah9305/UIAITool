import { UIStructure, StyleVariant } from '../types';

class StyleCuratorAgent {
  private styleThemes = {
    'retro-futurism': {
      name: 'Retro Futurism',
      description: 'Neon gradients with dark backgrounds and cyberpunk aesthetics',
      colors: {
        primary: '#00ff88',
        secondary: '#ff0080',
        background: '#0a0a0a',
        surface: '#1a1a1a',
        accent: '#00d4ff'
      },
      typography: {
        heading: 'font-bold tracking-tight',
        body: 'font-medium',
        accent: 'font-mono uppercase tracking-widest'
      },
      effects: ['neon-glow', 'gradient-borders', 'glass-morphism']
    },
    'glass-aurora': {
      name: 'Glass Aurora',
      description: 'Translucent glass effects with aurora-inspired gradients',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        surface: 'rgba(255, 255, 255, 0.1)',
        accent: '#f093fb'
      },
      typography: {
        heading: 'font-light tracking-wide',
        body: 'font-normal',
        accent: 'font-semibold'
      },
      effects: ['backdrop-blur', 'gradient-mesh', 'floating-elements']
    },
    'brutalist': {
      name: 'Neo Brutalist',
      description: 'Bold geometric shapes with high contrast and sharp edges',
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#f5f5f5',
        surface: '#ffffff',
        accent: '#ff6b35'
      },
      typography: {
        heading: 'font-black uppercase tracking-tighter',
        body: 'font-bold',
        accent: 'font-extrabold'
      },
      effects: ['hard-shadows', 'geometric-shapes', 'high-contrast']
    },
    'minimal-mono': {
      name: 'Minimal Mono',
      description: 'Clean monochromatic design with subtle animations',
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        background: '#ffffff',
        surface: '#f7fafc',
        accent: '#3182ce'
      },
      typography: {
        heading: 'font-medium tracking-normal',
        body: 'font-normal',
        accent: 'font-semibold'
      },
      effects: ['subtle-shadows', 'smooth-transitions', 'minimal-borders']
    }
  };

  async createVariants(structure: UIStructure): Promise<StyleVariant[]> {
    const themes = Object.keys(this.styleThemes);
    
    return themes.map((themeKey, index) => {
      const theme = this.styleThemes[themeKey as keyof typeof this.styleThemes];
      
      return {
        id: `style-${index + 1}`,
        name: theme.name,
        description: theme.description,
        theme: themeKey,
        colors: theme.colors,
        typography: theme.typography,
        spacing: this.generateSpacing(themeKey),
        components: this.generateComponentStyles(themeKey, structure),
        animations: this.generateAnimations(themeKey),
        responsive: this.generateResponsiveRules(themeKey)
      };
    });
  }

  private generateSpacing(theme: string): any {
    const spacingMaps = {
      'retro-futurism': { base: '1rem', tight: '0.5rem', loose: '2rem' },
      'glass-aurora': { base: '1.25rem', tight: '0.75rem', loose: '2.5rem' },
      'brutalist': { base: '1.5rem', tight: '0.25rem', loose: '3rem' },
      'minimal-mono': { base: '1rem', tight: '0.5rem', loose: '1.5rem' }
    };
    
    return spacingMaps[theme as keyof typeof spacingMaps] || spacingMaps['minimal-mono'];
  }

  private generateComponentStyles(theme: string, structure: UIStructure): any {
    const baseStyles = {
      button: this.getButtonStyles(theme),
      card: this.getCardStyles(theme),
      input: this.getInputStyles(theme),
      navigation: this.getNavigationStyles(theme)
    };

    return baseStyles;
  }

  private getButtonStyles(theme: string): any {
    const styles = {
      'retro-futurism': 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold py-3 px-6 rounded-lg shadow-neon transition-all duration-300',
      'glass-aurora': 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300',
      'brutalist': 'bg-black text-white font-black py-4 px-8 border-4 border-black hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wider',
      'minimal-mono': 'bg-gray-900 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-200'
    };
    
    return styles[theme as keyof typeof styles] || styles['minimal-mono'];
  }

  private getCardStyles(theme: string): any {
    const styles = {
      'retro-futurism': 'bg-gray-900/90 border border-green-400/50 rounded-lg p-6 shadow-lg shadow-green-400/20 backdrop-blur-sm',
      'glass-aurora': 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl',
      'brutalist': 'bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      'minimal-mono': 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200'
    };
    
    return styles[theme as keyof typeof styles] || styles['minimal-mono'];
  }

  private getInputStyles(theme: string): any {
    const styles = {
      'retro-futurism': 'bg-gray-900 border border-green-400/50 text-green-400 placeholder-green-400/50 rounded-lg px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-400/20',
      'glass-aurora': 'bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:border-white/50 focus:ring-2 focus:ring-white/20',
      'brutalist': 'bg-white border-4 border-black px-4 py-4 font-bold focus:outline-none focus:ring-4 focus:ring-orange-500',
      'minimal-mono': 'bg-white border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    };
    
    return styles[theme as keyof typeof styles] || styles['minimal-mono'];
  }

  private getNavigationStyles(theme: string): any {
    const styles = {
      'retro-futurism': 'bg-black/90 backdrop-blur-md border-b border-green-400/30',
      'glass-aurora': 'bg-white/10 backdrop-blur-md border-b border-white/20',
      'brutalist': 'bg-white border-b-4 border-black',
      'minimal-mono': 'bg-white border-b border-gray-200'
    };
    
    return styles[theme as keyof typeof styles] || styles['minimal-mono'];
  }

  private generateAnimations(theme: string): any {
    return {
      'retro-futurism': ['pulse-neon', 'slide-glow', 'matrix-rain'],
      'glass-aurora': ['float-gentle', 'blur-fade', 'aurora-shift'],
      'brutalist': ['sharp-slide', 'bold-scale', 'contrast-flip'],
      'minimal-mono': ['fade-smooth', 'slide-subtle', 'scale-gentle']
    }[theme] || ['fade-smooth'];
  }

  private generateResponsiveRules(theme: string): any {
    return {
      mobile: 'px-4 py-2',
      tablet: 'px-6 py-4',
      desktop: 'px-8 py-6'
    };
  }

  async refineStyle(variantId: string, refinementPlan: any): Promise<StyleVariant> {
    // Implementation for refining styles based on feedback
    const currentTheme = this.styleThemes['minimal-mono']; // Default fallback
    
    return {
      id: variantId,
      name: currentTheme.name,
      description: currentTheme.description,
      theme: 'minimal-mono',
      colors: currentTheme.colors,
      typography: currentTheme.typography,
      spacing: this.generateSpacing('minimal-mono'),
      components: this.generateComponentStyles('minimal-mono', {} as UIStructure),
      animations: this.generateAnimations('minimal-mono'),
      responsive: this.generateResponsiveRules('minimal-mono')
    };
  }
}

export const styleCurator = new StyleCuratorAgent();