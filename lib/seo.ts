import { Metadata } from 'next';
import { Book, Chapter } from '@/types';

type SeoProps = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  isArticle?: boolean;
};

const SITE_NAME = 'The Sacred Shelf';
const BASE_URL = 'https://thesacredshelf.com';
const TRANSLATOR_NAME = 'Tarique Mahmood Hashmi';

export function buildMetadata({
  title,
  description,
  path,
  ogImage = '/images/og-default.jpg',
  isArticle = false,
}: SeoProps): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: isArticle ? 'article' : 'website',
      locale: 'ur_PK',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildBookMetadata(book: Book): Metadata {
  const title = `${book.title_english} — Urdu Translation by ${TRANSLATOR_NAME} | ${SITE_NAME}`;
  const description =
    book.meta_description ||
    `Read ${book.title_english} (${book.title_urdu}) online. Urdu translation by ${TRANSLATOR_NAME}.`;
  
  const metadata = buildMetadata({
    title,
    description,
    path: `/books/${book.slug}`,
    ogImage: book.cover_image_url || undefined,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'book',
    },
    other: {
      'content-language': 'ur',
    },
  };
}

export function buildChapterMetadata(chapter: Chapter, book: Book): Metadata {
  const title = `${chapter.title_english || chapter.title_urdu} | ${book.title_english} — ${SITE_NAME}`;
  const description =
    chapter.meta_description ||
    `Read ${chapter.title_english || chapter.title_urdu} from ${book.title_english}. Urdu translation by ${TRANSLATOR_NAME}.`;
  
  const metadata = buildMetadata({
    title,
    description,
    path: `/books/${book.slug}/chapter/${chapter.chapter_number}/${chapter.slug}`,
    isArticle: true,
  });

  return {
    ...metadata,
    other: {
      'content-language': 'ur',
    },
  };
}
