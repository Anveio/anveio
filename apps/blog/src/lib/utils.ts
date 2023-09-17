import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { string, parse } from "valibot";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PUBLIC_API_KEYS = {
  LiveBlocks: parse(
    string(),
    process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY
  ),
} as const;

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
