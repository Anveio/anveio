import { z } from 'zod';

export const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const ThemeCookieKey = 'theme' as const;

export const themeSchema = z.enum([Theme.DARK, Theme.LIGHT]);
