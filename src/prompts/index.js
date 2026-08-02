import { evaluateAnswerPrompt } from './evaluateAnswer.prompt.js';
import { videoChatPrompt } from './videoChat.prompt.js';
import { quizGenerationPrompt } from './quizGeneration.prompt.js';
import { summaryPrompt } from './summary.prompt.js';
import { storyNarrationPrompt } from './storyNarration.prompt.js';
import { queryResolverPrompt } from './queryResolver.prompt.js';

/**
 * Centralized prompt registry.
 * Each prompt is a function that accepts variables and returns a formatted string.
 */
export const prompts = {
  evaluateAnswer: evaluateAnswerPrompt,
  videoChat: videoChatPrompt,
  quizGeneration: quizGenerationPrompt,
  summary: summaryPrompt,
  storyNarration: storyNarrationPrompt,
  queryResolver: queryResolverPrompt,
};
