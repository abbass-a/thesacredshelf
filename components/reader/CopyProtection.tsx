'use client';

import { useEffect } from 'react';

/**
 * CopyProtection — client-only component.
 *
 * Loaded via dynamic(() => import(...), { ssr: false }) so that
 * the SSR HTML stays clean for Googlebot. Protection activates
 * only after hydration on real browsers.
 */
export default function CopyProtection() {
  useEffect(() => {
    // 1. Inject user-select: none on #reader-content
    const style = document.createElement('style');
    style.id = 'tss-copy-protection';
    style.textContent = `
      #reader-content {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
    `;
    document.head.appendChild(style);

    // 2. Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // 3. Block keyboard shortcuts for copy, select-all, save, print, view-source, devtools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'a', 's', 'p', 'u'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      // Ctrl+Shift+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // 4. Block printing
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Cleanup on unmount
    return () => {
      const injectedStyle = document.getElementById('tss-copy-protection');
      if (injectedStyle) {
        injectedStyle.remove();
      }
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  return null;
}
