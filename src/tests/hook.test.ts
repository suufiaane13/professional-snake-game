import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { useGameStats } from '../hooks/useGameStats';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useSnakeGame Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSnakeGame());
    
    expect(result.current.gameState.gameStarted).toBe(false);
    expect(result.current.gameState.gameOver).toBe(false);
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.showModeSelection).toBe(true);
  });

  it('should start game correctly', () => {
    const { result } = renderHook(() => useSnakeGame());
    
    act(() => {
      result.current.startGame();
    });
    
    expect(result.current.gameState.gameStarted).toBe(true);
    expect(result.current.showModeSelection).toBe(false);
  });

  it('should reset game correctly', () => {
    const { result } = renderHook(() => useSnakeGame());
    
    // Start and then reset
    act(() => {
      result.current.startGame();
    });
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.gameState.gameStarted).toBe(false);
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.showModeSelection).toBe(true);
  });
});

describe('useGameStats Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with empty stats', () => {
    const { result } = renderHook(() => useGameStats());
    
    expect(result.current.stats.totalGames).toBe(0);
    expect(result.current.stats.totalScore).toBe(0);
    expect(result.current.stats.achievements).toEqual([]);
  });

  it('should update stats correctly', () => {
    const { result } = renderHook(() => useGameStats());
    
    act(() => {
      result.current.updateStats(10, 5);
    });
    
    expect(result.current.stats.totalGames).toBe(1);
    expect(result.current.stats.totalScore).toBe(10);
    expect(result.current.stats.averageScore).toBe(10);
  });

  it('should add achievements without duplicates', () => {
    const { result } = renderHook(() => useGameStats());
    
    act(() => {
      result.current.addAchievement('first_food');
      result.current.addAchievement('first_food'); // Duplicate
    });
    
    expect(result.current.stats.achievements).toEqual(['first_food']);
  });
});