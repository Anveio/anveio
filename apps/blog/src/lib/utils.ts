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

