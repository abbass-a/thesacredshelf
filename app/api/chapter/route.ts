import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * GET /api/chapter?id=[chapter_uuid]
 *
 * Client-side data fetch for the reader.
 * Returns chapter content plus previous/next chapter info for navigation.
 *
 * This route exists alongside SSR so that:
 * - SSR provides the full HTML for Googlebot indexing
 * - This API provides data for client-side navigation between chapters
 *   (avoiding full page reloads) and supports copy-protection flow
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'id query parameter is required' },
      { status: 400 }
    );
  }

  // ── Fetch the requested chapter ────────────────────────────
  const { data: chapter, error: chapterError } = await supabaseAdmin
    .from('chapters')
    .select(
      'id, title_urdu, title_english, content_urdu, chapter_number, page_start, page_end, estimated_read_minutes, book_id'
    )
    .eq('id', id)
    .single();

  if (chapterError || !chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  // ── Fetch previous chapter ─────────────────────────────────
  const { data: prevChapter } = await supabaseAdmin
    .from('chapters')
    .select('id, slug, title_urdu, title_english, chapter_number')
    .eq('book_id', chapter.book_id)
    .eq('chapter_number', chapter.chapter_number - 1)
    .single();

  // ── Fetch next chapter ─────────────────────────────────────
  const { data: nextChapter } = await supabaseAdmin
    .from('chapters')
    .select('id, slug, title_urdu, title_english, chapter_number')
    .eq('book_id', chapter.book_id)
    .eq('chapter_number', chapter.chapter_number + 1)
    .single();

  return NextResponse.json({
    chapter,
    prevChapter: prevChapter ?? null,
    nextChapter: nextChapter ?? null,
  });
}
