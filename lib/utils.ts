import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function calculateNovelty(styleSpec: any, existingSpecs: any[]): number {
  // Simple novelty calculation based on color distance and unique features
  let noveltyScore = 0.8 // Base score
  
  // Add points for unique color combinations
  const colors = Object.values(styleSpec.colors) as string[]
  const uniqueColors = new Set(colors)
  noveltyScore += (uniqueColors.size / colors.length) * 0.1
  
  // Add points for unique trend tags
  const uniqueTags = styleSpec.trend_tags.filter((tag: string) => 
    !existingSpecs.some(spec => spec.trend_tags?.includes(tag))
  )
  noveltyScore += (uniqueTags.length / styleSpec.trend_tags.length) * 0.1
  
  return Math.min(noveltyScore, 1.0)
}

export function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}