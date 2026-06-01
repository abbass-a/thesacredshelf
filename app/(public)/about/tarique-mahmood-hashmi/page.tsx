import { buildMetadata } from '@/lib/seo';
import { PersonSchema, BreadcrumbSchema } from '@/components/seo';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase-server';
import BookCard from '@/components/ui/BookCard';

export const revalidate = 86400; // 24 hours

export const metadata = buildMetadata({
  title: 'Tarique Mahmood Hashmi — Scholar and Translator | The Sacred Shelf',
  description: 'Learn about Tarique Mahmood Hashmi, religious scholar and translator of classical Islamic texts into Urdu.',
  path: '/about/tarique-mahmood-hashmi',
});

/**
 * About Tarique Mahmood Hashmi — translator biography page.
 */
export default async function AboutTranslatorPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'About Tarique Mahmood Hashmi', url: 'https://thesacredshelf.com/about/tarique-mahmood-hashmi' },
  ];

  // Fetch all books translated by Tarique Mahmood Hashmi
  const { data: books } = await supabaseAdmin
    .from('books')
    .select('id, title_urdu, title_english, slug, cover_image_url, total_pages, author, translator, category_id, categories(name_english, name_urdu, slug)')
    .order('title_english', { ascending: true });

  const formattedBooks = (books || []).map((b: any) => ({
    ...b,
    category: b.categories
  }));

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-24 pt-10">
      <PersonSchema />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto px-6">
        {/* Header section with photo and name */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16">
          <div className="shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-[#F5EDD8]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 opacity-30">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-center md:text-left pt-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-2">
              Tarique Mahmood Hashmi
            </h1>
            <p className="text-xl md:text-2xl text-[#A67C2E] font-serif mb-6">
              Scholar and Translator
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
              <span className="bg-white px-4 py-2 rounded-full border border-gray-200 text-gray-700 shadow-sm">Urdu Literature</span>
              <span className="bg-white px-4 py-2 rounded-full border border-gray-200 text-gray-700 shadow-sm">Islamic Theology</span>
              <span className="bg-white px-4 py-2 rounded-full border border-gray-200 text-gray-700 shadow-sm">Classical Translation</span>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <section className="prose prose-lg max-w-none text-gray-700 mb-16 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">Biography</h2>
          
          <p>
            Tarique Mahmood Hashmi has dedicated his life to bridging the profound linguistic gap in classical Islamic scholarship. Recognized for his deep understanding of both traditional Islamic sciences and modern literary Urdu, his work ensures that the wisdom of historical scholars remains vividly accessible to contemporary readers.
          </p>
          <p>
            With formal training in Arabic linguistics, Islamic jurisprudence (Fiqh), and exegesis (Tafseer), Tarique Mahmood Hashmi brings a unique rigor to his translations. He approaches each text not merely as a linguistic conversion, but as a preservation of spiritual context. His translations are characterized by their fluency, elegance, and unwavering faithfulness to the original authors' intent.
          </p>
          <p>
            Over the years, he has systematically focused on seminal works that form the bedrock of Islamic thought. From intricate legal treatises to deeply moving spiritual texts, his portfolio encompasses a wide spectrum of the Islamic intellectual tradition. His efforts have provided Urdu-speaking audiences worldwide with reliable, beautifully crafted editions of texts that were previously difficult to access or understand.
          </p>
          <p>
            Beyond translation, Tarique Mahmood Hashmi is also actively involved in educational initiatives, striving to revive the culture of deep, contemplative reading among the youth. The Sacred Shelf project stands as a digital monument to his life's work—a free, open library offering his translations to anyone seeking knowledge.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="bg-[#1C1C1E] text-[#E8E4DC] p-8 md:p-12 rounded-2xl shadow-lg mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A67C2E] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="font-serif text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#A67C2E]">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
            </svg>
            The Mission
          </h2>
          <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed relative z-10 pl-6 border-l-4 border-[#A67C2E]">
            "To unlock the intellectual and spiritual treasures of our past by rendering classical Arabic and Persian texts into clear, dignified Urdu—ensuring that geographical and linguistic barriers do not stand between the seeker and the knowledge they seek."
          </blockquote>
        </section>

        {/* Translated Works */}
        <section>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#1a1a1a]">Complete Translated Works</h2>
            <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
              {formattedBooks.length} Books
            </span>
          </div>
          
          {formattedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {formattedBooks.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-lg border border-gray-200 border-dashed">
              <p className="text-gray-500">No translated works have been added to the library yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
