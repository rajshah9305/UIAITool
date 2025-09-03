import { GeneratedCode, PreviewData } from '../types';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

class PreviewerAgent {
  private previewsDir = join(process.cwd(), 'public', 'previews');

  async createPreview(code: GeneratedCode, variantId: string): Promise<PreviewData> {
    try {
      const previewPath = join(this.previewsDir, variantId);
      
      // Ensure directory exists
      if (!existsSync(previewPath)) {
        mkdirSync(previewPath, { recursive: true });
      }
      
      // Write HTML file
      const htmlContent = this.injectStyles(code.html, code.css, code.js);
      writeFileSync(join(previewPath, 'index.html'), htmlContent);
      
      // Write separate CSS file for external linking
      writeFileSync(join(previewPath, 'styles.css'), code.css);
      
      // Write separate JS file
      writeFileSync(join(previewPath, 'script.js'), code.js);
      
      const previewUrl = `/previews/${variantId}/index.html`;
      
      return {
        id: variantId,
        url: previewUrl,
        thumbnail: this.generateThumbnail(variantId),
        status: 'ready',
        lastUpdated: new Date().toISOString(),
        files: {
          html: join(previewPath, 'index.html'),
          css: join(previewPath, 'styles.css'),
          js: join(previewPath, 'script.js')
        }
      };
    } catch (error) {
      console.error(`Failed to create preview for ${variantId}:`, error);
      throw new Error(`Preview generation failed: ${error}`);
    }
  }

  private injectStyles(html: string, css: string, js: string): string {
    // Inject CSS and JS directly into HTML for standalone preview
    const styleTag = `<style>\n${css}\n</style>`;
    const scriptTag = `<script>\n${js}\n</script>`;
    
    // Replace the external links with inline content
    let modifiedHtml = html
      .replace('<link rel="stylesheet" href="styles.css">', styleTag)
      .replace('<script src="script.js"></script>', scriptTag);
    
    return modifiedHtml;
  }

  private generateThumbnail(variantId: string): string {
    // Generate a simple SVG thumbnail based on variant
    const thumbnails = {
      'v1': this.createRetroThumbnail(),
      'v2': this.createGlassThumbnail(),
      'v3': this.createBrutalistThumbnail(),
      'v4': this.createMinimalThumbnail()
    };
    
    return thumbnails[variantId as keyof typeof thumbnails] || thumbnails['v4'];
  }

  private createRetroThumbnail(): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="retro" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="150" fill="#0a0a0a"/>
        <rect x="10" y="10" width="180" height="30" fill="url(#retro)" opacity="0.8"/>
        <rect x="10" y="50" width="85" height="80" fill="#1a1a2e" stroke="#00ff88" stroke-width="1"/>
        <rect x="105" y="50" width="85" height="80" fill="#1a1a2e" stroke="#00ff88" stroke-width="1"/>
        <circle cx="50" cy="90" r="15" fill="#00ff88" opacity="0.6"/>
        <circle cx="150" cy="90" r="15" fill="#00d4ff" opacity="0.6"/>
      </svg>
    `).toString('base64')}`;
  }

  private createGlassThumbnail(): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="150" fill="url(#aurora)"/>
        <rect x="10" y="10" width="180" height="30" fill="rgba(255,255,255,0.2)" rx="15"/>
        <rect x="10" y="50" width="85" height="80" fill="rgba(255,255,255,0.1)" rx="10"/>
        <rect x="105" y="50" width="85" height="80" fill="rgba(255,255,255,0.1)" rx="10"/>
        <circle cx="50" cy="90" r="12" fill="rgba(255,255,255,0.3)"/>
        <circle cx="150" cy="90" r="12" fill="rgba(255,255,255,0.3)"/>
      </svg>
    `).toString('base64')}`;
  }

  private createBrutalistThumbnail(): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f5f5f5"/>
        <rect x="10" y="10" width="180" height="30" fill="#000000"/>
        <rect x="10" y="50" width="85" height="80" fill="#ffffff" stroke="#000000" stroke-width="4"/>
        <rect x="105" y="50" width="85" height="80" fill="#ffffff" stroke="#000000" stroke-width="4"/>
        <rect x="30" y="70" width="45" height="20" fill="#ff6b35"/>
        <rect x="125" y="70" width="45" height="20" fill="#ff6b35"/>
        <rect x="14" y="54" width="77" height="72" fill="none" stroke="#000000" stroke-width="2" transform="translate(4,4)"/>
        <rect x="109" y="54" width="77" height="72" fill="none" stroke="#000000" stroke-width="2" transform="translate(4,4)"/>
      </svg>
    `).toString('base64')}`;
  }

  private createMinimalThumbnail(): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#ffffff"/>
        <rect x="10" y="10" width="180" height="30" fill="#f7fafc" stroke="#e2e8f0" stroke-width="1"/>
        <rect x="10" y="50" width="85" height="80" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
        <rect x="105" y="50" width="85" height="80" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
        <circle cx="50" cy="90" r="8" fill="#3182ce"/>
        <circle cx="150" cy="90" r="8" fill="#3182ce"/>
        <line x1="20" y1="25" x2="60" y2="25" stroke="#2d3748" stroke-width="2"/>
        <line x1="20" y1="70" x2="80" y2="70" stroke="#4a5568" stroke-width="1"/>
        <line x1="115" y1="70" x2="175" y2="70" stroke="#4a5568" stroke-width="1"/>
      </svg>
    `).toString('base64')}`;
  }

  async updatePreview(variantId: string, code: GeneratedCode): Promise<PreviewData> {
    return this.createPreview(code, variantId);
  }

  async generateStaticPreviews(): Promise<void> {
    // This method can be called to pre-generate static previews
    const variants = ['v1', 'v2', 'v3', 'v4'];
    
    for (const variant of variants) {
      try {
        // This would typically use the orchestrator to generate actual content
        // For now, we'll create placeholder previews
        await this.createPlaceholderPreview(variant);
      } catch (error) {
        console.error(`Failed to generate static preview for ${variant}:`, error);
      }
    }
  }

  private async createPlaceholderPreview(variantId: string): Promise<void> {
    const placeholderCode = {
      html: this.getPlaceholderHTML(variantId),
      css: this.getPlaceholderCSS(variantId),
      js: this.getPlaceholderJS(),
      framework: 'vanilla' as const,
      dependencies: [],
      assets: []
    };
    
    await this.createPreview(placeholderCode, variantId);
  }

  private getPlaceholderHTML(variantId: string): string {
    const themes = {
      'v1': 'Retro Futurism',
      'v2': 'Glass Aurora',
      'v3': 'Neo Brutalist',
      'v4': 'Minimal Mono'
    };
    
    const theme = themes[variantId as keyof typeof themes] || 'Default';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${theme} - Magic UI Elite</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-${variantId}">
    <div class="app-container">
        <nav class="navbar">
            <div class="nav-container">
                <h1 class="brand">${theme}</h1>
                <div class="nav-menu">
                    <a href="#" class="nav-link">Home</a>
                    <a href="#" class="nav-link">About</a>
                    <a href="#" class="nav-link">Services</a>
                    <a href="#" class="nav-link">Contact</a>
                </div>
            </div>
        </nav>
        
        <main class="main-content">
            <section class="hero">
                <div class="hero-content">
                    <h1 class="hero-title">Welcome to ${theme}</h1>
                    <p class="hero-subtitle">Experience the power of AI-generated UI design</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary">Get Started</button>
                        <button class="btn btn-secondary">Learn More</button>
                    </div>
                </div>
            </section>
            
            <section class="stats">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Users</h3>
                        <div class="stat-value">12.5K</div>
                        <div class="stat-change">+12%</div>
                    </div>
                    <div class="stat-card">
                        <h3>Revenue</h3>
                        <div class="stat-value">$45.2K</div>
                        <div class="stat-change">+8%</div>
                    </div>
                    <div class="stat-card">
                        <h3>Orders</h3>
                        <div class="stat-value">1.2K</div>
                        <div class="stat-change">+15%</div>
                    </div>
                    <div class="stat-card">
                        <h3>Growth</h3>
                        <div class="stat-value">23%</div>
                        <div class="stat-change">+5%</div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private getPlaceholderCSS(variantId: string): string {
    const baseCSS = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
}

.app-container {
    min-height: 100vh;
}

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

.brand {
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

.hero {
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
    font-weight: bold;
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

.stats {
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
    text-align: center;
}

.stat-card h3 {
    font-size: 0.875rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.stat-change {
    color: #10b981;
    font-weight: 600;
}

@media (max-width: 768px) {
    .nav-menu {
        display: none;
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
`;

    const themeCSS = {
      'v1': `
        .theme-v1 {
            background: linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #00ff88;
        }
        .navbar {
            background: rgba(0, 0, 0, 0.9);
            border-bottom: 1px solid rgba(0, 255, 136, 0.3);
        }
        .btn-primary {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: #000;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        .btn-secondary {
            background: transparent;
            color: #00ff88;
            border: 2px solid #00ff88;
        }
        .stat-card {
            background: rgba(26, 26, 46, 0.8);
            border: 1px solid rgba(0, 255, 136, 0.3);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }
      `,
      'v2': `
        .theme-v2 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .navbar {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
        }
        .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.5);
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `,
      'v3': `
        .theme-v3 {
            background: #f5f5f5;
            color: #000;
        }
        .navbar {
            background: #fff;
            border-bottom: 4px solid #000;
        }
        .btn-primary {
            background: #000;
            color: #fff;
            border: 4px solid #000;
            border-radius: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            box-shadow: 8px 8px 0px 0px #ff6b35;
        }
        .btn-secondary {
            background: #fff;
            color: #000;
            border: 4px solid #000;
            border-radius: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .stat-card {
            background: #fff;
            border: 4px solid #000;
            border-radius: 0;
            box-shadow: 12px 12px 0px 0px #000;
        }
        .hero-title {
            text-transform: uppercase;
            letter-spacing: -2px;
        }
      `,
      'v4': `
        .theme-v4 {
            background: #fff;
            color: #2d3748;
        }
        .navbar {
            background: #fff;
            border-bottom: 1px solid #e2e8f0;
        }
        .btn-primary {
            background: #3182ce;
            color: white;
        }
        .btn-secondary {
            background: transparent;
            color: #3182ce;
            border: 2px solid #3182ce;
        }
        .stat-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `
    };

    return baseCSS + (themeCSS[variantId as keyof typeof themeCSS] || themeCSS['v4']);
  }

  private getPlaceholderJS(): string {
    return `
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add button interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
    
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
`;
  }
}

export const previewer = new PreviewerAgent();