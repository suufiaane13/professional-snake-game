import { describe, it, expect, beforeEach } from 'vitest';
import { 
  generateFood, 
  moveSnake, 
  changeDirection, 
  createInitialGameState 
} from '../utils/gameLogic';
import { GameState, Position } from '../types/game';

describe('Game Logic', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createInitialGameState();
  });

  describe('generateFood', () => {
    it('should generate food not on snake body', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
      ];
      
      const food = generateFood(snake);
      
      expect(snake.some(segment => 
        segment.x === food.x && segment.y === food.y
      )).toBe(false);
    });

    it('should generate food within bounds', () => {
      const food = generateFood([{ x: 10, y: 10 }]);
      
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(20);
      expect(food.y).toBeLessThan(20);
    });
  });

  describe('changeDirection', () => {
    it('should prevent reversing into snake body', () => {
      const currentDirection = { x: 1, y: 0 }; // Moving right
      const oppositeDirection = { x: -1, y: 0 }; // Moving left
      
      const result = changeDirection(currentDirection, oppositeDirection);
      
      expect(result).toEqual(currentDirection);
    });

    it('should allow perpendicular direction changes', () => {
      const currentDirection = { x: 1, y: 0 }; // Moving right
      const newDirection = { x: 0, y: 1 }; // Moving down
      
      const result = changeDirection(currentDirection, newDirection);
      
      expect(result).toEqual(newDirection);
    });
  });

  describe('moveSnake', () => {
    it('should not move when game not started', () => {
      const initialState = { ...gameState, gameStarted: false };
      const result = moveSnake(initialState);
      
      expect(result).toEqual(initialState);
    });

    it('should detect wall collision', () => {
      const state = {
        ...gameState,
        gameStarted: true,
        snake: [{ x: 19, y: 10 }],
        direction: { x: 1, y: 0 }
      };
      
      const result = moveSnake(state);
      
      expect(result.gameOver).toBe(true);
    });

    it('should detect self collision', () => {
      const state = {
        ...gameState,
        gameStarted: true,
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 4 },
          { x: 4, y: 4 },
          { x: 5, y: 4 }
        ],
        direction: { x: 0, y: 1 }
      };
      
      const result = moveSnake(state);
      
      expect(result.gameOver).toBe(true);
    });

    it('should grow snake when eating food', () => {
      const state = {
        ...gameState,
        gameStarted: true,
        snake: [{ x: 5, y: 5 }],
        food: { x: 6, y: 5 },
        direction: { x: 1, y: 0 },
        score: 0
      };
      
      const result = moveSnake(state);
      
      expect(result.snake.length).toBe(2);
      expect(result.score).toBeGreaterThan(0);
    });
  });
});