// ============================================================
// GULFBUDDY THEME SYSTEM - shared/theme.js
// Dark / Light mode toggle with localStorage persistence
// ============================================================

const GB_THEME_KEY = 'gb_theme';

const THEMES = {
  dark: {
    '--bg-main': '#06060e',
    '--bg-card': '#0d0d1a',
    '--bg-sidebar': '#08081a',
    '--bg-input': '#0d0d1e',
    '--border': '#1a1828',
    '--border-soft': '#111120',
    '--gold': '#C9A84C',
    '--gold-light': '#E8C97A',
    '--text-primary': '#ececec',
    '--text-secondary': '#888',
    '--text-muted': '#444',
    '--text-faint': '#2a2a4a',
    '--green': '#22c55e',
    '--red': '#ef4444',
    '--blue': '#60a5fa',
    '--shadow': 'rgba(0,0,0,0.5)',
    '--navbar-bg': '#08081a',
    '--overlay': 'rgba(0,0,0,0.8)'
  },
  light: {
    '--bg-main': '#f4f4f8',
    '--bg-card': '#ffffff',
    '--bg-sidebar': '#f0f0f6',
    '--bg-input': '#f8f8fc',
    '--border': '#e0e0ea',
    '--border-soft': '#ebebf3',
    '--gold': '#b8922a',
    '--gold-light': '#c9a84c',
    '--text-primary': '#111118',
    '--text-secondary': '#555566',
    '--text-muted': '#888899',
    '--text-faint': '#aaaabc',
    '--green': '#16a34a',
    '--red': '#dc2626',
    '--blue': '#2563eb',
    '--shadow': 'rgba(0,0,0,0.12)',
    '--navbar-bg': '#ffffff',
    '--overlay': 'rgba(0,0,0,0.6)'
  }
};

function themeButtonLabel(theme) {
  return theme === 'dark' ? 'Light' : 'Dark';
}

function applyTheme(theme) {
  const vars = THEMES[theme] || THEMES.dark;
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
  root.setAttribute('data-theme', theme);
  localStorage.setItem(GB_THEME_KEY, theme);

  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    const title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.title = title;
    btn.setAttribute('aria-label', title);
    btn.dataset.themeMode = theme;
    if (!btn.querySelector('svg')) {
      btn.textContent = themeButtonLabel(theme);
    }
  }
}

function initTheme() {
  const saved = localStorage.getItem(GB_THEME_KEY) || 'dark';
  applyTheme(saved);
}

function toggleTheme() {
  const current = localStorage.getItem(GB_THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function addThemeToggle(containerId) {
  const container = document.getElementById(containerId || 'navActions');
  if (!container) return;

  const btn = document.createElement('button');
  btn.id = 'themeToggleBtn';
  btn.onclick = toggleTheme;
  btn.title = 'Toggle Dark/Light Mode';
  btn.style.cssText = [
    'background: var(--bg-card)',
    'border: 1px solid var(--border)',
    'border-radius: 8px',
    'color: var(--gold)',
    'font-size: 12px',
    'font-weight: 700',
    'padding: 7px 10px',
    'cursor: pointer',
    'line-height: 1',
    'transition: all 0.15s'
  ].join(';');

  const saved = localStorage.getItem(GB_THEME_KEY) || 'dark';
  btn.textContent = themeButtonLabel(saved);
  container.insertBefore(btn, container.firstChild);
}

initTheme();
