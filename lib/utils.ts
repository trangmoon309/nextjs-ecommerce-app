import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object into a regular JS objects
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const strings = num.toString().split('.');
  const int = strings[0];
  const decimal = strings[1];
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}
