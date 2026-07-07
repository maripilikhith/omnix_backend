import { prompts } from '../../prompts/index.js';

/**
 * Prompt service — retrieves and interpolates prompt templates.
 *
 * Keeps prompt management centralized. Services call this instead
 * of constructing prompts directly.
 *
 * Usage:
 *   const prompt = promptService.build('evaluateAnswer', {
 *     question: 'What is photosynthesis?',
 *     answer: 'The process by which plants make food',
 *   });
 */
export class PromptService {
  /**
   * Get a raw prompt template by name.
   * @param {string} name - Prompt template name
   * @returns {Function} Prompt builder function
   */
  getTemplate(name) {
    const template = prompts[name];
    if (!template) {
      throw new Error(`Prompt template '${name}' not found. Available: ${Object.keys(prompts).join(', ')}`);
    }
    return template;
  }

  /**
   * Build a prompt by interpolating variables into a template.
   * @param {string} name - Prompt template name
   * @param {object} variables - Variables to inject into the template
   * @returns {string} Interpolated prompt string
   */
  build(name, variables = {}) {
    const template = this.getTemplate(name);
    return template(variables);
  }

  /**
   * List all available prompt templates.
   * @returns {string[]}
   */
  listTemplates() {
    return Object.keys(prompts);
  }
}
