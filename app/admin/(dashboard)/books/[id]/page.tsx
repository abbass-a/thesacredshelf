'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/RichTextEditor';

type Book = {
  id: string;
  title_english: string;
  title_urdu: string;
  slug: string;
};

type Chapter = {
  id: string;
  chapter_number: number;
  title_urdu: string;
  title_english: string;
  slug: string;
  content_urdu: string;
};

export default function ChaptersPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chapterNumber, setChapterNumber] = useState<number | ''>('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [slug, setSlug] = useState('');
  const [contentUrdu, setContentUrdu] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch Book
    const { data: bookData } = await supabase.from('books').select('*').eq('id', id).single();
    if (bookData) setBook(bookData);

    // Fetch Chapters
    const { data: chapData } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', id)
      .order('chapter_number', { ascending: true });
      
    if (chapData) setChapters(chapData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleEdit = (chapter: Chapter) => {
    setEditingId(chapter.id);
    setChapterNumber(chapter.chapter_number);
    setTitleUrdu(chapter.title_urdu);
    setTitleEnglish(chapter.title_english || '');
    setSlug(chapter.slug);
    setContentUrdu(chapter.content_urdu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setChapterNumber('');
    setTitleUrdu('');
    setTitleEnglish('');
    setSlug('');
    setContentUrdu('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chapterNumber === '') {
      setError('Chapter number is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      book_id: id,
      chapter_number: chapterNumber,
      title_urdu: titleUrdu,
      title_english: titleEnglish || null,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      content_urdu: contentUrdu,
    };

    let responseError;

    if (editingId) {
      // Update
      const { error: updateError } = await supabase
        .from('chapters')
        .update(payload)
        .eq('id', editingId);
      responseError = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('chapters')
        .insert([payload]);
      responseError = insertError;
    }

    if (responseError) {
      setError(responseError.message);
    } else {
      handleCancelEdit(); // reset form
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This cannot be undone.')) return;
    
    const { error: deleteError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (deleteError) {
      alert('Error deleting: ' + deleteError.message);
    } else {
      fetchData();
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!book) return <div className="p-8">Book not found.</div>;

  return (
    <div className="p-8 pb-20 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin/books" className="text-[#A67C2E] hover:underline text-sm mb-2 inline-block">&larr; Back to Books</Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {book.title_english} <span className="font-urdu font-normal text-2xl ml-2">{book.title_urdu}</span>
          </h1>
          <p className="text-gray-500">Manage chapters and content for this book.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Form Section */}
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Chapter' : 'Add New Chapter'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Number</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(parseInt(e.target.value) || '')}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Title</label>
                <input
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => {
                    setTitleEnglish(e.target.value);
                    if (!slug && !editingId) {
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Chapter Content (Urdu)</span>
                </label>
                <div className="font-urdu leading-loose" dir="rtl">
                  <RichTextEditor
                    value={contentUrdu}
                    onChange={(html) => setContentUrdu(html)}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#1C1C1E] text-white rounded-lg font-medium hover:bg-[#A67C2E] transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Chapter' : 'Add Chapter')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium w-16">Ch #</th>
                  <th className="px-6 py-4 font-medium">Chapter Title</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chapters.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No chapters yet. Add the first chapter!</td></tr>
                ) : (
                  chapters.map((chapter) => (
                    <tr key={chapter.id} className={`hover:bg-gray-50 ${editingId === chapter.id ? 'bg-orange-50/50' : ''}`}>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        {chapter.chapter_number}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{chapter.title_english || 'No English Title'} <span className="font-urdu font-normal text-lg ml-2">{chapter.title_urdu}</span></p>
                        <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">{chapter.content_urdu.substring(0, 50)}...</p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link
                          href={`/books/${book.slug}/chapter/${chapter.chapter_number}/${chapter.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded hover:bg-gray-100 transition-colors inline-block"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleEdit(chapter)}
                          className="text-[#A67C2E] hover:text-yellow-700 font-medium px-3 py-1.5 rounded hover:bg-orange-50 transition-colors inline-block"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(chapter.id)}
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
