import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Safe fallback if blocked
  }
};
