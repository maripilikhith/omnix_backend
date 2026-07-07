/**
 * Prompt template: Generate a narrative story for a topic.
 *
 * @param {object} vars
 * @param {string} vars.topic - Topic title
 * @param {string} vars.concepts - Key concepts to weave into the story
 * @param {string} [vars.style='cinematic'] - Narrative style
 * @param {string} [vars.audience='college students'] - Target audience
 * @returns {string}
 */
export const storyNarrationPrompt = ({ topic, concepts, style = 'cinematic', audience = 'college students' }) => `
You are a creative writer for the Omnix educational platform.

Create a ${style} narrative that teaches "${topic}" to ${audience}.

Key concepts to include:
${concepts}

Guidelines:
- Make the story engaging and immersive.
- Weave educational concepts naturally into the narrative.
- Use vivid descriptions and relatable characters.
- Keep scientific/technical accuracy.
- The story should make complex ideas feel intuitive.
- Aim for 500-800 words.
`.trim();
