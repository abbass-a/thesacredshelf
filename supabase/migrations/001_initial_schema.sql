-- ============================================================
-- The Sacred Shelf — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Categories
-- ============================================================
CREATE TABLE categories (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name_urdu       TEXT        NOT NULL,
  name_english    TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  meta_description TEXT
);

-- ============================================================
-- 2. Books
-- ============================================================
CREATE TABLE books (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_urdu        TEXT        NOT NULL,
  title_english     TEXT        NOT NULL,
  author            TEXT        NOT NULL,
  translator        TEXT        NOT NULL DEFAULT 'Tarique Mahmood Hashmi',
  description_urdu  TEXT,
  description_english TEXT,
  cover_image_url   TEXT,
  category_id       UUID        REFERENCES categories(id) ON DELETE SET NULL,
  total_pages       INTEGER     NOT NULL DEFAULT 0,
  slug              TEXT        NOT NULL UNIQUE,
  meta_title        TEXT,
  meta_description  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Chapters
-- ============================================================
CREATE TABLE chapters (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id               UUID        NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number        INTEGER     NOT NULL,
  title_urdu            TEXT        NOT NULL,
  title_english         TEXT,
  slug                  TEXT        NOT NULL,
  content_urdu          TEXT        NOT NULL DEFAULT '',
  page_start            INTEGER,
  page_end              INTEGER,
  meta_description      TEXT,
  estimated_read_minutes INTEGER   DEFAULT 5,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- A book cannot have two chapters with the same number
  CONSTRAINT uq_chapters_book_number UNIQUE (book_id, chapter_number),
  -- A book cannot have two chapters with the same slug
  CONSTRAINT uq_chapters_book_slug   UNIQUE (book_id, slug)
);

-- ============================================================
-- 4. Page Visits (analytics)
-- ============================================================
CREATE TABLE page_visits (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT,
  page_url      TEXT        NOT NULL,
  country       TEXT,
  country_code  CHAR(2),
  city          TEXT,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent    TEXT
);

-- ============================================================
-- 5. Indexes
-- ============================================================
CREATE INDEX idx_books_slug               ON books      (slug);
CREATE INDEX idx_chapters_book_number     ON chapters   (book_id, chapter_number);
CREATE INDEX idx_page_visits_timestamp    ON page_visits (timestamp);
CREATE INDEX idx_page_visits_country_code ON page_visits (country_code);
CREATE INDEX idx_page_visits_session_id   ON page_visits (session_id);

-- ============================================================
-- 6. Row Level Security
-- ============================================================

-- Enable RLS on every table
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE books       ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters    ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Public (anon) read access — books, chapters, categories
-- -------------------------------------------------------
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read books"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Public can read chapters"
  ON chapters FOR SELECT
  USING (true);

-- -------------------------------------------------------
-- Authenticated (admin) full SELECT on all tables
-- -------------------------------------------------------
CREATE POLICY "Admins can read all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read all books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read all chapters"
  ON chapters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read page_visits"
  ON page_visits FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- Authenticated (admin) INSERT/UPDATE/DELETE on content tables
-- -------------------------------------------------------
CREATE POLICY "Admins can insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update books"
  ON books FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete books"
  ON books FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert chapters"
  ON chapters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update chapters"
  ON chapters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete chapters"
  ON chapters FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- page_visits: allow service-role INSERT (via API route)
-- The service role key bypasses RLS, so no explicit INSERT
-- policy is needed for the middleware/API route that records visits.
-- But we add one for authenticated users too, just in case.
CREATE POLICY "Admins can insert page_visits"
  ON page_visits FOR INSERT
  TO authenticated
  WITH CHECK (true);
