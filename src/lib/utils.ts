import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encryptCity = (cityId: number, userId: string) => {
  const key = userId; // Using userId as encryption key
  let encrypted = '';
  const cityIdStr = cityId.toString();
  for(let i = 0; i < cityIdStr.length; i++) {
      const charCode = cityIdStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
  }
  return Buffer.from(encrypted).toString('base64');
}