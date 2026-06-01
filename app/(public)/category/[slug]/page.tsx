import { buildMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/seo';
import { supabaseAdmin } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import BookCard from '@/components/ui/BookCard';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('name_english, name_urdu, meta_description')
    .eq('slug', params.slug)
    .single();

  if (!category) return { title: 'Category Not Found' };

  return buildMetadata({
    title: `${category.name_english} Books in Urdu — Translated by Tarique Mahmood Hashmi | The Sacred Shelf`,
    description: category.meta_description || `Browse Urdu translations of ${category.name_english} books by Tarique Mahmood Hashmi.`,
    path: `/category/${params.slug}`,
  });
}

/**
 * Category page — shows all books in a given category.
 */
export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('id, name_english, name_urdu')
    .eq('slug', params.slug)
    .single();

  if (!category) notFound();

  // Fetch books for this category
  const { data: books } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug, cover_image_url, total_pages, author, translator, category_id, categories(name_english, name_urdu, slug)')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  const formattedBooks = (books || []).map((b: any) => ({
    ...b,
    category: b.categories
  }));

  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Library', url: 'https://thesacredshelf.com/library' },
    { name: category.name_english, url: `https://thesacredshelf.com/category/${params.slug}` },
  ];

  // Hardcode simple descriptions based on slug (in a real app, this would be from DB)
  const categoryDescriptions: Record<string, string> = {
    'tafseer': 'Exegesis and profound interpretation of the Holy Quran, unfolding its deeper meanings and context.',
    'hadith': 'The collected traditions containing sayings and actions of Prophet Muhammad (PBUH), serving as a major source of guidance.',
    'fiqh': 'Islamic jurisprudence and understanding of divine law derived from primary sources.',
    'seerah': 'Biographical accounts of the Prophet Muhammad (PBUH) documenting his life, character, and mission.',
    'sufism': 'Works focusing on the inward purification, spiritual development, and proximity to the Divine.',
  };
  
  const description = categoryDescriptions[params.slug.toLowerCase()] || `Explore our collection of classical Urdu translations in the field of ${category.name_english}.`;

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-20 pt-10">
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            {category.name_english}
          </h1>
          <h2 
            className="text-3xl text-[#A67C2E] mb-6"
            dir="rtl" 
            lang="ur" 
            style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '1.8' }}
          >
            {category.name_urdu}
          </h2>
          <p className="text-gray-600 text-lg">
            {description}
          </p>
        </header>

        {formattedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedBooks.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No books currently available</h3>
            <p className="text-gray-500">Check back later for new translations in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
