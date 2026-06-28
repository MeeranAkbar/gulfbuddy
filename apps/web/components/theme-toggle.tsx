'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

const themeModes: ThemeMode[] = ['light', 'dark', 'system'];

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;

  const resolved = mode === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : mode;

  root.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('gh-theme');
    const initial = stored && themeModes.includes(stored as ThemeMode) ? (stored as ThemeMode) : 'system';
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current = (window.localStorage.getItem('gh-theme') as ThemeMode | null) || 'system';
      if (current === 'system') {
        applyTheme('system');
      }
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function handleChange(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    window.localStorage.setItem('gh-theme', nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="gh-toggle-wrap">
      {themeModes.map((mode) => {
        const active = theme === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => handleChange(mode)}
            className={`gh-toggle-option ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            aria-label={`Switch to ${mode} theme`}
            title={mode[0].toUpperCase() + mode.slice(1)}
          >
            {mounted ? mode.slice(0, 1).toUpperCase() : mode.slice(0, 1).toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
