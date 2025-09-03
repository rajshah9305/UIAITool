'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Download, MessageCircle, Play, Code, Palette, Eye } from 'lucide-react';
import { UIVariant, ChatMessage } from '@/lib/types';
import { PreviewGrid } from '@/components/PreviewGrid';
import { AgentChat } from '@/components/AgentChat';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function MagicUIElite() {
  const [brief, setBrief] = useState('');
  const [variants, setVariants] = useState<UIVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load existing previews on mount
  useEffect(() => {
    loadExistingPreviews();
  }, []);



  const loadExistingPreviews = async () => {
    try {

      // Load existing preview variants
      const mockVariants: UIVariant[] = [
        {
          id: 'variant-1',
          name: 'Retro Futurism',
          description: 'Neon gradients with dark backgrounds and cyberpunk aesthetics',
          code: {
            html: '',
            css: '',
            js: '',
            framework: 'vanilla',
            dependencies: [],
            assets: []
          },
          preview: {
            id: 'v1',
            url: '/api/preview-test?variant=v1',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJldHJvIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZjg4O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwZDRmZjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzBhMGEwYSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIzMCIgZmlsbD0idXJsKCNyZXRybykiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjEwIiB5PSI1MCIgd2lkdGg9Ijg1IiBoZWlnaHQ9IjgwIiBmaWxsPSIjMWExYTJlIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjEwNSIgeT0iNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSI4MCIgZmlsbD0iIzFhMWEyZSIgc3Ryb2tlPSIjMDBmZjg4IiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjkwIiByPSIxNSIgZmlsbD0iIzAwZmY4OCIgb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iOTAiIHI9IjE1IiBmaWxsPSIjMDBkNGZmIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=',
            status: 'ready',
            lastUpdated: new Date().toISOString()
          },
          style: {
            id: 'style-1',
            name: 'Retro Futurism',
            description: 'Cyberpunk aesthetics with neon colors',
            theme: 'retro-futurism',
            colors: {
              primary: '#00ff88',
              secondary: '#ff0080',
              background: '#0a0a0a',
              surface: '#1a1a1a',
              accent: '#00d4ff'
            },
            typography: {
              heading: 'font-bold tracking-tight',
              body: 'font-medium'
            },
            spacing: {
              base: '1rem',
              tight: '0.5rem',
              loose: '2rem'
            },
            components: {
              button: 'bg-gradient-to-r from-green-400 to-blue-500',
              card: 'bg-gray-900/90 border border-green-400/50'
            }
          },
          qaScore: 0.95,
          accessibility: {
            score: 0.9,
            issues: []
          }
        },
        {
          id: 'variant-2',
          name: 'Glass Aurora',
          description: 'Translucent glass effects with aurora-inspired gradients',
          code: {
            html: '',
            css: '',
            js: '',
            framework: 'vanilla',
            dependencies: [],
            assets: []
          },
          preview: {
            id: 'v2',
            url: '/api/preview-test?variant=v2',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImF1cm9yYSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2N2VlYTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9InVybCgjYXVyb3JhKSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIzMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiByeD0iMTUiLz48cmVjdCB4PSIxMCIgeT0iNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSI4MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiByeD0iMTAiLz48cmVjdCB4PSIxMDUiIHk9IjUwIiB3aWR0aD0iODUiIGhlaWdodD0iODAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgcng9IjEwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMTIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjkwIiByPSIxMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PC9zdmc+',
            status: 'ready',
            lastUpdated: new Date().toISOString()
          },
          style: {
            id: 'style-2',
            name: 'Glass Aurora',
            description: 'Translucent glass effects with aurora gradients',
            theme: 'glass-aurora',
            colors: {
              primary: '#667eea',
              secondary: '#764ba2',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              surface: 'rgba(255, 255, 255, 0.1)',
              accent: '#f093fb'
            },
            typography: {
              heading: 'font-light tracking-wide',
              body: 'font-normal'
            },
            spacing: {
              base: '1.25rem',
              tight: '0.75rem',
              loose: '2.5rem'
            },
            components: {
              button: 'bg-white/20 backdrop-blur-md border border-white/30',
              card: 'bg-white/10 backdrop-blur-md border border-white/20'
            }
          },
          qaScore: 0.92,
          accessibility: {
            score: 0.88,
            issues: ['Consider higher contrast for text readability']
          }
        },
        {
          id: 'variant-3',
          name: 'Neo Brutalist',
          description: 'Bold geometric shapes with high contrast and sharp edges',
          code: {
            html: '',
            css: '',
            js: '',
            framework: 'vanilla',
            dependencies: [],
            assets: []
          },
          preview: {
            id: 'v3',
            url: '/api/preview-test?variant=v3',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y1ZjVmNSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjEwIiB5PSI1MCIgd2lkdGg9Ijg1IiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjEwNSIgeT0iNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjQiLz48cmVjdCB4PSIzMCIgeT0iNzAiIHdpZHRoPSI0NSIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmNmIzNSIvPjxyZWN0IHg9IjEyNSIgeT0iNzAiIHdpZHRoPSI0NSIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmNmIzNSIvPjwvc3ZnPg==',
            status: 'ready',
            lastUpdated: new Date().toISOString()
          },
          style: {
            id: 'style-3',
            name: 'Neo Brutalist',
            description: 'Bold geometric shapes with high contrast',
            theme: 'brutalist',
            colors: {
              primary: '#000000',
              secondary: '#ffffff',
              background: '#f5f5f5',
              surface: '#ffffff',
              accent: '#ff6b35'
            },
            typography: {
              heading: 'font-black uppercase tracking-tighter',
              body: 'font-bold'
            },
            spacing: {
              base: '1.5rem',
              tight: '0.25rem',
              loose: '3rem'
            },
            components: {
              button: 'bg-black text-white font-black border-4 border-black',
              card: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
            }
          },
          qaScore: 0.97,
          accessibility: {
            score: 0.95,
            issues: []
          }
        },
        {
          id: 'variant-4',
          name: 'Minimal Mono',
          description: 'Clean monochromatic design with subtle animations',
          code: {
            html: '',
            css: '',
            js: '',
            framework: 'vanilla',
            dependencies: [],
            assets: []
          },
          preview: {
            id: 'v4',
            url: '/api/preview-test?variant=v4',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2Y3ZmFmYyIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMCIgeT0iNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMDUiIHk9IjUwIiB3aWR0aD0iODUiIGhlaWdodD0iODAiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzMxODJjZSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjkwIiByPSI4IiBmaWxsPSIjMzE4MmNlIi8+PC9zdmc+',
            status: 'ready',
            lastUpdated: new Date().toISOString()
          },
          style: {
            id: 'style-4',
            name: 'Minimal Mono',
            description: 'Clean monochromatic design with subtle animations',
            theme: 'minimal-mono',
            colors: {
              primary: '#2d3748',
              secondary: '#4a5568',
              background: '#ffffff',
              surface: '#f7fafc',
              accent: '#3182ce'
            },
            typography: {
              heading: 'font-medium tracking-normal',
              body: 'font-normal'
            },
            spacing: {
              base: '1rem',
              tight: '0.5rem',
              loose: '1.5rem'
            },
            components: {
              button: 'bg-gray-900 text-white font-medium rounded-md',
              card: 'bg-white border border-gray-200 rounded-lg shadow-sm'
            }
          },
          qaScore: 0.98,
          accessibility: {
            score: 0.97,
            issues: []
          }
        }
      ];

      setVariants(mockVariants);
    } catch (error) {
      console.error('Failed to load previews:', error);
    }
  };

  const handleGenerate = async () => {
    if (!brief.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: brief,
          type: 'dashboard',
          requirements: []
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setVariants(data.variants);
      } else {
        console.error('Generation failed:', data.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (variantId: string) => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          options: {
            framework: 'vanilla',
            includePackageJson: true,
            includeDeployment: true
          }
        })
      });

      const data = await response.json();
      
      if (data.success && data.result.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.result.downloadUrl;
        link.download = data.result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleChat = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      variantId: selectedVariant || undefined
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `I understand you want to ${message.toLowerCase()}. Let me help you with that modification.`,
        timestamp: new Date().toISOString(),
        agent: 'architect',
        variantId: selectedVariant || undefined
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Magic UI Elite</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>6 Agents Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}UI Generator
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate stunning UI designs with our multi-agent system. Get 4 unique variants instantly, 
              chat with AI agents to refine your vision, and export production-ready code.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe your UI vision... (e.g., 'Modern dashboard with sidebar, stats cards, and dark theme')"
                className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                onClick={handleGenerate}
                disabled={!brief.trim() || isGenerating}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Generate</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Quick Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              'Modern dashboard with sidebar and stats',
              'Landing page with hero section',
              'E-commerce product grid',
              'Blog layout with cards'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setBrief(example)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Variants Grid */}
        {variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Generated Variants</h3>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowChat(!showChat)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Agent Chat</span>
                </Button>
              </div>
            </div>

            <PreviewGrid
              variants={variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              onExport={handleExport}
            />
          </motion.div>
        )}

        {/* Agent Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50"
            >
              <AgentChat
                messages={chatMessages}
                onSendMessage={handleChat}
                onClose={() => setShowChat(false)}
                selectedVariant={selectedVariant}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white">Live Previews</h4>
            </div>
            <p className="text-gray-300">
              See your designs come to life instantly with 4 simultaneous variant previews and real-time updates.
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <h4 className="text-lg font-semibold text-white">Multi-Agent System</h4>
            </div>
            <p className="text-gray-300">
              Collaborate with specialized AI agents: Architect, Style Curator, Code Generator, QA, and Exporter.
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white">Export Ready</h4>
            </div>
            <p className="text-gray-300">
              One-click export to production-ready projects with React, Vue, Next.js, or vanilla HTML/CSS.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}