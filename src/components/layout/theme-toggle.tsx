'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as ThemeMode | null) || 'light';
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button aria-label="Toggle theme" className="btn btn-ghost btn-circle" onClick={toggleTheme}>
      {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
