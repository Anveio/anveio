"use client";
import { Toggle } from "@/components/ui/toggle";
import { useThemeOnClient } from "@/lib/theming/ThemeProvider";
import { AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeOnClient();

  return (
    <Toggle aria-label="Toggle dark mode" onClick={toggleTheme}>
      <AnimatePresence>
        {theme === "dark" ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </AnimatePresence>
    </Toggle>
  );
};
