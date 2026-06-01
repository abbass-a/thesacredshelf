// ============================================================
// The Sacred Shelf — Shared TypeScript Types
// ============================================================

/** A translated religious book in the library. */
export interface Book {
  id: string;
  title_urdu: string;
  title_english: string;
  author: string;
  translator: string;
  description_urdu: string;
  description_english: string;
  cover_image_url: string;
  category_id: string;
  total_pages: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  /** Joined from the categories table when needed */
  category?: Category;
  /** Joined from the chapters table when needed */
  chapters?: Chapter[];
}

/** A single chapter within a book. */
export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title_urdu: string;
  title_english: string;
  slug: string;
  content_urdu: string;
  page_start: number;
  page_end: number;
  meta_description: string;
  estimated_read_minutes: number;
  created_at: string;
  /** Joined from the books table when needed */
  book?: Book;
}

/** A book category (e.g. Tafseer, Hadith, Fiqh). */
export interface Category {
  id: string;
  name_urdu: string;
  name_english: string;
  slug: string;
  meta_description: string;
  /** Joined from the books table when needed */
  books?: Book[];
}

/** A single page-visit event recorded by the middleware. */
export interface PageVisit {
  id: string;
  session_id: string;
  page_url: string;
  country: string;
  country_code: string;
  city: string;
  timestamp: string;
  user_agent: string;
}

/** A message submitted via the contact form. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

/** An authenticated admin user (from Supabase Auth). */
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
  last_sign_in_at: string | null;
}

// ============================================================
// Helper / Derived Types
// ============================================================

/** Lightweight book card used on listing pages. */
export type BookCard = Pick<
  Book,
  | 'id'
  | 'title_urdu'
  | 'title_english'
  | 'slug'
  | 'cover_image_url'
  | 'total_pages'
  | 'author'
  | 'translator'
> & {
  category?: Pick<Category, 'name_urdu' | 'name_english' | 'slug'>;
};

/** Chapter entry for a table-of-contents sidebar. */
export type ChapterListItem = Pick<
  Chapter,
  | 'id'
  | 'chapter_number'
  | 'title_urdu'
  | 'title_english'
  | 'slug'
  | 'page_start'
  | 'page_end'
  | 'estimated_read_minutes'
>;

/** Country-level visit aggregation for the admin dashboard. */
export interface CountryVisitSummary {
  country: string;
  country_code: string;
  visit_count: number;
}

/** Daily visit count for time-series charts. */
export interface DailyVisitCount {
  date: string; // ISO date string YYYY-MM-DD
  visit_count: number;
}
