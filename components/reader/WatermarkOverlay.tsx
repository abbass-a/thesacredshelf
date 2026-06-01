/**
 * WatermarkOverlay — repeating diagonal watermark over reader content.
 *
 * Server-rendered (no 'use client' needed). Purely CSS-based pattern.
 * pointer-events: none ensures it doesn't interfere with text interaction.
 */
export default function WatermarkOverlay() {
  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ userSelect: 'none' }}
    >
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150'%3E%3Ctext x='50%25' y='50%25' font-family='Inter,system-ui,sans-serif' font-size='14' fill='%23000' text-anchor='middle' dominant-baseline='middle' transform='rotate(-35, 150, 75)'%3Ethesacredshelf.com%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 150px',
        }}
      />
    </div>
  );
}
