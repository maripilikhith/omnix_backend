import { AIProvider } from './ai.provider.js';
import config from '../../config/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Google Gemini AI provider implementation.
 *
 * Note: The actual @google/generative-ai SDK should be installed
 * when you're ready to use AI features:
 *   npm install @google/generative-ai
 */
export class GeminiProvider extends AIProvider {
  constructor() {
    super('gemini');
    this.apiKey = config.ai.gemini.apiKey;
    this.model = config.ai.gemini.model;
    this.maxTokens = config.ai.gemini.maxTokens;
    this.temperature = config.ai.gemini.temperature;
    this.client = null;
  }

  /**
   * Lazy-initialize the Gemini client.
   * The SDK is loaded only when first needed.
   */
  async _getClient() {
    if (this.client) return this.client;

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      // Dynamic import — SDK only loaded when needed
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.client = genAI.getGenerativeModel({ model: this.model });
      logger.info('Gemini AI provider initialized', { model: this.model });
      return this.client;
    } catch (err) {
      logger.error('Failed to initialize Gemini provider', { error: err.message });
      throw err;
    }
  }

  async generateText(prompt, options = {}) {
    const client = await this._getClient();
    const result = await client.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature ?? this.temperature,
      },
    });
    return result.response.text();
  }

  async generateJSON(prompt, _schema, options = {}) {
    const text = await this.generateText(prompt, options);
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1].trim());
  }

  async generateEmbedding(text) {
    if (!this.apiKey) throw new Error('GEMINI_API_KEY is not configured');

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const embeddingModel = genAI.getGenerativeModel({ model: config.ai.embedding.model });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  }
}
