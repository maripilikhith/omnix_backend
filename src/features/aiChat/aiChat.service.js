import { logger } from '../../utils/logger.js';
import { getAIProvider } from '../../services/ai/index.js';
import { PromptService } from '../../services/ai/prompt.service.js';

export class AiChatService {
  constructor() {
    this.ai = getAIProvider();
    this.promptService = new PromptService();
  }

  async chat(userMessage, context = {}) {
    const prompt = this.promptService.build('videoChat', {
      videoTitle: context.videoTitle || 'Unknown',
      transcript: context.transcript || '',
      userMessage,
      conversationHistory: context.history || '',
    });
    return this.ai.generateText(prompt);
  }

  /**
   * Resolve an interactive video query (paused video question).
   * Replicates Python query_resolver route.
   *
   * @param {string} context - Video context description
   * @param {string} question - Student's question
   * @param {string} [screenshot] - Optional base64 image screenshot
   * @returns {Promise<{answer: string}>}
   */
  async resolveQuery({ context = '', question = '', screenshot = null }) {
    const prompt = this.promptService.build('queryResolver', {
      context,
      question,
    });

    try {
      const parsedJson = await this.ai.generateJSON(prompt, null, {
        temperature: 0.3,
        imageBase64: screenshot,
      });

      return {
        answer: parsedJson.answer || 'I am ready to help! Could you ask your question again?',
      };
    } catch (err) {
      logger.error(`AiChatService resolveQuery failed: ${err.message}`);

      // If it's a known API error, propagate it
      if (err.status || err.statusCode || err.message.includes('40')) {
        return {
          answer: `AI Service Error: ${err.message}. Please check your API keys and model deployment names.`,
        };
      }

      // Fallback to plain text generation if JSON parsing fails
      try {
        const text = await this.ai.generateText(prompt, {
          temperature: 0.3,
          imageBase64: screenshot,
        });
        return {
          answer: text.trim(),
        };
      } catch (fallbackErr) {
        return {
          answer: `AI Chat Failed: ${fallbackErr.message}`,
        };
      }
    }
  }
}

export const aiChatService = new AiChatService();
