import React, { useRef, useEffect } from 'react';
import { GameState } from '../types/game';
import { GAME_CONFIG, COLORS } from '../utils/constants';

const { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } = GAME_CONFIG;

interface GameCanvasProps {
  gameState: GameState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw pause overlay
    if (gameState.isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      
      ctx.font = '14px Arial';
      ctx.fillText('Press P or ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      return;
    }

    // Draw grid lines
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = COLORS.SNAKE_BODY;
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      
      // Draw head differently
      if (index === 0) {
        ctx.fillStyle = COLORS.SNAKE_HEAD;
        ctx.fillRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
        ctx.fillStyle = COLORS.SNAKE_BODY;
      }
    });

    // Draw food
    ctx.fillStyle = COLORS.FOOD;
    const foodX = gameState.food.x * GRID_SIZE;
    const foodY = gameState.food.y * GRID_SIZE;
    
    ctx.beginPath();
    ctx.arc(
      foodX + GRID_SIZE / 2,
      foodY + GRID_SIZE / 2,
      (GRID_SIZE - 4) / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-gray-600 rounded-lg bg-gray-900"
    />
  );
};