'use client';

import Link from 'next/link';

interface NavChapter {
  id: string;
  slug: string;
  title_urdu: string;
  title_english?: string;
  chapter_number: number;
}

/**
 * ChapterNavigation — bottom navigation between chapters.
 *
 * RTL-aware: right arrow = previous chapter, left arrow = next chapter.
 * Scrolls to top on navigation.
 */
export default function ChapterNavigation({
  bookSlug,
  prevChapter,
  nextChapter,
}: {
  bookSlug: string;
  prevChapter: NavChapter | null;
  nextChapter: NavChapter | null;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="flex items-stretch justify-between gap-4 mt-12 mb-8 px-2"
      aria-label="Chapter navigation"
      dir="rtl"
    >
      {/* Previous chapter (right arrow in RTL = go back) */}
      {prevChapter ? (
        <Link
          href={`/books/${bookSlug}/chapter/${prevChapter.chapter_number}/${prevChapter.slug}`}
          onClick={scrollToTop}
          className="group flex items-center gap-3 px-5 py-4 rounded-xl border transition-all hover:shadow-md hover:scale-[1.01] flex-1 max-w-[48%]"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          id="btn-chapter-prev"
        >
          {/* Right arrow (previous in RTL) */}
          <svg
            className="w-5 h-5 flex-shrink-0 opacity-40 group-hover:opacity-70 transition-all group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <div className="text-right min-w-0">
            <span className="text-xs opacity-50 font-inter block">السابق</span>
            <span
              className="block truncate font-nastaliq"
              style={{ lineHeight: '2.2', color: 'var(--color-text)' }}
            >
              {prevChapter.title_urdu || prevChapter.title_english || `Chapter ${prevChapter.chapter_number}`}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next chapter (left arrow in RTL = go forward) */}
      {nextChapter ? (
        <Link
          href={`/books/${bookSlug}/chapter/${nextChapter.chapter_number}/${nextChapter.slug}`}
          onClick={scrollToTop}
          className="group flex items-center gap-3 px-5 py-4 rounded-xl border transition-all hover:shadow-md hover:scale-[1.01] flex-1 max-w-[48%] flex-row-reverse"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
          id="btn-chapter-next"
        >
          {/* Left arrow (next in RTL) */}
          <svg
            className="w-5 h-5 flex-shrink-0 opacity-40 group-hover:opacity-70 transition-all group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <div className="text-left min-w-0">
            <span className="text-xs opacity-50 font-inter block">اگلا</span>
            <span
              className="block truncate font-nastaliq"
              style={{ lineHeight: '2.2', color: 'var(--color-text)' }}
            >
              {nextChapter.title_urdu || nextChapter.title_english || `Chapter ${nextChapter.chapter_number}`}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
