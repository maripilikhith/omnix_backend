/**
 * Abstract AI Provider interface.
 * All LLM providers (Gemini, OpenAI, Claude, etc.) must implement this interface.
 *
 * This ensures controllers and services never depend on a specific LLM —
 * they always go through this abstraction, enabling easy provider swapping.
 */
export class AIProvider {
  constructor(name) {
    this.name = name;
    if (new.target === AIProvider) {
      throw new Error('AIProvider is abstract and cannot be instantiated directly');
    }
  }

  /**
   * Generate a text completion from a prompt.
   * @param {string} prompt - The input prompt
   * @param {object} [options] - Provider-specific options (temperature, maxTokens, etc.)
   * @returns {Promise<string>} Generated text
   */
  async generateText(_prompt, _options = {}) {
    throw new Error(`generateText() not implemented by ${this.name}`);
  }

  /**
   * Generate a streaming text completion.
   * @param {string} prompt
   * @param {object} [options]
   * @returns {AsyncIterable<string>} Stream of text chunks
   */
  async *streamText(_prompt, _options = {}) {
    throw new Error(`streamText() not implemented by ${this.name}`);
  }

  /**
   * Generate a structured JSON response.
   * @param {string} prompt
   * @param {object} schema - Expected JSON schema
   * @param {object} [options]
   * @returns {Promise<object>} Parsed JSON object
   */
  async generateJSON(_prompt, _schema, _options = {}) {
    throw new Error(`generateJSON() not implemented by ${this.name}`);
  }

  /**
   * Generate a text embedding vector.
   * @param {string} text - Input text
   * @returns {Promise<number[]>} Embedding vector
   */
  async generateEmbedding(_text) {
    throw new Error(`generateEmbedding() not implemented by ${this.name}`);
  }

  /**
   * Count tokens in a text string.
   * @param {string} text
   * @returns {Promise<number>} Token count
   */
  async countTokens(_text) {
    throw new Error(`countTokens() not implemented by ${this.name}`);
  }
}
