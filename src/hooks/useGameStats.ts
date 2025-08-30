import { useState, useEffect, useCallback } from 'react';

interface GameStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  longestSnake: number;
  achievements: string[];
}

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(() => {
    const stored = localStorage.getItem('snake-game-stats');
    return stored ? JSON.parse(stored) : {
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      longestSnake: 0,
      achievements: [],
    };
  });

  const updateStats = useCallback((score: number, snakeLength: number) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalGames: prev.totalGames + 1,
        totalScore: prev.totalScore + score,
        longestSnake: Math.max(prev.longestSnake, snakeLength),
      };
      
      newStats.averageScore = Math.round(newStats.totalScore / newStats.totalGames);
      
      localStorage.setItem('snake-game-stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const addAchievement = useCallback((achievementId: string) => {
    setStats(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      
      const newStats = {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      };
      
      localStorage.setItem('snake-game-stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    const emptyStats = {
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      longestSnake: 0,
      achievements: [],
    };
    setStats(emptyStats);
    localStorage.setItem('snake-game-stats', JSON.stringify(emptyStats));
  }, []);

  return {
    stats,
    updateStats,
    addAchievement,
    resetStats,
  };
};