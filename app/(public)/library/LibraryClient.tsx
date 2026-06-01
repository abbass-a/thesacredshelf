'use client';

import { useState, useMemo } from 'react';
import type { Book, Category } from '@/types';
import BookCard from '@/components/ui/BookCard';
import BookListRow from '@/components/ui/BookListRow';

type LibraryClientProps = {
  initialBooks: (Pick<Book, 'id' | 'title_urdu' | 'title_english' | 'slug' | 'cover_image_url' | 'description_english' | 'total_pages' | 'author' | 'translator'> & {
    category?: Pick<Category, 'name_urdu' | 'name_english' | 'slug'>;
    chapters?: { count: number }[];
  })[];
  categories: Pick<Category, 'id' | 'name_english' | 'name_urdu' | 'slug'>[];
};

export default function LibraryClient({ initialBooks, categories }: LibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBooks = useMemo(() => {
    return initialBooks.filter(book => {
      // 1. Filter by Category
      if (selectedCategory && book.category?.slug !== selectedCategory) {
        return false;
      }
      
      // 2. Filter by Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesEnglish = book.title_english.toLowerCase().includes(query);
        const matchesUrdu = book.title_urdu.includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query) || false;
        
        if (!matchesEnglish && !matchesUrdu && !matchesAuthor) {
          return false;
        }
      }
      
      return true;
    });
  }, [initialBooks, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search books by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C2E] focus:border-transparent transition-all"
          />
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-md p-1 self-end md:self-auto">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#A67C2E]' : 'text-gray-500 hover:text-gray-700'}`}
            aria-label="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-[#A67C2E]' : 'text-gray-500 hover:text-gray-700'}`}
            aria-label="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null 
              ? 'bg-[#1a1a1a] text-white' 
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.slug 
                ? 'bg-[#1a1a1a] text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <span>{cat.name_english}</span>
            <span className="opacity-70 text-xs" dir="rtl" lang="ur" style={{ fontFamily: 'var(--font-noto-nastaliq), serif' }}>
              {cat.name_urdu}
            </span>
          </button>
        ))}
      </div>

      {/* Results Meta */}
      <div className="text-sm text-gray-500 mb-2 border-b border-gray-200 pb-2">
        Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
      </div>

      {/* Books Display */}
      {filteredBooks.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredBooks.map((book) => (
              <BookListRow key={book.id} book={book as any} />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or category filters.</p>
          {(searchQuery || selectedCategory) && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-4 text-[#A67C2E] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
