/**
 * Prompt template: Evaluate a student's answer.
 *
 * @param {object} vars
 * @param {string} vars.question - The original question
 * @param {string} vars.correctAnswer - The expected correct answer
 * @param {string} vars.studentAnswer - The student's submitted answer
 * @param {string} [vars.topic] - Topic context
 * @returns {string} Formatted prompt
 */
export const evaluateAnswerPrompt = ({ question, correctAnswer, studentAnswer, topic = '' }) => `
You are an expert educational evaluator for the Omnix learning platform.

${topic ? `Topic: ${topic}` : ''}

Question: ${question}

Expected Answer: ${correctAnswer}

Student's Answer: ${studentAnswer}

Evaluate the student's answer and respond with a JSON object:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "Encouraging, constructive feedback explaining what was right/wrong",
  "explanation": "Brief explanation of the correct answer if the student was wrong"
}

Be encouraging and constructive. Focus on learning, not just correctness.
`.trim();
