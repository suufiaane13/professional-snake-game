import { Position, GameState } from '../types/game';
import { GAME_CONFIG, GAME_MODES } from './constants';

export const { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, INITIAL_SPEED } = GAME_CONFIG;

export const getStoredHighScore = (): number => {
  const stored = localStorage.getItem('snake-high-score');
  return stored ? parseInt(stored, 10) : 0;
};

export const saveHighScore = (score: number): void => {
  localStorage.setItem('snake-high-score', score.toString());
};

export const createInitialGameState = (): GameState => ({
  snake: [{ x: 10, y: 10 }],
  food: generateFood([{ x: 10, y: 10 }]),
  direction: { x: 0, y: 0 },
  score: 0,
  gameOver: false,
  gameStarted: false,
  isPaused: false,
  highScore: getStoredHighScore(),
  gameMode: 'CLASSIC',
  speed: INITIAL_SPEED,
});

export const generateFood = (snake: Position[]): Position => {
  const maxX = Math.floor(CANVAS_WIDTH / GRID_SIZE);
  const maxY = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
  
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  
  return food;
};

export const moveSnake = (gameState: GameState): GameState => {
  if (gameState.gameOver || !gameState.gameStarted || gameState.isPaused) return gameState;

  const { snake, direction, food } = gameState;
  
  if (direction.x === 0 && direction.y === 0) return gameState;

  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  // Check wall collision
  const maxX = Math.floor(CANVAS_WIDTH / GRID_SIZE);
  const maxY = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
  
  if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
    return { ...gameState, gameOver: true };
  }

  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return { ...gameState, gameOver: true };
  }

  const newSnake = [head, ...snake];

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    const newScore = gameState.score + 1;
    const modeConfig = GAME_MODES[gameState.gameMode];
    const actualScore = gameState.score + modeConfig.scoreMultiplier;
    const newHighScore = Math.max(newScore, gameState.highScore);
    
    // Calculate new speed (progressive difficulty)
    const newSpeed = Math.max(
      GAME_CONFIG.MAX_SPEED,
      gameState.speed - GAME_CONFIG.SPEED_INCREMENT
    );
    
    if (newHighScore > gameState.highScore) {
      saveHighScore(newHighScore);
    }
    
    return {
      ...gameState,
      snake: newSnake,
      food: generateFood(newSnake),
      score: actualScore,
      highScore: newHighScore,
      speed: newSpeed,
    };
  }

  // Remove tail if no food eaten
  newSnake.pop();

  return {
    ...gameState,
    snake: newSnake,
  };
};

export const changeDirection = (
  currentDirection: Position,
  newDirection: Position
): Position => {
  // Prevent reversing into itself
  if (
    (currentDirection.x === 1 && newDirection.x === -1) ||
    (currentDirection.x === -1 && newDirection.x === 1) ||
    (currentDirection.y === 1 && newDirection.y === -1) ||
    (currentDirection.y === -1 && newDirection.y === 1)
  ) {
    return currentDirection;
  }
  
  return newDirection;
};