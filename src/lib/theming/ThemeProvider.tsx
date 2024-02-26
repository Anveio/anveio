'use client';

import React from 'react';
import { Theme } from './shared';
import { useMutation } from '@tanstack/react-query';
import { cn } from '../utils';

export const ThemeContext = React.createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

export const useThemeOnClient = () => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeOnClient must be used within a ThemeProvider');
  }

  return context;
};

export const HtmlElement = (
  props: React.PropsWithChildren<{ initialTheme: Theme }>
) => {
  const [theme, setTheme] = React.useState(props.initialTheme);

  const mutation = useMutation({
    mutationFn: async (nextTheme: Theme) => {
      try {
        fetch('/api/theming', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theme: nextTheme,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
      mutation.mutate(nextTheme);
      return prev === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <html lang='en' className={cn(theme)}>
        {props.children}
      </html>
    </ThemeContext.Provider>
  );
};
