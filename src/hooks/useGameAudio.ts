import { useRef, useCallback } from 'react';
import { AUDIO_CONFIG } from '../utils/constants';

export const useGameAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(true);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createTone = useCallback((frequency: number, duration: number, volume: number) => {
    const audioContext = initAudioContext();
    if (!audioContext || !isEnabledRef.current) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [initAudioContext]);

  const playEatSound = useCallback(() => {
    createTone(800, 0.1, AUDIO_CONFIG.EAT_VOLUME);
  }, [createTone]);

  const playGameOverSound = useCallback(() => {
    createTone(200, 0.5, AUDIO_CONFIG.GAME_OVER_VOLUME);
    setTimeout(() => createTone(150, 0.3, AUDIO_CONFIG.GAME_OVER_VOLUME), 200);
  }, [createTone]);

  const playAchievementSound = useCallback(() => {
    createTone(600, 0.2, AUDIO_CONFIG.ACHIEVEMENT_VOLUME);
    setTimeout(() => createTone(800, 0.2, AUDIO_CONFIG.ACHIEVEMENT_VOLUME), 100);
    setTimeout(() => createTone(1000, 0.3, AUDIO_CONFIG.ACHIEVEMENT_VOLUME), 200);
  }, [createTone]);

  const toggleAudio = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    playEatSound,
    playGameOverSound,
    playAchievementSound,
    toggleAudio,
    isEnabled: () => isEnabledRef.current,
  };
};