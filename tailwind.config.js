/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './public/previews/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'elite-bg': 'var(--color-bg)',
        'elite-surface': 'var(--color-surface)',
        'elite-surface-elevated': 'var(--color-surface-elevated)',
        'elite-primary': 'var(--color-primary)',
        'elite-accent': 'var(--color-accent)',
        'elite-text': 'var(--color-text)',
        'elite-text-secondary': 'var(--color-text-secondary)',
        'elite-text-muted': 'var(--color-text-muted)',
        'elite-success': 'var(--color-success)',
        'elite-warning': 'var(--color-warning)',
        'elite-error': 'var(--color-error)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'elite-xs': 'var(--radius-xs)',
        'elite-sm': 'var(--radius-sm)',
        'elite-md': 'var(--radius-md)',
        'elite-lg': 'var(--radius-lg)',
        'elite-xl': 'var(--radius-xl)',
        'elite-full': 'var(--radius-full)',
      },
      spacing: {
        'elite-xs': 'var(--space-xs)',
        'elite-sm': 'var(--space-sm)',
        'elite-md': 'var(--space-md)',
        'elite-lg': 'var(--space-lg)',
        'elite-xl': 'var(--space-xl)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { 'box-shadow': '0 0 20px var(--color-primary)' },
          'to': { 'box-shadow': '0 0 30px var(--color-primary), 0 0 40px var(--color-primary)' },
        },
      },
    },
  },
  plugins: [],
}