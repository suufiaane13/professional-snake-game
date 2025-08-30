import React from 'react';
import { Zap, Clock, Trophy } from 'lucide-react';
import { GAME_MODES } from '../utils/constants';

interface GameModesProps {
  selectedMode: keyof typeof GAME_MODES;
  onModeSelect: (mode: keyof typeof GAME_MODES) => void;
  onStartGame: () => void;
}

export const GameModes: React.FC<GameModesProps> = ({
  selectedMode,
  onModeSelect,
  onStartGame,
}) => {
  const modes = Object.entries(GAME_MODES) as [keyof typeof GAME_MODES, typeof GAME_MODES[keyof typeof GAME_MODES]][];

  const getModeIcon = (mode: keyof typeof GAME_MODES) => {
    switch (mode) {
      case 'CLASSIC': return <Trophy size={24} />;
      case 'SPEED': return <Zap size={24} />;
      case 'SURVIVAL': return <Clock size={24} />;
      default: return <Trophy size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Game Mode</h2>
        <p className="text-gray-600">Select your preferred challenge level</p>
      </div>

      <div className="grid gap-4">
        {modes.map(([key, mode]) => (
          <button
            key={key}
            onClick={() => onModeSelect(key)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedMode === key
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`${selectedMode === key ? 'text-blue-600' : 'text-gray-500'}`}>
                {getModeIcon(key)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{mode.name}</h3>
                <p className="text-sm text-gray-600">{mode.description}</p>
                <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                  <span>Speed: {mode.speedMultiplier}x</span>
                  <span>Points: {mode.scoreMultiplier}x</span>
                  {key === 'SURVIVAL' && <span>Time: {mode.timeLimit}s</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onStartGame}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Trophy size={20} />
        <span>Start {GAME_MODES[selectedMode].name} Mode</span>
      </button>
    </div>
  );
};