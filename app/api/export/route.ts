import { NextRequest, NextResponse } from 'next/server';
import { exporter } from '@/lib/agents/exporter';
import { ExportOptions } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, options = {} } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    const variant = await getVariantById(variantId);
    
    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    const exportOptions: ExportOptions = {
      framework: options.framework || 'vanilla',
      includePackageJson: options.includePackageJson !== false,
      includeDeployment: options.includeDeployment !== false,
      includeDev: options.includeDev !== false,
      title: options.title,
      description: options.description
    };

    const result = await exporter.exportVariant(variant, exportOptions);

    return NextResponse.json({
      success: result.success,
      result
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to export variant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getVariantById(variantId: string) {
  const mockVariants = {
    'variant-1': {
      id: 'variant-1',
      name: 'Retro Futurism',
      description: 'Neon gradients with dark backgrounds and cyberpunk aesthetics',
      code: {
        html: `<!DOCTYPE html><html><head><title>Retro Dashboard</title></head><body><h1>Welcome to the Future</h1></body></html>`,
        css: `body { background: #0a0a0a; color: #00ff88; }`,
        js: `console.log('Retro Futurism loaded');`,
        framework: 'vanilla' as const,
        dependencies: [],
        assets: []
      },
      preview: {
        id: 'variant-1',
        url: '/previews/v1/index.html',
        thumbnail: '',
        status: 'ready' as const,
        lastUpdated: new Date().toISOString()
      },
      style: {
        id: 'style-1',
        name: 'Retro Futurism',
        description: 'Neon gradients with dark backgrounds',
        theme: 'retro-futurism',
        colors: { primary: '#00ff88', secondary: '#ff0080', background: '#0a0a0a' },
        typography: { heading: 'font-bold', body: 'font-medium' },
        spacing: { base: '1rem', tight: '0.5rem' },
        components: { button: 'bg-gradient-to-r', card: 'bg-gray-900' }
      },
      qaScore: 0.95,
      accessibility: { score: 0.9, issues: [] }
    }
  };

  return mockVariants[variantId as keyof typeof mockVariants] || null;
}

export async function GET() {
  return NextResponse.json({
    message: 'Magic UI Elite Export API',
    options: {
      framework: ['vanilla', 'react', 'vue', 'next'],
      includePackageJson: 'boolean (default: true)',
      includeDeployment: 'boolean (default: true)',
      includeDev: 'boolean (default: true)'
    }
  });
}