import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { ChapterListItem } from '@/types';
import WatermarkOverlay from '@/components/reader/WatermarkOverlay';
import ReadingProgressBar from '@/components/reader/ReadingProgressBar';
import ReaderControls from '@/components/reader/ReaderControls';
import TableOfContents from '@/components/reader/TableOfContents';
import ChapterNavigation from '@/components/reader/ChapterNavigation';
import AdSlot from '@/components/ui/AdSlot';

// ── Client-only components (no SSR) ────────────────────────────
const CopyProtection = dynamic(
  () => import('@/components/reader/CopyProtection'),
  { ssr: false }
);
const ReaderInitializer = dynamic(
  () => import('@/components/reader/ReaderInitializer'),
  { ssr: false }
);

// ============================================================
// Static Params — pre-render all chapters at build time
// ============================================================
export const revalidate = 0; // Fetch fresh data on every request

export async function generateStaticParams() {
  const { data: chapters } = await supabaseAdmin
    .from('chapters')
    .select('chapter_number, slug, book_id, books!inner(slug)')
    .order('chapter_number', { ascending: true });

  if (!chapters) return [];

  return chapters.map((ch: Record<string, unknown>) => {
    const book = ch.books as { slug: string } | null;
    return {
      slug: book?.slug ?? '',
      number: String(ch.chapter_number),
      chapterSlug: ch.slug as string,
    };
  });
}

import { buildChapterMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/seo';

// ============================================================
// Dynamic Metadata — SEO for each chapter
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: { slug: string; number: string; chapterSlug: string };
}): Promise<Metadata> {
  const { slug: bookSlug, number } = params;

  const { data: book } = await supabaseAdmin
    .from('books')
    .select('id, title_english, title_urdu, meta_title, slug, cover_image_url, meta_description, author, total_pages')
    .eq('slug', bookSlug)
    .single();

  if (!book) return { title: 'Chapter Not Found' };

  const { data: chapter } = await supabaseAdmin
    .from('chapters')
    .select('title_urdu, title_english, meta_description, chapter_number, slug')
    .eq('book_id', book.id)
    .eq('chapter_number', parseInt(number, 10))
    .single();

  if (!chapter) return { title: 'Chapter Not Found' };

  return buildChapterMetadata(chapter as any, book as any);
}

// ============================================================
// Page Component (SSR)
// ============================================================
export default async function ChapterReaderPage({
  params,
}: {
  params: { slug: string; number: string; chapterSlug: string };
}) {
  const { slug: bookSlug, number } = params;
  const chapterNumber = parseInt(number, 10);

  // ── Fetch book ──────────────────────────────────────────────
  const { data: book, error: bookError } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug')
    .eq('slug', bookSlug)
    .single();

  if (bookError || !book) notFound();

  // ── Fetch current chapter ───────────────────────────────────
  const { data: chapter, error: chapterError } = await supabaseAdmin
    .from('chapters')
    .select(
      'id, title_urdu, title_english, content_urdu, chapter_number, page_start, page_end, estimated_read_minutes, slug'
    )
    .eq('book_id', book.id)
    .eq('chapter_number', chapterNumber)
    .single();

  if (chapterError || !chapter) notFound();

  // ── Fetch all chapters for TOC ──────────────────────────────
  const { data: allChapters } = await supabaseAdmin
    .from('chapters')
    .select(
      'id, chapter_number, title_urdu, title_english, slug, page_start, page_end, estimated_read_minutes'
    )
    .eq('book_id', book.id)
    .order('chapter_number', { ascending: true });

  const tocChapters: ChapterListItem[] = allChapters ?? [];

  // ── Fetch prev/next chapters ────────────────────────────────
  const { data: prevChapter } = await supabaseAdmin
    .from('chapters')
    .select('id, slug, title_urdu, title_english, chapter_number')
    .eq('book_id', book.id)
    .eq('chapter_number', chapterNumber - 1)
    .single();

  const { data: nextChapter } = await supabaseAdmin
    .from('chapters')
    .select('id, slug, title_urdu, title_english, chapter_number')
    .eq('book_id', book.id)
    .eq('chapter_number', chapterNumber + 1)
    .single();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Library', url: 'https://thesacredshelf.com/library' },
    { name: book.title_english, url: `https://thesacredshelf.com/books/${book.slug}` },
    { name: chapter.title_english || chapter.title_urdu, url: `https://thesacredshelf.com/books/${book.slug}/chapter/${chapterNumber}/${chapter.slug}` },
  ];

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {/* Client-only: copy protection + reader initializer */}
      <CopyProtection />
      <ReaderInitializer />

      {/* TOC Sidebar */}
      <TableOfContents
        chapters={tocChapters}
        bookSlug={book.slug}
        activeChapterNumber={chapterNumber}
      />

      {/* Main reader area */}
      <div className="xl:ml-[300px] min-h-screen flex flex-col">
        {/* ── Sticky Top Bar ─────────────────────────────── */}
        <header className="sticky top-0 z-20" style={{ background: 'var(--color-bg)' }}>
          <div
            className="flex items-center justify-between px-6 py-3 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Book title (English) — left */}
            <Link
              href={`/books/${book.slug}`}
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity truncate max-w-[40%] font-inter"
              id="link-book-title"
            >
              {book.title_english}
            </Link>

            {/* Chapter name — right */}
            {chapter.title_urdu ? (
            <h1
              className="text-lg font-bold truncate max-w-[55%]"
              dir="rtl"
              lang="ur"
              style={{
                fontFamily: 'var(--font-noto-nastaliq), serif',
                lineHeight: '2',
                color: 'var(--color-accent)',
              }}
            >
              {chapter.title_urdu}
            </h1>
            ) : (
            <h1
              className="text-lg font-bold truncate max-w-[55%]"
              style={{ color: 'var(--color-accent)' }}
            >
              {chapter.title_english || `Chapter ${chapterNumber}`}
            </h1>
            )}
          </div>

          {/* Reading progress bar */}
          <ReadingProgressBar />
        </header>

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <nav
          className="px-6 py-3 text-xs font-inter"
          aria-label="Breadcrumb"
          id="breadcrumb"
        >
          <ol className="flex items-center gap-1.5 flex-wrap opacity-60">
            <li>
              <Link href="/" className="hover:underline hover:opacity-100">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link href="/library" className="hover:underline hover:opacity-100">
                Library
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link
                href={`/books/${book.slug}`}
                className="hover:underline hover:opacity-100"
              >
                {book.title_english}
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium opacity-100">
              {chapter.title_english || chapter.title_urdu}
            </li>
          </ol>
        </nav>

        {/* ── Main Content Container ─────────────────────── */}
        <main className="flex-1 flex justify-center px-4 md:px-6">
          <div className="w-full" style={{ maxWidth: '760px' }}>
            {/* AdSense slot — ABOVE reader controls only */}
            <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_READER} />

            {/* Reader controls */}
            <div className="mb-6">
              <ReaderControls
                estimatedReadMinutes={chapter.estimated_read_minutes ?? 5}
              />
            </div>

            {/* ── Reader Content Area ────────────────────── */}
            <article className="relative">
              {/* Watermark overlay */}
              <WatermarkOverlay />

              {/* The actual Urdu content — fully server-rendered for Googlebot */}
              <div
                id="reader-content"
                dir="rtl"
                lang="ur"
                className="relative"
                style={{
                  fontFamily: 'var(--font-noto-nastaliq), "Noto Nastaliq Urdu", serif',
                  fontSize: 'var(--reader-font-size, 22px)',
                  lineHeight: '2.4',
                  textAlign: 'right',
                  maxWidth: '760px',
                  padding: '48px 40px',
                  color: 'var(--color-text)',
                }}
              >
                {/* Render the Urdu content as HTML */}
                <div
                  dangerouslySetInnerHTML={{ __html: chapter.content_urdu }}
                />
              </div>
            </article>

            {/* ── Bottom Chapter Navigation ──────────────── */}
            <ChapterNavigation
              bookSlug={book.slug}
              prevChapter={prevChapter ?? null}
              nextChapter={nextChapter ?? null}
            />
          </div>
        </main>
      </div>
    </>
  );
}
