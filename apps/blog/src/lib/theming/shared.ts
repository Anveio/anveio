export const SUPPORTED_THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type ColorScheme =
  (typeof SUPPORTED_THEME)[keyof typeof SUPPORTED_THEME];
