import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TouchStart } from '../types/game';
import { GAME_MODES, GAME_CONFIG } from '../utils/constants';
import {
  createInitialGameState,
  moveSnake,
  changeDirection,
} from '../utils/gameLogic';

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedMode, setSelectedMode] = useState<keyof typeof GAME_MODES>('CLASSIC');
  const [showModeSelection, setShowModeSelection] = useState(true);
  const gameLoopRef = useRef<number>();
  const touchStartRef = useRef<TouchStart | null>(null);

  const startGame = useCallback(() => {
    const modeConfig = GAME_MODES[selectedMode];
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      gameMode: selectedMode,
      speed: Math.round(GAME_CONFIG.INITIAL_SPEED / modeConfig.speedMultiplier),
      timeRemaining: selectedMode === 'SURVIVAL' ? modeConfig.timeLimit : undefined,
      direction: { x: 1, y: 0 }, // Start moving right
    }));
    setShowModeSelection(false);
  }, [selectedMode]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    const currentHighScore = gameState.highScore;
    const newState = createInitialGameState();
    setGameState({
      ...newState,
      highScore: currentHighScore,
    });
    setShowModeSelection(true);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      touchStartRef.current = null;
      return;
    }
    
    let newDirection = gameState.direction;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      newDirection = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else {
      // Vertical swipe
      newDirection = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }
    
    if (gameState.gameStarted && !gameState.gameOver && !gameState.isPaused) {
      setGameState(prev => ({
        ...prev,
        direction: changeDirection(prev.direction, newDirection),
      }));
    }
    
    touchStartRef.current = null;
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused, gameState.direction]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    if (!gameState.gameStarted && !gameState.gameOver) {
      if (event.key === ' ' || event.key === 'Enter') {
        startGame();
        return;
      }
    }

    if (gameState.gameStarted && !gameState.gameOver) {
      if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
        togglePause();
        return;
      }
    }

    if (gameState.gameOver) {
      if (event.key === ' ' || event.key === 'Enter') {
        resetGame();
        return;
      }
    }

    if (!gameState.gameStarted || gameState.gameOver || gameState.isPaused) return;

    let newDirection = gameState.direction;

    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        newDirection = { x: 0, y: -1 };
        break;
      case 'arrowdown':
      case 's':
        newDirection = { x: 0, y: 1 };
        break;
      case 'arrowleft':
      case 'a':
        newDirection = { x: -1, y: 0 };
        break;
      case 'arrowright':
      case 'd':
        newDirection = { x: 1, y: 0 };
        break;
    }

    setGameState(prev => ({
      ...prev,
      direction: changeDirection(prev.direction, newDirection),
    }));
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused, gameState.direction, startGame, resetGame, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyPress, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver && !gameState.isPaused) {
      gameLoopRef.current = window.setInterval(() => {
        setGameState(prev => moveSnake(prev));
      }, gameState.speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused, gameState.speed]);

  return {
    gameState,
    selectedMode,
    showModeSelection,
    setSelectedMode,
    startGame,
    resetGame,
    togglePause,
  };
};