import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a price with two decimal places (e.g. 148.5 → "148.50") */
export function formatPrice(value: number): string {
  return value.toFixed(2);
}
