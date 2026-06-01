'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AdSlot — lazy-loaded Google AdSense component.
 *
 * Uses IntersectionObserver to only push to adsbygoogle when
 * the ad slot scrolls into view. Returns null if no slotId.
 */
export default function AdSlot({ slotId }: { slotId?: string }) {
  const adRef = useRef<HTMLModElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slotId || loaded || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              setLoaded(true);
            } catch {
              // AdSense not loaded or ad blocker active — fail silently
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [slotId, loaded]);

  if (!slotId) return null;

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  return (
    <div className="w-full flex justify-center my-4" id="ad-slot-container">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
