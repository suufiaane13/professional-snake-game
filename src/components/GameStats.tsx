import React from 'react';
import { BarChart3, Target, TrendingUp, Award } from 'lucide-react';

interface GameStatsProps {
  stats: {
    totalGames: number;
    totalScore: number;
    averageScore: number;
    longestSnake: number;
    achievements: string[];
  };
  onClose: () => void;
  onResetStats: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats, onClose, onResetStats }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <BarChart3 size={24} />
            <span>Game Statistics</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Target size={12} />
              <span>Games Played</span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalScore}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <TrendingUp size={12} />
              <span>Total Score</span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.averageScore}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.longestSnake}</div>
            <div className="text-sm text-gray-600">Longest Snake</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Award size={18} />
            <span>Achievements ({stats.achievements.length}/5)</span>
          </h3>
          <div className="space-y-2">
            {['first_food', 'score_10', 'score_25', 'score_50', 'no_pause'].map((achievement, index) => (
              <div
                key={achievement}
                className={`flex items-center space-x-3 p-2 rounded ${
                  stats.achievements.includes(achievement)
                    ? 'bg-yellow-50 text-yellow-800'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                <Award size={16} className={stats.achievements.includes(achievement) ? 'text-yellow-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">
                  {['First Bite', 'Getting Started', 'Snake Master', 'Legendary', 'Focus Master'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onResetStats}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
          >
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
};