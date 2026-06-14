'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ChapterListItem } from '@/types';

/**
 * TableOfContents — collapsible sidebar showing all chapters in the book.
 * Active chapter highlighted in gold. RTL-aware with Urdu titles.
 */
export default function TableOfContents({
  chapters,
  bookSlug,
  activeChapterNumber,
}: {
  chapters: ChapterListItem[];
  bookSlug: string;
  activeChapterNumber: number;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Toggle button — visible on all sizes */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="fixed top-20 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center border shadow-md transition-all hover:scale-105 xl:hidden"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        aria-label={collapsed ? 'Show table of contents' : 'Hide table of contents'}
        id="btn-toc-toggle"
      >
        <svg
          className={`w-5 h-5 transition-transform ${collapsed ? '' : 'rotate-180'}`}
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
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out ${
          collapsed ? '-translate-x-full' : 'translate-x-0'
        } xl:translate-x-0`}
        style={{ width: '300px' }}
        dir="rtl"
      >
        <div
          className="h-full overflow-y-auto border-l pt-16 pb-8"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <h2
                className="font-nastaliq text-lg font-bold"
                style={{ color: 'var(--color-accent)', lineHeight: '2' }}
              >
                فہرست ابواب
              </h2>
              {/* Close button (desktop) */}
              <button
                onClick={() => setCollapsed(true)}
                className="hidden xl:flex w-8 h-8 rounded-lg items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Collapse table of contents"
                id="btn-toc-close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chapter list */}
          <nav className="px-3 py-2" aria-label="Table of contents">
            <ul className="space-y-0.5">
              {chapters.map((ch) => {
                const isActive = ch.chapter_number === activeChapterNumber;
                return (
                  <li key={ch.id}>
                    <Link
                      href={`/books/${bookSlug}/chapter/${ch.chapter_number}/${ch.slug}`}
                      className={`block px-4 py-3 rounded-lg text-right transition-all ${
                        isActive
                          ? 'font-bold'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        fontFamily: 'var(--font-noto-nastaliq), serif',
                        lineHeight: '2.2',
                        color: isActive ? '#A67C2E' : 'var(--color-text)',
                        backgroundColor: isActive ? 'rgba(166, 124, 46, 0.08)' : undefined,
                        borderRight: isActive ? '3px solid #A67C2E' : '3px solid transparent',
                      }}
                    >
                      <span className="text-xs opacity-50 font-inter ml-2 inline-block" dir="ltr">
                        {ch.chapter_number}
                      </span>
                      {ch.title_urdu || ch.title_english || `Chapter ${ch.chapter_number}`}
                      {ch.page_start && ch.page_end && (
                        <span className="block text-xs opacity-40 font-inter mt-0.5" dir="ltr">
                          pp. {ch.page_start}–{ch.page_end}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Backdrop for mobile/tablet */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/30 xl:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
