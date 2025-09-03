import { UIStructure, StyleVariant, UIBrief, GeneratedCode } from '../types';

class CodeGeneratorAgent {
  async generate(params: {
    structure: UIStructure;
    style: StyleVariant;
    brief: UIBrief;
  }): Promise<GeneratedCode> {
    const { structure, style, brief } = params;
    
    const html = this.generateHTML(structure, style);
    const css = this.generateCSS(style);
    const js = this.generateJS(structure);
    
    return {
      html,
      css,
      js,
      framework: 'vanilla',
      dependencies: [],
      assets: []
    };
  }

  private generateHTML(structure: UIStructure, style: StyleVariant): string {
    const components = structure.components.map(comp => 
      this.generateComponent(comp, style)
    ).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${style.name} - Magic UI Elite</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="${this.getBodyClasses(style)}">
    <div class="app-container">
        ${components}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateComponent(component: any, style: StyleVariant): string {
    switch (component.type) {
      case 'navigation':
        return this.generateNavigation(component, style);
      case 'hero-section':
        return this.generateHero(component, style);
      case 'data-display':
        return this.generateStatsGrid(component, style);
      case 'form':
        return this.generateForm(component, style);
      default:
        return this.generateGenericComponent(component, style);
    }
  }

  private generateNavigation(component: any, style: StyleVariant): string {
    const navClass = style.components.navigation;
    
    return `
    <nav class="navbar ${navClass}">
        <div class="nav-container">
            <div class="nav-brand">
                <h1 class="brand-text">${style.name}</h1>
            </div>
            <div class="nav-menu">
                <a href="#" class="nav-link">Home</a>
                <a href="#" class="nav-link">About</a>
                <a href="#" class="nav-link">Services</a>
                <a href="#" class="nav-link">Contact</a>
            </div>
            <button class="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;
  }

  private generateHero(component: any, style: StyleVariant): string {
    return `
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">Welcome to ${style.name}</h1>
            <p class="hero-subtitle">${style.description}</p>
            <div class="hero-actions">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
    </section>`;
  }

  private generateStatsGrid(component: any, style: StyleVariant): string {
    const stats = [
      { label: 'Total Users', value: '12,345', change: '+12%' },
      { label: 'Revenue', value: '$45,678', change: '+8%' },
      { label: 'Orders', value: '1,234', change: '+15%' },
      { label: 'Conversion', value: '3.2%', change: '+2%' }
    ];

    const statsCards = stats.map(stat => `
        <div class="stat-card ${style.components.card}">
            <div class="stat-header">
                <h3 class="stat-label">${stat.label}</h3>
                <span class="stat-change positive">${stat.change}</span>
            </div>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');

    return `
    <section class="stats-section">
        <div class="stats-grid">
            ${statsCards}
        </div>
    </section>`;
  }

  private generateForm(component: any, style: StyleVariant): string {
    return `
    <section class="form-section">
        <div class="form-container">
            <h2 class="form-title">Contact Us</h2>
            <form class="contact-form">
                <div class="form-group">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" id="name" class="form-input ${style.components.input}" placeholder="Your name">
                </div>
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-input ${style.components.input}" placeholder="your@email.com">
                </div>
                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" class="form-textarea ${style.components.input}" rows="4" placeholder="Your message"></textarea>
                </div>
                <button type="submit" class="btn btn-primary ${style.components.button}">Send Message</button>
            </form>
        </div>
    </section>`;
  }

  private generateGenericComponent(component: any, style: StyleVariant): string {
    return `
    <section class="generic-section">
        <div class="container">
            <h2>${component.name}</h2>
            <p>This is a ${component.type} component.</p>
        </div>
    </section>`;
  }

  private getBodyClasses(style: StyleVariant): string {
    const themeClasses = {
      'retro-futurism': 'theme-retro bg-black text-green-400',
      'glass-aurora': 'theme-glass bg-gradient-aurora text-white',
      'brutalist': 'theme-brutal bg-gray-100 text-black',
      'minimal-mono': 'theme-minimal bg-white text-gray-900'
    };
    
    return themeClasses[style.theme as keyof typeof themeClasses] || 'theme-minimal bg-white text-gray-900';
  }

  private generateCSS(style: StyleVariant): string {
    return `
/* ${style.name} Theme Styles */
:root {
    --primary: ${style.colors.primary};
    --secondary: ${style.colors.secondary};
    --background: ${style.colors.background};
    --surface: ${style.colors.surface};
    --accent: ${style.colors.accent};
    --spacing-base: ${style.spacing.base};
    --spacing-tight: ${style.spacing.tight};
    --spacing-loose: ${style.spacing.loose};
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    background: var(--background);
}

.app-container {
    min-height: 100vh;
}

/* Navigation Styles */
.navbar {
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-text {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: inherit;
    font-weight: 500;
    transition: opacity 0.2s;
}

.nav-link:hover {
    opacity: 0.8;
}

.mobile-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
}

.mobile-toggle span {
    width: 25px;
    height: 3px;
    background: currentColor;
    transition: 0.3s;
}

/* Hero Section */
.hero-section {
    padding: 4rem 2rem;
    text-align: center;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content {
    max-width: 600px;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    ${style.typography.heading};
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Button Styles */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Stats Grid */
.stats-section {
    padding: 4rem 2rem;
}

.stats-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.stat-card {
    padding: 2rem;
    border-radius: 1rem;
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.stat-label {
    font-size: 0.875rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
}

.stat-change.positive {
    color: #10b981;
    font-weight: 600;
}

/* Form Styles */
.form-section {
    padding: 4rem 2rem;
}

.form-container {
    max-width: 600px;
    margin: 0 auto;
}

.form-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--primary);
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .mobile-toggle {
        display: flex;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

/* Theme-specific styles */
${this.getThemeSpecificCSS(style)}
`;
  }

  private getThemeSpecificCSS(style: StyleVariant): string {
    const themeStyles = {
      'retro-futurism': `
        .theme-retro {
            background: linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        .btn-primary {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: #000;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        .stat-card {
            background: rgba(26, 26, 46, 0.8);
            border: 1px solid rgba(0, 255, 136, 0.3);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }
      `,
      'glass-aurora': `
        .theme-glass {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-primary {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `,
      'brutalist': `
        .btn-primary {
            background: #000;
            color: #fff;
            border: 4px solid #000;
            border-radius: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            box-shadow: 8px 8px 0px 0px #ff6b35;
        }
        .stat-card {
            background: #fff;
            border: 4px solid #000;
            border-radius: 0;
            box-shadow: 12px 12px 0px 0px #000;
        }
      `,
      'minimal-mono': `
        .stat-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .btn-primary {
            background: #3182ce;
        }
      `
    };
    
    return themeStyles[style.theme as keyof typeof themeStyles] || themeStyles['minimal-mono'];
  }

  private generateJS(structure: UIStructure): string {
    return `
// ${structure.type} Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '#e5e7eb';
                }
            });
            
            if (isValid) {
                alert('Form submitted successfully!');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') return;
            
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.stat-card, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
`;
  }

  async refine(variantId: string, refinementPlan: any): Promise<GeneratedCode> {
    // Implementation for refining generated code
    return {
      html: '<div>Refined HTML</div>',
      css: '/* Refined CSS */',
      js: '// Refined JS',
      framework: 'vanilla',
      dependencies: [],
      assets: []
    };
  }
}

export const codeGenerator = new CodeGeneratorAgent();