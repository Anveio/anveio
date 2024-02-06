import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export const PUBLIC_API_KEYS = {
  LiveBlocks: z
    .string()
    .parse(process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY),
} as const;

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}