import { Subscription } from './api/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ticket processing api error handling
export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong'
): string {
  if (!err) return fallback;
  const anyErr = err as any;
  if (anyErr?.response?.data?.message)
    return String(anyErr.response.data.message);
  if (anyErr?.message) return String(anyErr.message);
  return fallback;
}

// plate mismatch detection
export function isPlateMismatch(
  subscription: Subscription | null,
  plateInput: string
): boolean {
  if (!subscription || !plateInput) return false;

  return !subscription.cars.some(
    (c) => c.plate.toLowerCase() === plateInput.toLowerCase()
  );
}
