import { AIProvider } from './ai.provider.js';
import config from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { getAIProvider } from './ai.factory.js';

/**
 * Codex / OpenAI-compatible provider implementation with optional Gemini fallback.
 * Set DISABLE_GEMINI_FALLBACK=false in env to enable automatic fallback to Gemini.
 */
export class CodexProvider extends AIProvider {
  constructor() {
    super('codex');
    this.apiKey = config.ai.codex?.apiKey || config.ai.openai?.apiKey || '';
    this.model = config.ai.codex?.model || 'gpt-5.4-mini';
    this.baseUrl = config.ai.codex?.baseUrl || '';
    this.apiVersion = config.ai.codex?.apiVersion || '2024-08-01-preview';
    this.maxTokens = config.ai.codex?.maxTokens || 4096;
    this.temperature = config.ai.codex?.temperature ?? 0.7;
    this.client = null;
    // Gemini fallback is DISABLED by default. Set DISABLE_GEMINI_FALLBACK=false to enable.
    this.disableFallback = (process.env.DISABLE_GEMINI_FALLBACK ?? 'true') !== 'false';
  }

  async _getClient() {
    if (this.client) return this.client;

    if (!this.apiKey) {
      throw new Error('CODEX_API_KEY is not configured');
    }

    try {
      const { default: OpenAI, AzureOpenAI } = await import('openai');
      if (this.baseUrl && this.baseUrl.includes('.openai.azure.com')) {
        this.client = new AzureOpenAI({
          apiKey: this.apiKey,
          endpoint: this.baseUrl,
          apiVersion: this.apiVersion,
          deployment: this.model,
        });
      } else {
        const clientConfig = { apiKey: this.apiKey };
        if (this.baseUrl) {
          clientConfig.baseURL = this.baseUrl;
        }
        this.client = new OpenAI(clientConfig);
      }
      logger.info('Codex provider initialized', { model: this.model, baseUrl: this.baseUrl || 'default' });
      return this.client;
    } catch (err) {
      logger.error('Failed to initialize Codex provider', { error: err.message });
      throw err;
    }
  }

  _formatUserMessage(prompt, options = {}) {
    const imageBase64 = options.imageBase64 || options.screenshot_base64 || options.screenshot;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return [{ role: 'user', content: prompt }];
    }
    const imageUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;
    return [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ];
  }

  async generateText(prompt, options = {}) {
    try {
      const client = await this._getClient();
      const response = await client.chat.completions.create({
        model: options.model || this.model,
        messages: this._formatUserMessage(prompt, options),
        max_completion_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature ?? this.temperature,
      });
      return response.choices[0]?.message?.content || '';
    } catch (err) {
      if (this.disableFallback) {
        logger.error(`Codex generateText failed: ${err.message}`);
        throw err;
      }
      logger.warn(`Codex generateText failed (${err.message}), falling back to Gemini...`);
      const gemini = getAIProvider('gemini');
      return gemini.generateText(prompt, options);
    }
  }

  async generateJSON(prompt, schema, options = {}) {
    try {
      const client = await this._getClient();
      const response = await client.chat.completions.create({
        model: options.model || this.model,
        messages: this._formatUserMessage(prompt, options),
        max_completion_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature ?? this.temperature,
        response_format: { type: 'json_object' },
      });
      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (err) {
      if (this.disableFallback) {
        logger.error(`Codex generateJSON failed: ${err.message}`);
        throw err;
      }
      logger.warn(`Codex generateJSON failed (${err.message}), falling back to Gemini...`);
      const gemini = getAIProvider('gemini');
      return gemini.generateJSON(prompt, schema, options);
    }
  }

  async generateEmbedding(text) {
    try {
      const client = await this._getClient();
      const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (err) {
      if (this.disableFallback) {
        logger.error(`Codex generateEmbedding failed: ${err.message}`);
        throw err;
      }
      logger.warn(`Codex generateEmbedding failed (${err.message}), falling back to Gemini...`);
      const gemini = getAIProvider('gemini');
      return gemini.generateEmbedding(text);
    }
  }
}

