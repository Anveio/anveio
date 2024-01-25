"use client";
import { Toggle } from "@/components/ui/toggle";
import { useThemeOnClient } from "@/lib/theming/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";

const DISTANCE = 48;

const ANIMATION_CONFIG = {
  transition: {
    duration: 0.5,
  },
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeOnClient();

  return (
    <Toggle
      aria-label="Toggle dark mode"
      className="max-w-[48px] w-[48px]"
      onClick={toggleTheme}
    >
      <div className="flex overflow-hidden">
        <AnimatePresence>
          {theme === "dark" ? (
            <motion.div key={"dark"} {...ANIMATION_CONFIG}>
              <MoonIcon className="h-6 w-6 dark:text-zinc-50" />
            </motion.div>
          ) : (
            <motion.div key={"light"} {...ANIMATION_CONFIG}>
              <SunIcon className="h-6 w-6 dark:text-zinc-50" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Toggle>
  );
};
