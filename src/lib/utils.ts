
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple translation function for when context is not available
export function getTexto(key: string, defaultText?: string): string {
  // This is a simple implementation that would be replaced by the context version
  return defaultText || key;
}
