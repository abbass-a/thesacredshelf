import { buildMetadata } from '@/lib/seo';
import { WebsiteSchema, BreadcrumbSchema } from '@/components/seo';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase-server';
import BookCard from '@/components/ui/BookCard';
import AdSlot from '@/components/ui/AdSlot';
import type { BookCard as BookCardType } from '@/types';

export const revalidate = 3600; // 1 hour

export const metadata = buildMetadata({
  title: 'The Sacred Shelf — Urdu Translations of Seminal Religious Works by Tarique Mahmood Hashmi',
  description: 'A digital library of Urdu-language translated religious books. Read online for free — translated by Tarique Mahmood Hashmi.',
  path: '/',
});

/**
 * Homepage — The Sacred Shelf
 * Displays featured books, categories, and recent additions.
 */
export default async function HomePage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
  ];

  // Fetch 6 recent/featured books
  const { data: featuredBooks } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug, cover_image_url, total_pages, author, translator, category_id, categories(name_english, name_urdu, slug)')
    .order('created_at', { ascending: false })
    .limit(6);

  // Fetch all categories for the horizontal scroll
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name_english, name_urdu, slug')
    .order('name_english', { ascending: true });

  const books: BookCardType[] = (featuredBooks || []).map((b: any) => ({
    ...b,
    category: b.categories
  }));

  return (
    <main className="min-h-screen pb-20">
      <WebsiteSchema />
      <BreadcrumbSchema items={breadcrumbItems} />
      <h1 className="sr-only">The Sacred Shelf — مقدس شیلف</h1>
      
      {/* Top AdSlot */}
      <div className="w-full bg-gray-50 border-b border-gray-100 flex justify-center py-4">
        <AdSlot slotId="home-top-banner" className="w-[728px] h-[90px] bg-gray-200" />
      </div>

      {/* Hero Section */}
      <section className="bg-[#FAFAF7] pt-20 pb-24 px-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #A67C2E 0%, transparent 70%)' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#1a1a1a] tracking-tight mb-6 leading-tight">
            The Sacred Shelf
          </h2>
          <p className="text-xl md:text-2xl text-[#A67C2E] font-serif mb-8 max-w-2xl mx-auto italic">
            Seminal Religious Works, Translated for the World by Tarique Mahmood Hashmi
          </p>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed text-lg">
            Welcome to a comprehensive digital library dedicated to the preservation and dissemination of classical Islamic texts. 
            Experience these profound works translated into elegant, accessible Urdu, complete with an immersive digital reading environment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/library" className="w-full sm:w-auto px-8 py-3.5 bg-[#A67C2E] text-white rounded-md font-medium hover:bg-[#8e6924] transition-colors shadow-sm">
              Browse Library
            </Link>
            <Link href="/about/tarique-mahmood-hashmi" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 text-gray-800 rounded-md font-medium hover:border-[#A67C2E] hover:text-[#A67C2E] transition-colors shadow-sm">
              About the Translator
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">Featured Translations</h2>
            <p className="text-gray-500">Recently added classical works in Urdu.</p>
          </div>
          <Link href="/library" className="hidden md:flex items-center gap-1 text-[#A67C2E] font-medium hover:underline">
            View all books
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-100 border-dashed">
            No featured books found.
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/library" className="inline-flex items-center gap-1 text-[#A67C2E] font-medium hover:underline">
            View all books
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-16 bg-[#1C1C1E] text-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center">Browse by Category</h2>
          
          <div className="flex overflow-x-auto pb-6 hide-scrollbar gap-4 snap-x px-4 md:px-0 justify-start md:justify-center">
            {categories?.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`}
                className="snap-center shrink-0 px-8 py-4 bg-[#2A2A2D] rounded-full hover:bg-[#A67C2E] transition-colors border border-gray-700 hover:border-[#A67C2E] flex flex-col items-center gap-1 min-w-[140px]"
              >
                <span className="font-medium">{cat.name_english}</span>
                <span className="text-sm opacity-70" dir="rtl" lang="ur" style={{ fontFamily: 'var(--font-noto-nastaliq), serif' }}>
                  {cat.name_urdu}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Translator Teaser */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-gray-100 relative min-h-[300px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-[#F5EDD8]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mb-4 opacity-50">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              <span>Translator Portrait Placeholder</span>
            </div>
          </div>
          <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">Tarique Mahmood Hashmi</h2>
            <p className="text-[#A67C2E] font-medium mb-6">Religious Scholar & Translator</p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tarique Mahmood Hashmi has dedicated his life to bridging the linguistic gap in Islamic scholarship. 
              By meticulously translating seminal Arabic and Persian texts into elegant Urdu, he ensures that the 
              profound wisdom of classical scholars remains accessible to modern readers. His work focuses on accuracy, 
              fluency, and preserving the spiritual essence of the original texts.
            </p>
            <div>
              <Link href="/about/tarique-mahmood-hashmi" className="inline-block px-6 py-2 border-2 border-[#1a1a1a] text-[#1a1a1a] rounded hover:bg-[#1a1a1a] hover:text-white transition-colors font-medium">
                Read Full Biography
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom AdSlot */}
      <div className="w-full flex justify-center py-8">
        <AdSlot slotId="home-bottom-banner" className="w-[728px] h-[90px] bg-gray-100 border border-dashed border-gray-300" />
      </div>

    </main>
  );
}
