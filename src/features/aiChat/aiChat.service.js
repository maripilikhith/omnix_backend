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
}

export const aiChatService = new AiChatService();
