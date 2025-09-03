import { UIVariant, ExportOptions, ExportResult } from '../types';
import JSZip from 'jszip';

class ExporterAgent {
  async exportVariant(variant: UIVariant, options: ExportOptions = {}): Promise<ExportResult> {
    try {
      const zip = new JSZip();
      
      // Create project structure
      await this.createProjectStructure(zip, variant, options);
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      return {
        success: true,
        downloadUrl: URL.createObjectURL(zipBlob),
        filename: `${variant.name.toLowerCase().replace(/\s+/g, '-')}-export.zip`,
        size: zipBlob.size,
        files: this.getFileList(variant, options)
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: `Export failed: ${error}`,
        downloadUrl: '',
        filename: '',
        size: 0,
        files: []
      };
    }
  }

  private async createProjectStructure(zip: JSZip, variant: UIVariant, options: ExportOptions): Promise<void> {
    const projectName = variant.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create main files
    zip.file('index.html', this.generateIndexHTML(variant, options));
    zip.file('styles.css', variant.code.css);
    zip.file('script.js', variant.code.js);
    
    // Create package.json for npm projects
    if (options.includePackageJson !== false) {
      zip.file('package.json', this.generatePackageJson(projectName, variant));
    }
    
    // Create README
    zip.file('README.md', this.generateReadme(variant, options));
    
    // Create additional configuration files
    if (options.framework === 'react') {
      await this.addReactFiles(zip, variant);
    } else if (options.framework === 'vue') {
      await this.addVueFiles(zip, variant);
    } else if (options.framework === 'next') {
      await this.addNextJSFiles(zip, variant);
    }
    
    // Add deployment files
    if (options.includeDeployment !== false) {
      zip.file('vercel.json', this.generateVercelConfig());
      zip.file('.gitignore', this.generateGitignore());
    }
    
    // Add development tools
    if (options.includeDev !== false) {
      zip.file('.eslintrc.json', this.generateESLintConfig());
      zip.file('prettier.config.js', this.generatePrettierConfig());
    }
  }

  private generateIndexHTML(variant: UIVariant, options: ExportOptions): string {
    const title = options.title || variant.name;
    const description = options.description || variant.description;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="author" content="Magic UI Elite">
    <title>${title}</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    ${this.extractBodyContent(variant.code.html)}
    
    <!-- Scripts -->
    <script src="script.js"></script>
    
    <!-- Analytics (replace with your tracking code) -->
    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script> -->
</body>
</html>`;
  }

  private extractBodyContent(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : html;
  }

  private generatePackageJson(projectName: string, variant: UIVariant): string {
    return JSON.stringify({
      name: projectName,
      version: '1.0.0',
      description: variant.description,
      main: 'index.html',
      scripts: {
        start: 'npx serve .',
        dev: 'npx live-server .',
        build: 'echo "Static build complete"',
        deploy: 'vercel --prod'
      },
      keywords: [
        'ui',
        'frontend',
        'magic-ui-elite',
        variant.style.theme
      ],
      author: 'Magic UI Elite',
      license: 'MIT',
      devDependencies: {
        'live-server': '^1.2.2',
        'serve': '^14.2.0'
      }
    }, null, 2);
  }

  private generateReadme(variant: UIVariant, options: ExportOptions): string {
    const projectName = variant.name;
    
    return `# ${projectName}

${variant.description}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies (optional)
npm install

# Start development server
npm run dev

# Or serve directly
npx serve .
\`\`\`

## 📁 Project Structure

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
└── README.md          # This file
\`\`\`

## 🎨 Theme: ${variant.style.name}

${variant.style.description}

### Color Palette
- Primary: \`${variant.style.colors.primary}\`
- Secondary: \`${variant.style.colors.secondary}\`
- Background: \`${variant.style.colors.background}\`
- Surface: \`${variant.style.colors.surface}\`
- Accent: \`${variant.style.colors.accent}\`

## 🛠️ Customization

### Colors
Update the CSS custom properties in \`styles.css\`:

\`\`\`css
:root {
    --primary: ${variant.style.colors.primary};
    --secondary: ${variant.style.colors.secondary};
    --background: ${variant.style.colors.background};
    --surface: ${variant.style.colors.surface};
    --accent: ${variant.style.colors.accent};
}
\`\`\`

### Typography
The project uses Inter font family. You can change it by updating the font imports in \`index.html\` and the CSS font-family declarations.

### Layout
The layout is fully responsive and uses modern CSS Grid and Flexbox. Modify the grid templates and flex properties in \`styles.css\` to adjust the layout.

## 📱 Responsive Design

This design is optimized for:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## ♿ Accessibility

This project includes:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run deploy
\`\`\`

### Netlify
1. Drag and drop the project folder to Netlify
2. Or connect your Git repository

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Generated with [Magic UI Elite](https://github.com/yourusername/magic-ui-elite) - AI-powered UI generator.
`;
  }

  private async addReactFiles(zip: JSZip, variant: UIVariant): Promise<void> {
    // Add React-specific files
    zip.file('src/App.jsx', this.generateReactApp(variant));
    zip.file('src/index.js', this.generateReactIndex());
    zip.file('src/App.css', variant.code.css);
    
    // Update package.json for React
    const reactPackageJson = {
      name: variant.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1'
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      }
    };
    
    zip.file('package.json', JSON.stringify(reactPackageJson, null, 2));
  }

  private generateReactApp(variant: UIVariant): string {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      ${this.convertHTMLToJSX(variant.code.html)}
    </div>
  );
}

export default App;`;
  }

  private generateReactIndex(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private convertHTMLToJSX(html: string): string {
    // Basic HTML to JSX conversion
    return html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2 />');
  }

  private async addVueFiles(zip: JSZip, variant: UIVariant): Promise<void> {
    // Add Vue-specific files
    zip.file('src/App.vue', this.generateVueApp(variant));
    zip.file('src/main.js', this.generateVueMain());
    
    const vuePackageJson = {
      name: variant.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        vue: '^3.3.0'
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^4.4.0',
        vite: '^4.4.5'
      }
    };
    
    zip.file('package.json', JSON.stringify(vuePackageJson, null, 2));
    zip.file('vite.config.js', this.generateViteConfig());
  }

  private generateVueApp(variant: UIVariant): string {
    return `<template>
  ${this.extractBodyContent(variant.code.html)}
</template>

<script>
export default {
  name: 'App',
  mounted() {
    ${variant.code.js}
  }
}
</script>

<style>
${variant.code.css}
</style>`;
  }

  private generateVueMain(): string {
    return `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`;
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`;
  }

  private async addNextJSFiles(zip: JSZip, variant: UIVariant): Promise<void> {
    // Add Next.js specific files
    zip.file('pages/index.js', this.generateNextIndex(variant));
    zip.file('pages/_app.js', this.generateNextApp());
    zip.file('styles/globals.css', variant.code.css);
    
    const nextPackageJson = {
      name: variant.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '14.0.0',
        react: '^18',
        'react-dom': '^18'
      },
      devDependencies: {
        eslint: '^8',
        'eslint-config-next': '14.0.0'
      }
    };
    
    zip.file('package.json', JSON.stringify(nextPackageJson, null, 2));
    zip.file('next.config.js', this.generateNextConfig());
  }

  private generateNextIndex(variant: UIVariant): string {
    return `import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>${variant.name}</title>
        <meta name="description" content="${variant.description}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        ${this.convertHTMLToJSX(this.extractBodyContent(variant.code.html))}
      </main>
    </>
  )
}`;
  }

  private generateNextApp(): string {
    return `import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}`;
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`;
  }

  private generateVercelConfig(): string {
    return JSON.stringify({
      version: 2,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/static-build'
        }
      ]
    }, null, 2);
  }

  private generateGitignore(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
/build
/dist
/.next/
/out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Logs
logs
*.log

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;
  }

  private generateESLintConfig(): string {
    return JSON.stringify({
      extends: ['next/core-web-vitals'],
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn'
      }
    }, null, 2);
  }

  private generatePrettierConfig(): string {
    return `module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
};`;
  }

  private getFileList(variant: UIVariant, options: ExportOptions): string[] {
    const files = [
      'index.html',
      'styles.css',
      'script.js',
      'README.md'
    ];

    if (options.includePackageJson !== false) {
      files.push('package.json');
    }

    if (options.includeDeployment !== false) {
      files.push('vercel.json', '.gitignore');
    }

    if (options.includeDev !== false) {
      files.push('.eslintrc.json', 'prettier.config.js');
    }

    return files;
  }

  async exportAsZip(variants: UIVariant[]): Promise<ExportResult> {
    try {
      const zip = new JSZip();
      
      // Create a folder for each variant
      for (const variant of variants) {
        const folderName = variant.name.toLowerCase().replace(/\s+/g, '-');
        const folder = zip.folder(folderName);
        
        if (folder) {
          folder.file('index.html', this.generateIndexHTML(variant, {}));
          folder.file('styles.css', variant.code.css);
          folder.file('script.js', variant.code.js);
          folder.file('README.md', this.generateReadme(variant, {}));
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      return {
        success: true,
        downloadUrl: URL.createObjectURL(zipBlob),
        filename: 'magic-ui-elite-variants.zip',
        size: zipBlob.size,
        files: variants.map(v => v.name)
      };
    } catch (error) {
      return {
        success: false,
        error: `Multi-variant export failed: ${error}`,
        downloadUrl: '',
        filename: '',
        size: 0,
        files: []
      };
    }
  }
}

export const exporter = new ExporterAgent();