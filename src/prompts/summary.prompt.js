/**
 * Prompt template: Summarize educational content.
 *
 * @param {object} vars
 * @param {string} vars.content - Content to summarize
 * @param {string} [vars.format='paragraph'] - 'paragraph', 'bullets', 'key-points'
 * @param {number} [vars.maxWords=150] - Approximate max word count
 * @returns {string}
 */
export const summaryPrompt = ({ content, format = 'paragraph', maxWords = 150 }) => `
Summarize the following educational content in ${format} format.
Keep it under ${maxWords} words. Focus on key concepts and takeaways.

Content:
${content}

The summary should be clear, accurate, and useful for a student reviewing the material.
`.trim();
