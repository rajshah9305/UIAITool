import { GeneratedCode, UIBrief, QAResult } from '../types';

class QAAgent {
  async validate(code: GeneratedCode, brief: UIBrief): Promise<QAResult> {
    const htmlValidation = this.validateHTML(code.html);
    const cssValidation = this.validateCSS(code.css);
    const jsValidation = this.validateJS(code.js);
    const accessibilityCheck = this.checkAccessibility(code.html, code.css);
    const performanceCheck = this.checkPerformance(code);
    const responsiveCheck = this.checkResponsive(code.css);
    
    const overallScore = this.calculateOverallScore([
      htmlValidation.score,
      cssValidation.score,
      jsValidation.score,
      accessibilityCheck.score,
      performanceCheck.score,
      responsiveCheck.score
    ]);
    
    return {
      score: overallScore,
      accessibility: accessibilityCheck,
      performance: performanceCheck,
      responsive: responsiveCheck,
      validation: {
        html: htmlValidation,
        css: cssValidation,
        js: jsValidation
      },
      recommendations: this.generateRecommendations(code, brief)
    };
  }

  private validateHTML(html: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check for basic HTML structure
    if (!html.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE declaration');
      score -= 0.1;
    }

    if (!html.includes('<html lang=')) {
      issues.push('Missing language attribute on html element');
      score -= 0.1;
    }

    if (!html.includes('<meta charset=')) {
      issues.push('Missing charset meta tag');
      score -= 0.1;
    }

    if (!html.includes('<meta name="viewport"')) {
      issues.push('Missing viewport meta tag');
      score -= 0.1;
    }

    if (!html.includes('<title>')) {
      issues.push('Missing title element');
      score -= 0.1;
    }

    // Check for semantic HTML
    const semanticTags = ['<main>', '<nav>', '<section>', '<article>', '<header>', '<footer>'];
    const foundSemanticTags = semanticTags.filter(tag => html.includes(tag));
    if (foundSemanticTags.length < 2) {
      issues.push('Limited use of semantic HTML elements');
      score -= 0.05;
    }

    // Check for alt attributes on images
    const imgMatches = html.match(/<img[^>]*>/g);
    if (imgMatches) {
      const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='));
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} images missing alt attributes`);
        score -= 0.1;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  private validateCSS(css: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check for CSS reset or normalize
    if (!css.includes('box-sizing: border-box') && !css.includes('* {')) {
      issues.push('Consider adding CSS reset or normalize');
      score -= 0.05;
    }

    // Check for responsive design
    if (!css.includes('@media')) {
      issues.push('No responsive breakpoints found');
      score -= 0.2;
    }

    // Check for accessibility features
    if (!css.includes('focus:') && !css.includes(':focus')) {
      issues.push('Missing focus styles for accessibility');
      score -= 0.1;
    }

    // Check for modern CSS features
    if (css.includes('display: flex') || css.includes('display: grid')) {
      // Good use of modern layout
    } else {
      issues.push('Consider using modern CSS layout methods (flexbox/grid)');
      score -= 0.05;
    }

    // Check for performance issues
    if (css.includes('!important')) {
      issues.push('Avoid using !important declarations');
      score -= 0.05;
    }

    return { score: Math.max(0, score), issues };
  }

  private validateJS(js: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check for modern JavaScript practices
    if (!js.includes('addEventListener')) {
      issues.push('Consider using addEventListener for event handling');
      score -= 0.1;
    }

    // Check for error handling
    if (!js.includes('try') && !js.includes('catch')) {
      issues.push('Consider adding error handling');
      score -= 0.05;
    }

    // Check for accessibility features
    if (!js.includes('keyboard') && !js.includes('keydown') && !js.includes('keyup')) {
      issues.push('Consider adding keyboard navigation support');
      score -= 0.1;
    }

    // Check for performance considerations
    if (js.includes('document.querySelector') && !js.includes('querySelectorAll')) {
      // This is fine, just checking for DOM queries
    }

    return { score: Math.max(0, score), issues };
  }

  private checkAccessibility(html: string, css: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check for ARIA attributes
    const ariaAttributes = ['aria-label', 'aria-labelledby', 'aria-describedby', 'role'];
    const foundAria = ariaAttributes.some(attr => html.includes(attr));
    if (!foundAria) {
      issues.push('Consider adding ARIA attributes for better accessibility');
      score -= 0.1;
    }

    // Check for heading hierarchy
    const headings = html.match(/<h[1-6][^>]*>/g);
    if (headings) {
      const headingLevels = headings.map(h => parseInt(h.charAt(2)));
      if (!headingLevels.includes(1)) {
        issues.push('Missing h1 element for proper heading hierarchy');
        score -= 0.1;
      }
    }

    // Check for color contrast (basic check)
    if (!css.includes('color:') || !css.includes('background')) {
      issues.push('Ensure sufficient color contrast for accessibility');
      score -= 0.05;
    }

    // Check for focus indicators
    if (!css.includes('focus') && !css.includes(':focus')) {
      issues.push('Missing focus indicators for keyboard navigation');
      score -= 0.15;
    }

    // Check for form labels
    if (html.includes('<input') && !html.includes('<label')) {
      issues.push('Form inputs should have associated labels');
      score -= 0.1;
    }

    return { score: Math.max(0, score), issues };
  }

  private checkPerformance(code: GeneratedCode): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check HTML size
    if (code.html.length > 50000) {
      issues.push('HTML file is quite large, consider optimization');
      score -= 0.1;
    }

    // Check CSS size
    if (code.css.length > 100000) {
      issues.push('CSS file is large, consider minification');
      score -= 0.1;
    }

    // Check for inline styles (performance impact)
    const inlineStyles = code.html.match(/style="/g);
    if (inlineStyles && inlineStyles.length > 5) {
      issues.push('Too many inline styles, consider moving to CSS');
      score -= 0.05;
    }

    // Check for optimized images (basic check)
    if (code.html.includes('<img') && !code.html.includes('loading="lazy"')) {
      issues.push('Consider adding lazy loading for images');
      score -= 0.05;
    }

    return { score: Math.max(0, score), issues };
  }

  private checkResponsive(css: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    // Check for media queries
    const mediaQueries = css.match(/@media[^{]+{/g);
    if (!mediaQueries || mediaQueries.length === 0) {
      issues.push('No responsive breakpoints found');
      score -= 0.3;
    } else if (mediaQueries.length < 2) {
      issues.push('Consider adding more responsive breakpoints');
      score -= 0.1;
    }

    // Check for flexible units
    if (!css.includes('rem') && !css.includes('em') && !css.includes('%') && !css.includes('vw') && !css.includes('vh')) {
      issues.push('Consider using flexible units (rem, em, %, vw, vh)');
      score -= 0.1;
    }

    // Check for flexible layouts
    if (!css.includes('flex') && !css.includes('grid')) {
      issues.push('Consider using flexible layout methods');
      score -= 0.1;
    }

    return { score: Math.max(0, score), issues };
  }

  private calculateOverallScore(scores: number[]): number {
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 100) / 100;
  }

  private generateRecommendations(code: GeneratedCode, brief: UIBrief): string[] {
    const recommendations: string[] = [];

    // Performance recommendations
    recommendations.push('Minify CSS and JavaScript for production');
    recommendations.push('Optimize images and use appropriate formats (WebP, AVIF)');
    recommendations.push('Consider implementing a Content Security Policy');

    // Accessibility recommendations
    recommendations.push('Test with screen readers and keyboard navigation');
    recommendations.push('Validate color contrast ratios meet WCAG guidelines');
    recommendations.push('Add skip navigation links for better accessibility');

    // SEO recommendations
    recommendations.push('Add meta description and Open Graph tags');
    recommendations.push('Implement structured data markup');
    recommendations.push('Ensure proper heading hierarchy');

    // Modern web recommendations
    recommendations.push('Consider implementing Progressive Web App features');
    recommendations.push('Add error boundaries and loading states');
    recommendations.push('Implement proper caching strategies');

    return recommendations;
  }

  async auditAccessibility(html: string): Promise<{ score: number; violations: any[] }> {
    // Simplified accessibility audit
    const violations: any[] = [];
    let score = 1.0;

    // Check for common accessibility issues
    if (!html.includes('alt=')) {
      violations.push({
        rule: 'image-alt',
        description: 'Images must have alternate text',
        impact: 'critical'
      });
      score -= 0.2;
    }

    if (!html.includes('<h1')) {
      violations.push({
        rule: 'page-has-heading-one',
        description: 'Page must contain a level-one heading',
        impact: 'moderate'
      });
      score -= 0.1;
    }

    return { score: Math.max(0, score), violations };
  }

  async validateSEO(html: string): Promise<{ score: number; issues: string[] }> {
    const issues: string[] = [];
    let score = 1.0;

    if (!html.includes('<title>')) {
      issues.push('Missing title tag');
      score -= 0.2;
    }

    if (!html.includes('meta name="description"')) {
      issues.push('Missing meta description');
      score -= 0.15;
    }

    if (!html.includes('<h1')) {
      issues.push('Missing H1 tag');
      score -= 0.1;
    }

    return { score: Math.max(0, score), issues };
  }
}

export const qa = new QAAgent();