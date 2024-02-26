'use client';
import { Toggle } from '@/components/ui/toggle';
import { useThemeOnClient } from '@/lib/theming/ThemeProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonIcon, SunIcon } from 'lucide-react';

const DISTANCE = 48;

const ANIMATION_CONFIG = {
  transition: {
    duration: 0.2,
  },
  initial: {
    opacity: 0.5,
    x: DISTANCE,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -DISTANCE,
  },
};

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeOnClient();

  return (
    <Toggle
      aria-label='Toggle dark mode'
      className='max-w-[48px] w-[48px] mb-1'
      onClick={toggleTheme}
    >
      <div className='flex overflow-hidden'>
        <AnimatePresence mode='wait'>
          {theme === 'dark' ? (
            <motion.div key={'dark'} {...ANIMATION_CONFIG}>
              <MoonIcon className='h-4 w-4 dark:text-zinc-50' />
            </motion.div>
          ) : (
            <motion.div key={'light'} {...ANIMATION_CONFIG}>
              <SunIcon className='h-4 w-4 dark:text-zinc-50' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Toggle>
  );
};
