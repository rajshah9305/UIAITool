export interface UIBrief {
  description: string;
  type?: string;
  requirements?: string[];
}

export interface UIVariant {
  id: string;
  name: string;
  description: string;
  code: GeneratedCode;
  preview: PreviewData;
  style: StyleVariant;
  qaScore: number;
  accessibility: AccessibilityResult;
}

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
  framework: 'vanilla' | 'react' | 'vue' | 'svelte' | 'next';
  dependencies: string[];
  assets: string[];
}

export interface PreviewData {
  id: string;
  url: string;
  thumbnail: string;
  status: 'generating' | 'ready' | 'error';
  lastUpdated: string;
  files?: {
    html: string;
    css: string;
    js: string;
  };
}

export interface StyleVariant {
  id: string;
  name: string;
  description: string;
  theme: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, string>;
  animations?: string[];
  responsive?: Record<string, string>;
}

export interface AccessibilityResult {
  score: number;
  issues: string[];
}

export interface AgentResponse<T = any> {
  agent: string;
  success: boolean;
  data?: T;
  error?: string;
  reasoning?: string;
}

export interface UIStructure {
  type: string;
  layout: string;
  components: Array<{
    name: string;
    type: string;
    props: any;
  }>;
  navigation: {
    type: string;
    items: string[];
    mobile: boolean;
  };
  responsive: boolean;
  accessibility: {
    level: string;
    features: string[];
  };
}

export interface QAResult {
  score: number;
  accessibility: AccessibilityResult;
  performance: {
    score: number;
    issues: string[];
  };
  responsive: {
    score: number;
    issues: string[];
  };
  validation: {
    html: { score: number; issues: string[] };
    css: { score: number; issues: string[] };
    js: { score: number; issues: string[] };
  };
  recommendations: string[];
}

export interface ExportOptions {
  framework?: 'vanilla' | 'react' | 'vue' | 'next';
  includePackageJson?: boolean;
  includeDeployment?: boolean;
  includeDev?: boolean;
  title?: string;
  description?: string;
}

export interface ExportResult {
  success: boolean;
  downloadUrl: string;
  filename: string;
  size: number;
  files: string[];
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: string;
  agent?: string;
  variantId?: string;
}

export interface AgentChatResponse {
  message: string;
  suggestions?: string[];
  actions?: {
    type: 'update-variant' | 'generate-new' | 'export';
    payload: any;
  }[];
}

// Legacy types for backward compatibility
export interface UISchema {
  page_type: string;
  title: string;
  sections: Section[];
  states: string[];
  accessibility_notes: string[];
}

export interface Section {
  id: string;
  type: string;
  layout?: {
    grid: string;
    breakpoints: Record<string, number>;
  };
  components: Component[];
}

export interface Component {
  type: string;
  id?: string;
  content?: string;
  level?: number;
  width?: string;
  label?: string;
  columns?: number;
  items?: Component[];
  components?: Component[];
}

export interface StyleSpec {
  style_name: string;
  novelty_score: number;
  trend_tags: string[];
  colors: {
    bg: string;
    surface: string;
    text: string;
    primary: string;
    accent: string;
    muted: string;
  };
  typography: {
    font_heading: string;
    font_body: string;
    scale: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    unit: string;
    sectionY: string;
  };
  shadows: {
    e1: string;
  };
  effects: string[];
  component_variants: Record<string, string>;
  a11y: {
    min_contrast: string;
  };
}

export interface Variant {
  id: string;
  name: string;
  preview: string;
  style: string;
  novelty: number;
  style_spec?: StyleSpec;
  ui_schema?: UISchema;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  active: boolean;
}