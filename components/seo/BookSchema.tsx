import { Book } from '@/types';

export default function BookSchema({ book }: { book: Book }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title_english,
    alternateName: book.title_urdu || undefined,
    inLanguage: 'ur',
    author: {
      '@type': 'Person',
      name: book.author,
    },
    translator: {
      '@type': 'Person',
      name: 'Tarique Mahmood Hashmi',
    },
    numberOfPages: book.total_pages,
    url: `https://thesacredshelf.com/books/${book.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'The Sacred Shelf',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
