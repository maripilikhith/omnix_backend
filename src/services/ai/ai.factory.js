import { GeminiProvider } from './gemini.service.js';
import { OpenAIProvider } from './openai.service.js';
import config from '../../config/index.js';

/**
 * Singleton AI provider instances, lazily created.
 */
const providers = {};

/**
 * Create an AI provider instance by name.
 *
 * @param {string} [providerName] - Provider name ('gemini', 'openai')
 * @returns {import('./ai.provider.js').AIProvider}
 */
export function createAIProvider(providerName) {
  const name = providerName || config.ai.defaultProvider;

  switch (name) {
    case 'gemini':
      return new GeminiProvider();
    case 'openai':
      return new OpenAIProvider();
    default:
      throw new Error(`Unknown AI provider: ${name}. Supported: gemini, openai`);
  }
}

/**
 * Get or create a singleton AI provider instance.
 * Reuses existing instances to avoid repeated SDK initialization.
 *
 * @param {string} [providerName]
 * @returns {import('./ai.provider.js').AIProvider}
 */
export function getAIProvider(providerName) {
  const name = providerName || config.ai.defaultProvider;

  if (!providers[name]) {
    providers[name] = createAIProvider(name);
  }

  return providers[name];
}
