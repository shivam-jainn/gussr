import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encryptCity = (cityId: number) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const timestamp = Date.now();
  const data = {
    v: cityId,
    s: Array.from(salt).map(b => b.toString(16)).join(''),
    t: timestamp,
    k: cityId * 31 + (timestamp % 1000)
  };
  return btoa(JSON.stringify(data));
};

export const decryptCity = (encoded: string) => {
  try {
    const data = JSON.parse(atob(encoded));
    const { v, t, k } = data;

    // Check timestamp (1-hour expiration)
    if (Date.now() - t > 1000 * 60 * 60) {
      return null;
    }

    // Validate checksum
    const expectedK = v * 31 + (t % 1000);
    return k === expectedK ? v : null;
  } catch {
    return null;
  }
};