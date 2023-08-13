import { ColorScheme } from "./shared";

/**
 * Returns the color-scheme provided by the user's OS only *after* the document
 * has loaded. This is best to use to get the initial color-scheme before
 * the user has ever set a cookie via the color-scheme switcher or by us
 * setting the cookie for them after getting their preferred OS-level color scheme.
 */
export const getInitialUserPreferredColorScheme = (): ColorScheme => {
  if (
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
};
