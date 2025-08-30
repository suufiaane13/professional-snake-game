export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  isPaused: boolean;
  highScore: number;
  gameMode: 'CLASSIC' | 'SPEED' | 'SURVIVAL';
  timeRemaining?: number;
  speed: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TouchStart {
  x: number;
  y: number;
}