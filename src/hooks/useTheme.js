import { useCallback } from 'react';
import { useThemeContext } from '../context/ThemeContext.jsx';

export function useTheme() {
  const { theme, toggleTheme } = useThemeContext();

  /**
   * Set a specific theme value.
   * Directly updates `data-theme` on the document root for immediate effect,
   * then toggles the context state if the requested value differs from the
   * current theme (ThemeContext's useEffect will also persist to localStorage).
   */
  const setTheme = useCallback(
    (value) => {
      document.documentElement.setAttribute('data-theme', value);
      if (value !== theme) {
        toggleTheme();
      }
    },
    [theme, toggleTheme],
  );

  return { theme, toggleTheme, setTheme };
}

