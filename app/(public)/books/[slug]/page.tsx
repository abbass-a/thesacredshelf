import { buildBookMetadata } from '@/lib/seo';
import { BookSchema, BreadcrumbSchema } from '@/components/seo';
import { supabaseAdmin } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types';
import BookCard from '@/components/ui/BookCard';
import AdSlot from '@/components/ui/AdSlot';

export const revalidate = 3600; // 1 hour

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: book } = await supabaseAdmin
    .from('books')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!book) return { title: 'Book Not Found' };

  return buildBookMetadata(book as Book);
}

/**
 * Book detail page — shows cover, description, table of contents.
 */
export default async function BookPage({
  params,
}: {
  params: { slug: string };
}) {
  // 1. Fetch book data with category
  const { data: book } = await supabaseAdmin
    .from('books')
    .select('*, categories(name_english, slug)')
    .eq('slug', params.slug)
    .single();

  if (!book) notFound();

  // 2. Fetch all chapters for TOC
  const { data: chapters } = await supabaseAdmin
    .from('chapters')
    .select('id, chapter_number, title_urdu, title_english, slug, page_start, page_end, estimated_read_minutes')
    .eq('book_id', book.id)
    .order('chapter_number', { ascending: true });

  // 3. Fetch related books (same category, excluding current)
  const { data: relatedBooks } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug, cover_image_url, total_pages, author, translator, category_id, categories(name_english, name_urdu, slug)')
    .eq('category_id', book.category_id)
    .neq('id', book.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const formattedRelatedBooks = (relatedBooks || []).map((b: any) => ({
    ...b,
    category: b.categories
  }));

  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Library', url: 'https://thesacredshelf.com/library' },
    { name: book.title_english, url: `https://thesacredshelf.com/books/${params.slug}` },
  ];

  const categoryName = (book.categories as any)?.name_english || 'Uncategorized';
  const categorySlug = (book.categories as any)?.slug || '';
  const firstChapter = chapters && chapters.length > 0 ? chapters[0] : null;

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-20 pt-10">
      <BookSchema book={book as Book} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          
          {/* Left Column (40%) - Cover & Meta */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={`Cover of ${book.title_english}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No Cover Available
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-4">
              {categorySlug ? (
                <Link href={`/category/${categorySlug}`} className="inline-block">
                  <span className="inline-block px-3 py-1 bg-[#F5EDD8] text-[#A67C2E] text-xs font-semibold uppercase tracking-wider rounded-full">
                    {categoryName}
                  </span>
                </Link>
              ) : (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider rounded-full self-start">
                  {categoryName}
                </span>
              )}
              
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                <span className="text-gray-500">Author</span>
                <span className="font-medium text-gray-900">{book.author}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                <span className="text-gray-500">Translator</span>
                <span className="font-medium text-gray-900">{book.translator}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Pages</span>
                <span className="font-medium text-gray-900">{book.total_pages}</span>
              </div>
            </div>

            {firstChapter ? (
              <Link 
                href={`/books/${params.slug}/chapter/${firstChapter.chapter_number}/${firstChapter.slug}`}
                className="w-full text-center py-4 bg-[#A67C2E] text-white rounded-lg font-bold text-lg hover:bg-[#8e6924] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                </svg>
                Start Reading
              </Link>
            ) : (
              <button disabled className="w-full text-center py-4 bg-gray-300 text-gray-500 rounded-lg font-bold text-lg cursor-not-allowed">
                Chapters Coming Soon
              </button>
            )}
          </div>

          {/* Right Column (60%) - Details & TOC */}
          <div className="lg:w-3/5 flex flex-col gap-8">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-2 leading-tight">
                {book.title_english}
              </h1>
              {book.title_urdu ? (
              <h2 
                className="text-2xl md:text-4xl text-[#A67C2E] mb-6 text-right lg:text-left"
                dir="rtl" 
                lang="ur" 
                style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '1.8' }}
              >
                {book.title_urdu}
              </h2>
              ) : null}
            </div>

            <div className="prose prose-lg max-w-none text-gray-600">
              {book.description_english ? (
                <p>{book.description_english}</p>
              ) : (
                <p className="italic">No English description provided.</p>
              )}
            </div>

            {book.description_urdu && (
              <div 
                className="prose prose-lg max-w-none text-gray-700 text-right mt-4 p-6 bg-[#F5EDD8] rounded-lg"
                dir="rtl" 
                lang="ur" 
              >
                <p style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '2.2', fontSize: '1.25rem' }}>
                  {book.description_urdu}
                </p>
              </div>
            )}

            <div className="my-8">
              <AdSlot slotId="book-detail-middle" className="w-full h-[90px] bg-gray-100 flex items-center justify-center border border-gray-200" />
            </div>

            {/* Table of Contents */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6 border-b border-gray-200 pb-4">
                Table of Contents
              </h3>
              
              {chapters && chapters.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {chapters.map((chapter) => (
                    <Link 
                      key={chapter.id}
                      href={`/books/${params.slug}/chapter/${chapter.chapter_number}/${chapter.slug}`}
                      className="group flex flex-col sm:flex-row justify-between p-4 bg-white rounded border border-gray-100 hover:border-[#A67C2E] hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm group-hover:bg-[#A67C2E] group-hover:text-white transition-colors">
                          {chapter.chapter_number}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 group-hover:text-[#A67C2E] transition-colors">
                            {chapter.title_english || `Chapter ${chapter.chapter_number}`}
                          </span>
                          {chapter.title_urdu ? (
                          <span 
                            className="text-[#A67C2E] text-sm mt-1" 
                            dir="rtl" 
                            lang="ur"
                            style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '1.6' }}
                          >
                            {chapter.title_urdu}
                          </span>
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 sm:mt-0 text-sm text-gray-500 self-end sm:self-center">
                        {chapter.page_start && chapter.page_end && (
                          <span className="whitespace-nowrap hidden sm:inline-block">p. {chapter.page_start}-{chapter.page_end}</span>
                        )}
                        {chapter.estimated_read_minutes && (
                          <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {chapter.estimated_read_minutes} min
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic p-6 bg-gray-50 rounded-lg text-center border border-gray-100">
                  Chapters are currently being digitized.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Books */}
        {formattedRelatedBooks.length > 0 && (
          <div className="pt-16 border-t border-gray-200">
            <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-8">
              More from {categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedRelatedBooks.map((relatedBook: any) => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
