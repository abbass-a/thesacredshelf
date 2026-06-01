import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-server';

export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thesacredshelf.com';

  // 1. Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/tarique-mahmood-hashmi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Fetch data from Supabase
  const [
    { data: categories },
    { data: books },
    { data: chapters }
  ] = await Promise.all([
    supabaseAdmin.from('categories').select('slug'),
    supabaseAdmin.from('books').select('slug, created_at'),
    supabaseAdmin.from('chapters').select('chapter_number, slug, created_at, books!inner(slug)')
  ]);

  // 3. Category routes
  if (categories) {
    categories.forEach((cat) => {
      routes.push({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  }

  // 4. Book routes
  if (books) {
    books.forEach((book) => {
      routes.push({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: new Date(book.created_at),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  }

  // 5. Chapter routes
  if (chapters) {
    chapters.forEach((ch: any) => {
      const bookSlug = ch.books?.slug;
      if (bookSlug) {
        routes.push({
          url: `${baseUrl}/books/${bookSlug}/chapter/${ch.chapter_number}/${ch.slug}`,
          lastModified: new Date(ch.created_at),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });
  }

  return routes;
}
