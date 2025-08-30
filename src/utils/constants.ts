export const GAME_CONFIG = {
  GRID_SIZE: 20,
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 400,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 5,
  MAX_SPEED: 80,
  MIN_SWIPE_DISTANCE: 30,
} as const;

export const GAME_MODES = {
  CLASSIC: {
    name: 'Classic',
    description: 'Traditional Snake gameplay',
    speedMultiplier: 1,
    scoreMultiplier: 1,
  },
  SPEED: {
    name: 'Speed',
    description: 'Faster pace with bonus points',
    speedMultiplier: 1.5,
    scoreMultiplier: 2,
  },
  SURVIVAL: {
    name: 'Survival',
    description: 'Time limit with power-ups',
    speedMultiplier: 1,
    scoreMultiplier: 3,
    timeLimit: 120, // seconds
  },
} as const;

export const COLORS = {
  SNAKE_BODY: '#22c55e',
  SNAKE_HEAD: '#16a34a',
  FOOD: '#ef4444',
  GRID: '#333333',
  BACKGROUND: '#1a1a1a',
  PAUSE_OVERLAY: 'rgba(0, 0, 0, 0.8)',
} as const;

export const AUDIO_CONFIG = {
  EAT_VOLUME: 0.3,
  GAME_OVER_VOLUME: 0.5,
  ACHIEVEMENT_VOLUME: 0.4,
} as const;

export const ACHIEVEMENTS = [
  { id: 'first_food', name: 'First Bite', description: 'Eat your first food', requirement: 1 },
  { id: 'score_10', name: 'Getting Started', description: 'Reach score of 10', requirement: 10 },
  { id: 'score_25', name: 'Snake Master', description: 'Reach score of 25', requirement: 25 },
  { id: 'score_50', name: 'Legendary', description: 'Reach score of 50', requirement: 50 },
  { id: 'no_pause', name: 'Focus Master', description: 'Complete a game without pausing', requirement: 'no_pause' },
] as const;