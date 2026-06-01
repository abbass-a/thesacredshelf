import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/types';

type BookListRowProps = {
  book: Pick<Book, 'id' | 'title_urdu' | 'title_english' | 'slug' | 'cover_image_url' | 'description_english' | 'total_pages'> & {
    chapters?: { count: number }[];
  };
};

export default function BookListRow({ book }: BookListRowProps) {
  const chapterCount = book.chapters?.[0]?.count || 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Cover Image */}
      <div className="relative w-full md:w-40 aspect-[2/3] shrink-0 bg-gray-100 rounded overflow-hidden">
        {book.cover_image_url ? (
          <Image
            src={book.cover_image_url}
            alt={`Cover of ${book.title_english}`}
            fill
            sizes="(max-width: 768px) 100vw, 160px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 text-center p-2">
            No Cover
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col md:flex-row md:justify-between items-start mb-2 gap-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
              {book.title_english}
            </h3>
            <h4 
              className="text-lg text-gray-600 text-right md:text-left"
              dir="rtl"
              lang="ur"
              style={{ fontFamily: 'var(--font-noto-nastaliq), serif', lineHeight: '1.8' }}
            >
              {book.title_urdu}
            </h4>
          </div>
          
          <Link 
            href={`/books/${book.slug}`}
            className="shrink-0 bg-[#A67C2E] text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-[#8e6924] transition-colors shadow-sm"
          >
            Read Book
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-4 mb-6 line-clamp-3 leading-relaxed">
          {book.description_english || 'No description available for this book.'}
        </p>

        <div className="flex items-center gap-6 mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            {book.total_pages} Pages
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {chapterCount} Chapters
          </div>
        </div>
      </div>
    </div>
  );
}
