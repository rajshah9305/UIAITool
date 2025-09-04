import { Cerebras } from '@cerebras/sdk';
import { ChatCompletionMessageParam } from '@cerebras/sdk/resources/chat/completions';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export async function generateCompletion(messages: ChatCompletionMessageParam[], options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  try {
    const stream = await cerebras.chat.completions.create({
      messages: messages,
      model: options?.model || "llama-4-scout-17b-16e-instruct",
      stream: true,
      max_completion_tokens: options?.maxTokens || 2048,
      temperature: options?.temperature || 0.2,
      top_p: 1,
    });

    let fullContent = "";
    for await (const chunk of stream) {
      fullContent += chunk.choices[0]?.delta?.content || "";
    }
    return fullContent;
  } catch (error) {
    console.error("Error generating completion with Cerebras AI:", error);
    if (error instanceof Error) {
      throw new Error(`Cerebras AI completion failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred during Cerebras AI completion.');
    }
  }
}

export async function generateUI(prompt: string) {
  try {
    const stream = await cerebras.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a UI generator. Generate HTML, CSS, and JavaScript for the requested UI. Provide the code in a JSON object with html, css, and js properties.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-4-scout-17b-16e-instruct',
      stream: true,
      max_completion_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      fullContent += chunk.choices[0]?.delta?.content || '';
    }

    // Attempt to parse the JSON response
    try {
      const parsedContent = JSON.parse(fullContent);
      return parsedContent;
    } catch (jsonError) {
      console.error('Failed to parse JSON from Cerebras AI response:', jsonError);
      console.error('Raw Cerebras AI response:', fullContent);
      throw new Error(`Failed to parse UI code from Cerebras AI. Raw response: ${fullContent}`);
    }

  } catch (error) {
    console.error('Error generating UI with Cerebras AI:', error);
    if (error instanceof Error) {
      throw new Error(`Cerebras AI UI generation failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred during Cerebras AI UI generation.');
    }
  }
}


