import { logger } from '../../utils/logger.js';

/**
 * Embedding service — generates and manages text embeddings.
 * Future integration point for vector databases (Pinecone, Weaviate, etc.)
 *
 * Currently delegates to the configured AI provider's embedding method.
 */
export class EmbeddingService {
  /**
   * @param {import('./ai.provider.js').AIProvider} provider
   */
  constructor(provider) {
    this.provider = provider;
  }

  /**
   * Generate an embedding vector for a single text.
   * @param {string} text
   * @returns {Promise<number[]>}
   */
  async embed(text) {
    logger.debug('Generating embedding', { textLength: text.length });
    return this.provider.generateEmbedding(text);
  }

  /**
   * Generate embeddings for multiple texts.
   * @param {string[]} texts
   * @returns {Promise<number[][]>}
   */
  async embedBatch(texts) {
    logger.debug('Generating batch embeddings', { count: texts.length });
    return Promise.all(texts.map((t) => this.provider.generateEmbedding(t)));
  }
}
