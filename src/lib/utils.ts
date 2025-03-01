import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encryptCity = (cityId: number) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const timestamp = Date.now();
  // Simplify the encryption to make it more reliable
  const data = {
    v: cityId,
    s: Array.from(salt).map(b => b.toString(16)).join(''),
    t: timestamp,
    k: cityId * 31 + timestamp % 1000 // Changed to make verification more reliable
  };
  return btoa(JSON.stringify(data));
};

export const decryptCity = (encoded: string) => {
  try {
    const data = JSON.parse(atob(encoded));
    const timestamp = data.t;
    
    // Check if answer hasn't expired (1 hour)
    if (Date.now() - timestamp > 1000 * 60 * 60) {
      return null;
    }

    // Verify the answer using k value
    const expectedK = data.v * 31 + timestamp % 1000;
    return data.k === expectedK ? data.v : null;
  } catch {
    return null;
  }
};