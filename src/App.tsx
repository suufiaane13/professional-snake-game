import React from 'react';
import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameControls } from './components/GameControls';
import { GameModes } from './components/GameModes';
import { GameStats } from './components/GameStats';
import { ParticleEffect } from './components/ParticleEffect';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useGameAudio } from './hooks/useGameAudio';
import { useGameStats } from './hooks/useGameStats';

function App() {
  const { 
    gameState, 
    selectedMode, 
    showModeSelection, 
    setSelectedMode, 
    startGame, 
    resetGame, 
    togglePause 
  } = useSnakeGame();
  
  const { 
    playEatSound, 
    playGameOverSound, 
    playAchievementSound, 
    toggleAudio, 
    isEnabled: isAudioEnabled 
  } = useGameAudio();
  
  const { stats, updateStats, addAchievement, resetStats } = useGameStats();
  
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  
  // Handle game events
  React.useEffect(() => {
    if (gameState.gameOver && gameState.gameStarted) {
      updateStats(gameState.score, gameState.snake.length);
      playGameOverSound();
    }
  }, [gameState.gameOver, gameState.gameStarted]);
  
  // Handle food eating
  React.useEffect(() => {
    if (gameState.score > 0) {
      playEatSound();
      
      // Trigger particle effect
      const foodX = gameState.food.x * 20 + 10;
      const foodY = gameState.food.y * 20 + 10;
      setParticlePosition({ x: foodX, y: foodY });
      setShowParticles(true);
      
      // Check achievements
      if (gameState.score === 1) addAchievement('first_food');
      if (gameState.score === 10) addAchievement('score_10');
      if (gameState.score === 25) addAchievement('score_25');
      if (gameState.score === 50) addAchievement('score_50');
    }
  }, [gameState.score]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🐍 Professional Snake
          </h1>
          <p className="text-gray-600">
            Modern Snake game with multiple modes & achievements
          </p>
        </div>

        {showModeSelection ? (
          <GameModes
            selectedMode={selectedMode}
            onModeSelect={setSelectedMode}
            onStartGame={startGame}
          />
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <GameCanvas gameState={gameState} />
              <ParticleEffect
                trigger={showParticles}
                x={particlePosition.x}
                y={particlePosition.y}
                onComplete={() => setShowParticles(false)}
              />
            </div>
            
            <GameControls
              gameStarted={gameState.gameStarted}
              gameOver={gameState.gameOver}
              isPaused={gameState.isPaused}
              score={gameState.score}
              highScore={gameState.highScore}
              gameMode={gameState.gameMode}
              timeRemaining={gameState.timeRemaining}
              audioEnabled={isAudioEnabled()}
              onStart={startGame}
              onReset={resetGame}
              onTogglePause={togglePause}
              onToggleAudio={toggleAudio}
              onShowStats={() => setShowStats(true)}
            />
          </div>
        )}

        {!showModeSelection && (
          <div className="mt-6 text-center text-xs text-gray-500 space-y-1 leading-relaxed">
            <div>Desktop: Arrow Keys or WASD • Mobile: Swipe to move</div>
            <div>Eat red food to grow • Avoid walls and yourself</div>
            <div>Press P or ESC to pause during gameplay</div>
          </div>
        )}
      </div>
      
      {showStats && (
        <GameStats
          stats={stats}
          onClose={() => setShowStats(false)}
          onResetStats={resetStats}
        />
      )}
    </div>
  );
}

export default App;