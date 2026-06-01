'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'sepia' | 'dark';

/**
 * ReaderControls — font size, theme toggle, and reading time display.
 *
 * Font size range: 18–32px, persisted to localStorage tss-font-size.
 * Theme: light | sepia | dark, persisted to localStorage tss-theme.
 * Applies --reader-font-size CSS variable on #reader-content.
 * Applies theme-{name} class on <html>.
 */
export default function ReaderControls({
  estimatedReadMinutes,
}: {
  estimatedReadMinutes: number;
}) {
  const [fontSize, setFontSize] = useState(22);
  const [theme, setTheme] = useState<Theme>('light');

  // Load saved preferences on mount
  useEffect(() => {
    const savedSize = localStorage.getItem('tss-font-size');
    if (savedSize) {
      const parsed = parseInt(savedSize, 10);
      if (parsed >= 18 && parsed <= 32) setFontSize(parsed);
    }

    const savedTheme = localStorage.getItem('tss-theme') as Theme | null;
    if (savedTheme && ['light', 'sepia', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply font size
  useEffect(() => {
    const el = document.getElementById('reader-content');
    if (el) {
      el.style.setProperty('--reader-font-size', `${fontSize}px`);
    }
    localStorage.setItem('tss-font-size', String(fontSize));
  }, [fontSize]);

  // Apply theme
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    html.classList.add(`theme-${theme}`);
    localStorage.setItem('tss-theme', theme);
  }, [theme]);

  const decreaseFont = () => setFontSize((s) => Math.max(18, s - 2));
  const increaseFont = () => setFontSize((s) => Math.min(32, s + 2));

  const themes: { key: Theme; label: string; bg: string; text: string }[] = [
    { key: 'light', label: 'Light', bg: '#FAFAF7', text: '#1a1a1a' },
    { key: 'sepia', label: 'Sepia', bg: '#F5EDD8', text: '#3b2f1e' },
    { key: 'dark', label: 'Dark', bg: '#1C1C1E', text: '#E8E4DC' },
  ];

  return (
    <div
      id="reader-controls"
      className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 rounded-xl border"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Font size controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider opacity-60 font-inter mr-1">
          Font
        </span>
        <button
          onClick={decreaseFont}
          disabled={fontSize <= 18}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Decrease font size"
          id="btn-font-decrease"
        >
          <span className="text-sm font-semibold">−</span>
        </button>
        <span className="text-sm tabular-nums font-medium min-w-[3ch] text-center">
          {fontSize}
        </span>
        <button
          onClick={increaseFont}
          disabled={fontSize >= 32}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Increase font size"
          id="btn-font-increase"
        >
          <span className="text-sm font-semibold">+</span>
        </button>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs uppercase tracking-wider opacity-60 font-inter mr-1">
          Theme
        </span>
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              theme === t.key
                ? 'ring-2 ring-accent ring-offset-1 scale-105'
                : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: t.bg,
              color: t.text,
              borderColor: theme === t.key ? '#A67C2E' : 'var(--color-border)',
            }}
            aria-label={`Switch to ${t.label} theme`}
            id={`btn-theme-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reading time */}
      <div className="flex items-center gap-1.5 text-sm opacity-70">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-inter">~{estimatedReadMinutes} minutes</span>
      </div>
    </div>
  );
}
