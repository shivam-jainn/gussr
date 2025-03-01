import { GameResponse } from '@/types/game';

interface StoredGameState {
  encryptedCities: string[];
  responses: GameResponse[];
  username: string;
  score: number;
}

const STORAGE_KEY = 'gussr_game_state';

export const saveGameState = (encryptedCity: string, response: GameResponse, username: string, score: number) => {
  try {
    const existingState = localStorage.getItem(STORAGE_KEY);
    const state: StoredGameState = existingState 
      ? JSON.parse(existingState)
      : { encryptedCities: [], responses: [], username, score };
    
    state.encryptedCities.push(encryptedCity);
    state.responses.push(response);
    state.score = score;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const getGameState = (): StoredGameState | null => {
  try {
    const state = localStorage.getItem(STORAGE_KEY);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error getting game state:', error);
    return null;
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};