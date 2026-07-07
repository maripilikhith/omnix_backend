import { AIProvider } from './ai.provider.js';
import config from '../../config/index.js';
import { logger } from '../../utils/logger.js';

/**
 * OpenAI provider implementation.
 *
 * Note: Install the OpenAI SDK when ready:
 *   npm install openai
 */
export class OpenAIProvider extends AIProvider {
  constructor() {
    super('openai');
    this.apiKey = config.ai.openai.apiKey;
    this.model = config.ai.openai.model;
    this.maxTokens = config.ai.openai.maxTokens;
    this.temperature = config.ai.openai.temperature;
    this.client = null;
  }

  async _getClient() {
    if (this.client) return this.client;

    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    try {
      const { default: OpenAI } = await import('openai');
      this.client = new OpenAI({ apiKey: this.apiKey });
      logger.info('OpenAI provider initialized', { model: this.model });
      return this.client;
    } catch (err) {
      logger.error('Failed to initialize OpenAI provider', { error: err.message });
      throw err;
    }
  }

  async generateText(prompt, options = {}) {
    const client = await this._getClient();
    const response = await client.chat.completions.create({
      model: options.model || this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || this.maxTokens,
      temperature: options.temperature ?? this.temperature,
    });
    return response.choices[0]?.message?.content || '';
  }

  async generateJSON(prompt, _schema, options = {}) {
    const client = await this._getClient();
    const response = await client.chat.completions.create({
      model: options.model || this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || this.maxTokens,
      temperature: options.temperature ?? this.temperature,
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0]?.message?.content || '{}');
  }

  async generateEmbedding(text) {
    const client = await this._getClient();
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }
}
