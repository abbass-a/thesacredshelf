'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * ReadingProgressBar — sticky progress indicator.
 * Shows the percentage of page scrolled as a gold bar.
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full h-[3px] bg-gray-200 dark:bg-gray-700">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #A67C2E, #d4a957)',
        }}
      />
    </div>
  );
}
