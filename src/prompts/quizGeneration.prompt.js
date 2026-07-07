/**
 * Prompt template: Generate quiz questions from content.
 *
 * @param {object} vars
 * @param {string} vars.topic - Topic title
 * @param {string} vars.content - Content to generate questions from
 * @param {number} [vars.count=5] - Number of questions
 * @param {string} [vars.difficulty='Intermediate'] - Difficulty level
 * @returns {string}
 */
export const quizGenerationPrompt = ({ topic, content, count = 5, difficulty = 'Intermediate' }) => `
You are an educational content creator for the Omnix platform.

Generate ${count} multiple-choice quiz questions about "${topic}" at the ${difficulty} level.

Content to base questions on:
${content}

Respond with a JSON array of questions:
[
  {
    "question": "Clear, unambiguous question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this is the correct answer"
  }
]

Guidelines:
- Each question should have exactly 4 options.
- Only one option should be correct.
- Avoid trick questions; focus on understanding.
- Include a mix of recall, understanding, and application questions.
- Make wrong options plausible but clearly distinguishable.
`.trim();
