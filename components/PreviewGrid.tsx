'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Code, Palette } from 'lucide-react';
import { UIVariant } from '@/lib/types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface PreviewGridProps {
  variants: UIVariant[];
  selectedVariant: string | null;
  onSelectVariant: (variantId: string) => void;
  onExport: (variantId: string) => void;
}

export function PreviewGrid({ variants, selectedVariant, onSelectVariant, onExport }: PreviewGridProps) {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);
  const [failedPreviews, setFailedPreviews] = useState<Set<string>>(new Set());

  const handlePreviewError = (variantId: string) => {
    setFailedPreviews(prev => new Set(prev).add(variantId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {variants.map((variant, index) => (
        <motion.div
          key={variant.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <Card 
            className={`bg-white/5 backdrop-blur-md border transition-all duration-300 cursor-pointer ${
              selectedVariant === variant.id 
                ? 'border-purple-500 ring-2 ring-purple-500/20' 
                : 'border-white/10 hover:border-white/20'
            }`}
            onClick={() => onSelectVariant(variant.id)}
            onMouseEnter={() => setHoveredVariant(variant.id)}
            onMouseLeave={() => setHoveredVariant(null)}
          >
            {/* Preview Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{variant.name}</h3>
                  <p className="text-sm text-gray-400">{variant.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>QA: {Math.round(variant.qaScore * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
              {variant.preview.status === 'ready' && !failedPreviews.has(variant.id) ? (
                <iframe
                  src={variant.preview.url}
                  className="w-full h-full border-0"
                  title={`${variant.name} Preview`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  referrerPolicy="no-referrer"
                  onLoad={() => console.log(`Preview ${variant.id} loaded successfully`)}
                  onError={() => {
                    console.error(`Preview ${variant.id} failed to load`);
                    handlePreviewError(variant.id);
                  }}
                />
              ) : failedPreviews.has(variant.id) ? (
                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-800">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">{variant.name}</h3>
                    <p className="text-sm mb-4">{variant.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.entries(variant.style.colors).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: color }}
                          title={`${key}: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Loading preview...</p>
                  </div>
                </div>
              )}
              
              {/* Overlay on hover */}
              {hoveredVariant === variant.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div className="flex space-x-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(variant.preview.url, '_blank');
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport(variant.id);
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Style Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Theme: {variant.style.theme}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{variant.code.framework}</span>
                </div>
              </div>

              {/* Color Palette */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs text-gray-400">Colors:</span>
                <div className="flex space-x-1">
                  {Object.entries(variant.style.colors).slice(0, 4).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accessibility Score */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Accessibility:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 transition-all duration-300"
                        style={{ width: `${variant.accessibility.score * 100}%` }}
                      />
                    </div>
                    <span className="text-green-400">{Math.round(variant.accessibility.score * 100)}%</span>
                  </div>
                </div>
                <span className="text-gray-500">
                  Updated {new Date(variant.preview.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}