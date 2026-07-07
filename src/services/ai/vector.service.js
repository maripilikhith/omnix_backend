/**
 * Vector search service — placeholder for future RAG integration.
 *
 * Will connect to a vector database (Pinecone, Weaviate, ChromaDB, etc.)
 * to perform similarity searches over embedded content.
 *
 * This stub ensures the architecture is ready for RAG features
 * without requiring a vector DB to be set up now.
 */
export class VectorService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the vector store connection.
   * @param {object} _config - Vector DB connection config
   */
  async initialize(_config) {
    // TODO: Connect to vector database
    this.isInitialized = true;
  }

  /**
   * Upsert a document embedding into the vector store.
   * @param {string} _id - Document ID
   * @param {number[]} _embedding - Embedding vector
   * @param {object} _metadata - Associated metadata
   */
  async upsert(_id, _embedding, _metadata = {}) {
    throw new Error('VectorService.upsert() not yet implemented — configure a vector DB first');
  }

  /**
   * Search for similar documents.
   * @param {number[]} _queryEmbedding - Query vector
   * @param {number} [_topK=5] - Number of results
   * @returns {Promise<Array<{ id: string, score: number, metadata: object }>>}
   */
  async search(_queryEmbedding, _topK = 5) {
    throw new Error('VectorService.search() not yet implemented — configure a vector DB first');
  }

  /**
   * Delete a document from the vector store.
   * @param {string} _id
   */
  async delete(_id) {
    throw new Error('VectorService.delete() not yet implemented — configure a vector DB first');
  }
}
