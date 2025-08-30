import React from 'react';
import { Play, RotateCcw, Pause, Play as Resume, Trophy, Volume2, VolumeX, BarChart3 } from 'lucide-react';

interface GameControlsProps {
  gameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
  score: number;
  highScore: number;
  gameMode: string;
  timeRemaining?: number;
  audioEnabled: boolean;
  onStart: () => void;
  onReset: () => void;
  onTogglePause: () => void;
  onToggleAudio: () => void;
  onShowStats: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  gameOver,
  isPaused,
  score,
  highScore,
  gameMode,
  timeRemaining,
  audioEnabled,
  onStart,
  onReset,
  onTogglePause,
  onToggleAudio,
  onShowStats,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {gameMode} Mode
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onToggleAudio}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={audioEnabled ? 'Mute' : 'Unmute'}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={onShowStats}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="View Statistics"
          >
            <BarChart3 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Score</div>
          <div className="text-3xl font-bold text-gray-800">{score}</div>
        </div>
        {timeRemaining !== undefined && (
          <div className="text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide">Time</div>
            <div className={`text-2xl font-bold ${timeRemaining < 30 ? 'text-red-600' : 'text-blue-600'}`}>
              {timeRemaining}s
            </div>
          </div>
        )}
        {highScore > 0 && (
          <div className="text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide flex items-center justify-center space-x-1">
              <Trophy size={12} />
              <span>Best</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{highScore}</div>
          </div>
        )}
      </div>

      {!gameStarted && !gameOver && (
        <div className="text-center space-y-4">
          <div className="text-lg text-gray-600">
            Use Arrow Keys, WASD, or swipe to play
          </div>
          <button
            onClick={onStart}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <Play size={20} />
            <span>Start Game</span>
          </button>
          <div className="text-sm text-gray-500">
            Or press SPACE/ENTER to start
          </div>
        </div>
      )}

      {gameStarted && !gameOver && isPaused && (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-yellow-600">
            Game Paused
          </div>
          <button
            onClick={onTogglePause}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <Resume size={20} />
            <span>Resume</span>
          </button>
          <div className="text-sm text-gray-500">
            Or press P/ESC to resume
          </div>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-red-600">
            Game Over!
          </div>
          {score === highScore && score > 0 && (
            <div className="text-lg font-semibold text-yellow-600 flex items-center justify-center space-x-1">
              <Trophy size={20} />
              <span>New High Score!</span>
            </div>
          )}
          <div className="text-lg text-gray-600">
            Final Score: {score}
          </div>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>
          <div className="text-sm text-gray-500">
            Or press SPACE/ENTER to restart
          </div>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div className="text-center space-y-2">
          <button
            onClick={onTogglePause}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 mb-3"
          >
            <Pause size={16} />
            <span>Pause</span>
          </button>
          <div className="text-sm text-gray-600">
            Arrow Keys, WASD, or swipe • P/ESC to pause
          </div>
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 underline text-sm transition-colors duration-200"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
};