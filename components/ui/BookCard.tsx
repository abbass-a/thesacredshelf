import Image from 'next/image';
import Link from 'next/link';
import type { BookCard as BookCardType } from '@/types';

export default function BookCard({ book, priority = false }: { book: BookCardType, priority?: boolean }) {
  return (
    <Link href={`/books/${book.slug}`} className="group flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full bg-gray-100 overflow-hidden">
        {book.cover_image_url ? (
          <Image
            src={book.cover_image_url}
            alt={`Cover of ${book.title_english}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Cover Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {book.category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C2E] mb-2">
            {book.category.name_english}
          </span>
        )}
        
        {book.title_urdu ? (
        <h3 
          className="text-xl font-bold mb-2 text-right text-gray-900 group-hover:text-[#A67C2E] transition-colors"
          dir="rtl"
          lang="ur"
          style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '1.8' }}
        >
          {book.title_urdu}
        </h3>
        ) : null}
        
        <h4 className="text-sm font-medium text-gray-600 mb-4 flex-grow">
          {book.title_english}
        </h4>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
          <span>{book.total_pages} Pages</span>
          <span className="flex items-center gap-1 text-[#A67C2E] font-medium">
            Read
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
