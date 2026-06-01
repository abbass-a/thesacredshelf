'use client';

import { useEffect } from 'react';

/**
 * ReaderInitializer — client-only component.
 *
 * Loaded via dynamic(() => import(...), { ssr: false }).
 * On mount, restores the user's font-size and theme preferences
 * from localStorage so the reader matches their last visit.
 */
export default function ReaderInitializer() {
  useEffect(() => {
    // ── Font size ─────────────────────────────────────────────
    const savedFontSize = localStorage.getItem('tss-font-size');
    if (savedFontSize) {
      const readerContent = document.getElementById('reader-content');
      if (readerContent) {
        readerContent.style.setProperty('--reader-font-size', `${savedFontSize}px`);
      }
    }

    // ── Theme ─────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('tss-theme');
    if (savedTheme && ['light', 'sepia', 'dark'].includes(savedTheme)) {
      const html = document.documentElement;
      // Remove any existing theme classes
      html.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
      html.classList.add(`theme-${savedTheme}`);
    }
  }, []);

  return null;
}
