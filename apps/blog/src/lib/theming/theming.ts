import { cookies } from "next/headers";
import { SUPPORTED_THEME } from "./shared";

export const toggleThemeCookie = (
  currentTheme: (typeof SUPPORTED_THEME)[keyof typeof SUPPORTED_THEME]
) => {
  const cookieStore = cookies();

  const themeCookie = cookieStore.get("theme");

  if (themeCookie && themeCookie.value === "dark") {
    cookieStore.set("theme", "light");
  } else {
    cookieStore.set("theme", "dark");
  }
};
