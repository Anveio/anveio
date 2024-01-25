'use client'
import { useMutation } from "@tanstack/react-query";
import { Theme, themeSchema } from "./shared";
import * as React from "react";
/**
 * Returns the color-scheme provided by the user's OS only *after* the document
 * has loaded. This is best to use to get the initial color-scheme before
 * the user has ever set a cookie via the color-scheme switcher or by us
 * setting the cookie for them after getting their preferred OS-level color scheme.
 */
export const getSystemThemeAsColorScheme = (): Theme => {
  if (
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
};

export const toggleThemeOfHtmlElement = () => {
  const htmlClassList = document.getElementsByTagName("html")[0]?.classList;

  if (!htmlClassList) {
    console.error("No html tag found in document");
    return;
  }

  const existingThemeClass = getCurrentThemeFromHtmlElement()
  console.log("🚀 ~ toggleThemeOfHtmlElement ~ existingThemeClass:", existingThemeClass)


  htmlClassList.replace(existingThemeClass, existingThemeClass === Theme.DARK ? Theme.LIGHT : Theme.DARK)
};

export const getCurrentThemeFromHtmlElement = (): Theme => {
  const htmlClassList = document.getElementsByTagName("html")[0]?.classList;

  if (!htmlClassList) {
    console.error("No html tag found in document");
    return getSystemThemeAsColorScheme()
  }

  /**
   * Get the existing theme class from the html tag.
   */
  const themeClassUnsafe = Array.from(htmlClassList).find((className) =>
    className === Theme.DARK || className === Theme.LIGHT)

  const themeValidation = themeSchema.safeParse(themeClassUnsafe);

  if (!themeValidation.success) {
    console.error("Existing theme class is not valid");
    return getSystemThemeAsColorScheme()
  }

  return themeValidation.data
}

