import { buildMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/seo';
import { supabaseAdmin } from '@/lib/supabase-server';
import LibraryClient from './LibraryClient';
import AdSlot from '@/components/ui/AdSlot';

export const revalidate = 3600; // 1 hour

export const metadata = buildMetadata({
  title: 'Browse All Books — The Sacred Shelf',
  description: 'Browse the complete library of translated Islamic texts by Tarique Mahmood Hashmi.',
  path: '/library',
});

/**
 * Library page — browse all books.
 */
export default async function LibraryPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Library', url: 'https://thesacredshelf.com/library' },
  ];

  // Fetch all books with their category and chapter count
  const { data: books } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug, cover_image_url, description_english, total_pages, author, translator, category_id, categories(name_english, name_urdu, slug), chapters(count)')
    .order('title_english', { ascending: true });

  // Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name_english, name_urdu, slug')
    .order('name_english', { ascending: true });

  const formattedBooks = (books || []).map((b: any) => ({
    ...b,
    category: b.categories,
  }));

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-20 pt-10">
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Browse All Books
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our complete collection of classical Islamic works translated into Urdu by Tarique Mahmood Hashmi.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <LibraryClient 
              initialBooks={formattedBooks as any} 
              categories={categories as any} 
            />
          </div>

          {/* Sidebar / AdSlot */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h3 className="font-serif font-bold text-lg mb-4 text-[#1a1a1a]">Support The Project</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your support helps us translate more works. Consider sharing this library with your community.
                </p>
                <div className="w-full flex justify-center bg-gray-50 border border-gray-200 rounded min-h-[250px]">
                  <AdSlot slotId="library-sidebar" className="w-[300px] h-[250px]" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
