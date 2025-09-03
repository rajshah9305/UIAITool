class CerebrasClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.cerebras.ai/v1';

  constructor() {
    this.apiKey = process.env.CEREBRAS_API_KEY || '';
  }

  async generateCompletion(messages: Array<{role: string, content: string}>, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    if (!this.apiKey) {
      return this.getFallbackResponse(messages);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          model: options?.model || "llama-4-maverick-17b-128e-instruct",
          max_completion_tokens: options?.maxTokens || 4096,
          temperature: options?.temperature || 0.6,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackResponse(messages);
    } catch (error) {
      console.error('Cerebras API error:', error);
      return this.getFallbackResponse(messages);
    }
  }

  async streamCompletion(messages: Array<{role: string, content: string}>, onChunk: (chunk: string) => void) {
    if (!this.apiKey) {
      onChunk(this.getFallbackResponse(messages));
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          model: "llama-4-maverick-17b-128e-instruct",
          stream: true,
          max_completion_tokens: 4096,
          temperature: 0.6,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) onChunk(content);
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Cerebras streaming error:', error);
      onChunk(this.getFallbackResponse(messages));
    }
  }

  private getFallbackResponse(messages: Array<{role: string, content: string}>): string {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Simple fallback responses based on content
    if (lastMessage.includes('color') || lastMessage.includes('style')) {
      return 'I can help you adjust the color scheme and styling. What specific changes would you like to make?';
    }
    
    if (lastMessage.includes('layout') || lastMessage.includes('structure')) {
      return 'I can help restructure the layout and components. What layout changes are you looking for?';
    }
    
    if (lastMessage.includes('export') || lastMessage.includes('download')) {
      return 'I can help you export your design. Which format would you prefer - React, Vue, or vanilla HTML/CSS?';
    }
    
    return 'I understand your request. Let me help you improve your UI design. Could you be more specific about what you\'d like to change?';
  }
}

export const cerebrasClient = new CerebrasClient();