/**
 * Game-specific constants.
 */
export const GAME_CONSTANTS = Object.freeze({
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CONCEPTS: 20,
  DEFAULT_XP_REWARD: 300,
  DEFAULT_ESTIMATED_MINUTES: 5,
});

/**
 * Available game types — maps to gameagent template IDs.
 */
export const GAME_TYPES = Object.freeze([
  'blueprint-builder',
  'breakout-brain',
  'bridge-builder',
  'circuit-connect',
  'code-breaker',
  'concept-catcher',
  'decision-tree',
  'defense-grid',
  'equation-balancer',
  'flight-navigator',
  'flight-simulator-2',
  'frogger-facts',
  'gravity-puzzle',
  'lab-experiment',
  'map-conquest',
  'maze-runner',
  'memory-matrix',
  'meteor-defense',
  'molecule-builder',
  'orbit-launcher',
  'pac-collect',
  'pixel-painter',
  'platformer-quiz',
  'rapid-fire',
  'runner-dash',
  'snake-scholar',
  'space-invaders',
  'speed-sorter',
  'story-remix',
  'timeline-arranger',
  'tower-builder',
  'word-forge',
  'world-simulator',
]);
