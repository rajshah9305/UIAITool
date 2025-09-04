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
        thumbnail: '',
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
