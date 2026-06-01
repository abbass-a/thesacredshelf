-- ============================================================
-- Migration: 002_contact_messages.sql
-- ============================================================

CREATE TABLE contact_messages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  message       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Public can insert (submit contact form)
-- -------------------------------------------------------
CREATE POLICY "Public can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- -------------------------------------------------------
-- Authenticated (admin) full SELECT/DELETE
-- -------------------------------------------------------
CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);
