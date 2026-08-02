/**
 * AI provider configuration.
 */
export const aiConfig = Object.freeze({
  defaultProvider: process.env.AI_DEFAULT_PROVIDER || 'codex',
  codex: {
    apiKey: process.env.CODEX_API_KEY || process.env.OPENAI_API_KEY || '',
    model: process.env.CODEX_MODEL || 'gpt-5.4-mini',
    baseUrl: process.env.CODEX_BASE_URL || '',
    apiVersion: process.env.CODEX_API_VERSION || '2024-08-01-preview',
    maxTokens: parseInt(process.env.CODEX_MAX_TOKENS, 10) || 4096,
    temperature: parseFloat(process.env.CODEX_TEMPERATURE) || 0.7,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS, 10) || 8192,
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 4096,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
  },
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || 'gemini',
    model: process.env.EMBEDDING_MODEL || 'text-embedding-004',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS, 10) || 768,
  },
});
