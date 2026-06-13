'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

type Book = {
  id: string;
  title_urdu: string;
  title_english: string;
  slug: string;
  author: string;
  cover_image_url: string | null;
  category_id: string;
};

type Category = {
  id: string;
  name_english: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [titleUrdu, setTitleUrdu] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [descriptionUrdu, setDescriptionUrdu] = useState('');
  const [descriptionEnglish, setDescriptionEnglish] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch categories for dropdown
    const { data: catData } = await supabase.from('categories').select('id, name_english').order('name_english');
    if (catData) {
      setCategories(catData);
      if (catData.length > 0 && !categoryId) setCategoryId(catData[0].id);
    }

    // Fetch books
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (booksError) {
      console.error(booksError);
    } else {
      setBooks(booksData || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('books')
      .insert([{
        title_urdu: titleUrdu,
        title_english: titleEnglish,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        author: author,
        category_id: categoryId,
        cover_image_url: coverUrl || null,
        description_urdu: descriptionUrdu || null,
        description_english: descriptionEnglish || null,
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      // Reset form
      setTitleUrdu('');
      setTitleEnglish('');
      setSlug('');
      setAuthor('');
      setCoverUrl('');
      setDescriptionUrdu('');
      setDescriptionEnglish('');
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book AND all its chapters? This action cannot be undone.')) return;
    
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Error deleting: ' + deleteError.message);
    } else {
      fetchData();
    }
  };

  return (
    <div className="p-8 pb-20 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Books</h1>
        <p className="text-gray-500">Add new books to your library and manage their chapters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Book</h2>
            
            <form onSubmit={handleCreateBook} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name_english}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Title</label>
                <input
                  required
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => {
                    setTitleEnglish(e.target.value);
                    if (!slug || slug === titleEnglish.slice(0, -1).toLowerCase().replace(/\s+/g, '-')) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urdu Title</label>
                <input
                  required
                  type="text"
                  dir="rtl"
                  value={titleUrdu}
                  onChange={(e) => setTitleUrdu(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E] font-urdu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <input
                  required
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  required
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Al-Ghazali / امام غزالی"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#1C1C1E] text-white rounded-lg font-medium hover:bg-[#A67C2E] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Book Details</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">Loading books...</td></tr>
                ) : books.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No books found. Create one to get started!</td></tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/admin/books/${book.id}`} className="flex items-center gap-4 group">
                          {book.cover_image_url ? (
                            <Image src={book.cover_image_url} alt="Cover" width={48} height={64} className="w-12 h-16 object-cover rounded shadow-sm group-hover:opacity-80 transition-opacity" />
                          ) : (
                            <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center group-hover:bg-gray-200 transition-colors">No<br/>Image</div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-[#A67C2E] transition-colors">{book.title_english} <span className="font-urdu font-normal text-lg ml-2">{book.title_urdu}</span></p>
                            <p className="text-gray-500 text-xs mt-1">Author: {book.author || 'Unknown'}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link 
                          href={`/admin/books/${book.id}`}
                          className="text-[#A67C2E] hover:text-yellow-700 font-medium px-3 py-1.5 rounded hover:bg-orange-50 transition-colors inline-block"
                        >
                          Manage Chapters
                        </Link>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          className="text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors inline-block"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
