'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClickSound: () => void;  isLoading: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const MUTE_STORAGE_KEY = 'gussr_sound_muted';
const CLICK_SOUND_URL = '/click.mp3';

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mute preference from localStorage
    const storedMute = localStorage.getItem(MUTE_STORAGE_KEY);
    if (storedMute) {
      setIsMuted(JSON.parse(storedMute));
    }

    // Initialize audio with optimized loading
    const clickSound = new Audio();
    clickSound.src = CLICK_SOUND_URL;
    clickSound.preload = 'auto';
    
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Audio loading timeout - using fallback');
        setAudio(clickSound);
        setIsLoading(false);
      }
    }, 2000);

    clickSound.onerror = () => {
      console.error('Failed to load click sound');
      setAudioError(true);
      setIsLoading(false);
      clearTimeout(loadTimeout);
    };
    
    clickSound.oncanplaythrough = () => {
      setAudio(clickSound);
      setAudioError(false);
      setIsLoading(false);
      clearTimeout(loadTimeout);
    };
    
    clickSound.load();

    return () => {
      clearTimeout(loadTimeout);
      clickSound.oncanplaythrough = null;
      clickSound.onerror = null;
    };
  }, [isLoading]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem(MUTE_STORAGE_KEY, JSON.stringify(newMuteState));
  };

  const playClickSound = () => {
    if (!isMuted && audio && !audioError && !isLoading) {
      audio.currentTime = 0.4; // Start 1 second into the audio file
      audio.play().catch((error) => {
        console.error('Error playing click sound:', error);
        setAudioError(true);
      });
    }
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playClickSound, isLoading }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}