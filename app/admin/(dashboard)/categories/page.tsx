'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Category = {
  id: string;
  name_urdu: string;
  name_english: string;
  slug: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [nameUrdu, setNameUrdu] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [slug, setSlug] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_english');
      
    if (error) {
      console.error(error);
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('categories')
      .insert([{
        name_urdu: nameUrdu,
        name_english: nameEnglish,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setNameUrdu('');
      setNameEnglish('');
      setSlug('');
      fetchCategories();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Books in this category will lose their category association.')) return;
    
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Error deleting: ' + deleteError.message);
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="p-8 pb-20 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Categories</h1>
        <p className="text-gray-500">Add or remove book categories used on your website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Category</h2>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
                <input
                  required
                  type="text"
                  value={nameEnglish}
                  onChange={(e) => {
                    setNameEnglish(e.target.value);
                    // auto-generate slug from english name if slug is empty or user is typing
                    if (!slug || slug === nameEnglish.slice(0, -1).toLowerCase().replace(/\s+/g, '-')) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E]"
                  placeholder="e.g. Islamic History"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urdu Name</label>
                <input
                  required
                  type="text"
                  dir="rtl"
                  value={nameUrdu}
                  onChange={(e) => setNameUrdu(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C2E] font-urdu"
                  placeholder="e.g. اسلامی تاریخ"
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
                  placeholder="islamic-history"
                />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#1C1C1E] text-white rounded-lg font-medium hover:bg-[#A67C2E] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Category Details</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No categories found. Create one to get started!</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{cat.name_english} <span className="font-urdu font-normal text-lg ml-2">{cat.name_urdu}</span></p>
                        <p className="text-gray-500 text-xs mt-1 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">/{cat.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
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
