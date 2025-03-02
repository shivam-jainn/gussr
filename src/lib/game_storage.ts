
interface GameResponse {
  clues: { id: number; clue: string }[];
  options: { id: number; name: string; image_url: string }[];
  encryptedCity: string;
}

interface VoucherProgress {
  unlockedSegments: number;
  totalSegments: number;
  voucherId: string;
  expiryDate: string;
}

interface StoredGameState {
  encryptedCities: string[];
  responses: GameResponse[];
  username: string;
  score: number;
  voucherProgress?: VoucherProgress;
}

const STORAGE_KEY = 'gussr_game_state';
const VOUCHER_UNLOCK_THRESHOLD = 3; // Number of correct answers needed to unlock a segment

export const saveGameState = (encryptedCity: string, response: GameResponse, username: string, score: number, isCorrect: boolean = false) => {
  try {
    const existingState = localStorage.getItem(STORAGE_KEY);
    const state: StoredGameState = existingState 
      ? JSON.parse(existingState)
      : { encryptedCities: [], responses: [], username, score };
    
    state.encryptedCities.push(encryptedCity);
    state.responses.push(response);
    state.score = score;

    // Update voucher progress if answer is correct and voucher is active
    if (isCorrect && state.voucherProgress) {
      const correctAnswers = state.responses.length;
      if (correctAnswers % VOUCHER_UNLOCK_THRESHOLD === 0 && 
          state.voucherProgress.unlockedSegments < state.voucherProgress.totalSegments) {
        state.voucherProgress.unlockedSegments++;
      }
    }
    
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

export const initializeVoucher = (voucherId: string, totalSegments: number, expiryDate: string) => {
  try {
    const existingState = localStorage.getItem(STORAGE_KEY);
    if (!existingState) return false;

    const state: StoredGameState = JSON.parse(existingState);
    state.voucherProgress = {
      unlockedSegments: 0,
      totalSegments,
      voucherId,
      expiryDate
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Error initializing voucher:', error);
    return false;
  }
};

export const getVoucherProgress = (): VoucherProgress | null => {
  try {
    const state = getGameState();
    return state?.voucherProgress || null;
  } catch (error) {
    console.error('Error getting voucher progress:', error);
    return null;
  }
};

export const isVoucherExpired = (): boolean => {
  const progress = getVoucherProgress();
  if (!progress) return true;
  
  const expiryDate = new Date(progress.expiryDate);
  return expiryDate < new Date();
};