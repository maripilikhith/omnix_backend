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
  async _getClient(overrideModel = null) {
    if (this.client && !overrideModel) return this.client;

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const targetModel = overrideModel || (this.model === 'gemini-2.0-flash' || this.model === 'gemini-1.5-flash' || this.model === 'gemini-1.5-pro' ? 'gemini-2.5-flash' : this.model);
      this.client = genAI.getGenerativeModel({ model: targetModel });
      logger.info('Gemini AI provider initialized', { model: targetModel });
      return this.client;
    } catch (err) {
      logger.error('Failed to initialize Gemini provider', { error: err.message });
      throw err;
    }
  }

  async generateText(prompt, options = {}) {
    const parts = [{ text: prompt }];
    const imageBase64 = options.imageBase64 || options.screenshot_base64 || options.screenshot;
    if (imageBase64 && typeof imageBase64 === 'string') {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/jpeg',
        },
      });
    }

    const fallbackModels = [
      this.model === 'gemini-2.0-flash' || this.model === 'gemini-1.5-flash' ? 'gemini-2.5-flash' : this.model,
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-3.5-flash',
    ];
    // Remove duplicates preserving order
    const modelsToTry = [...new Set(fallbackModels)];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const client = await this._getClient(modelName);
        const result = await client.generateContent({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            maxOutputTokens: options.maxTokens || this.maxTokens,
            temperature: options.temperature ?? this.temperature,
          },
        });
        return result.response.text();
      } catch (err) {
        lastError = err;
        const errMsg = String(err.message || '');
        if (
          errMsg.includes('429') ||
          errMsg.includes('Quota exceeded') ||
          errMsg.includes('limit: 0') ||
          errMsg.includes('not found')
        ) {
          logger.warn(`Gemini model ${modelName} failed with quota/rate-limit. Trying fallback model...`);
          continue;
        }
        throw err;
      }
    }
    throw lastError;
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
