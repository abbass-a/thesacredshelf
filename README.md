# The Sacred Shelf
**مقدس شیلف — Seminal Religious Works, Translated for the World**

The Sacred Shelf is a digital library platform dedicated to the preservation and dissemination of classical Islamic texts translated into Urdu by Tarique Mahmood Hashmi. 

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **Analytics:** Google Analytics 4 (Data API) + Custom Middleware Tracking
- **Ads:** Google AdSense
- **Visuals:** Recharts (Admin Dashboard)

## Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-username/thesacredshelf.git
cd thesacredshelf
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```
*(See the `.env.local.example` file for details on how to acquire each key).*

### 3. Supabase Setup
1. Create a project on [Supabase](https://supabase.com).
2. Go to SQL Editor and run the two migration files found in `supabase/migrations/`:
   - `001_initial_schema.sql`
   - `002_contact_messages.sql`
3. In Authentication settings, enable Email login. Note that public user registration is disabled; only the Admin can login. Create an admin user manually in the Supabase Dashboard.

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## Content Management (Admin)

Currently, content is managed directly via the Supabase Dashboard to keep the architecture minimal. 

### How to Add a New Book
1. Go to the **categories** table and ensure the appropriate category exists.
2. Go to the **books** table and insert a new row.
   - Set `title_english`, `title_urdu`, and `slug`.
   - Set `category_id` (foreign key).
   - Set `cover_image_url` (you can host images in a Supabase Storage bucket and link them here).

### How to Add a New Chapter
1. Go to the **chapters** table and insert a new row.
2. Link the `book_id`.
3. Set the `chapter_number` (e.g., 1).
4. Fill in `title_urdu`, `content_urdu` (HTML or raw text), and `slug`.
5. The reader will automatically generate the Table of Contents for the book based on these entries.

---

## Integrations

### Google Analytics 4 (GA4) API Setup
The admin dashboard pulls live demographic data from GA4.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Analytics Data API**.
3. Create a **Service Account** and generate a JSON key.
4. Minify/stringify this JSON and put it in `GA4_SERVICE_ACCOUNT_KEY` in your `.env.local`.
5. In your GA4 Property, grant **Viewer** access to the Service Account email.

### Google AdSense
The site includes optimized `<AdSlot>` components.
1. Apply for AdSense at [google.com/adsense](https://google.com/adsense).
2. Once approved, you will get a Publisher ID (`ca-pub-XXXX`).
3. Add this to `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` in your environment.
4. (Optional) Replace individual AdSlot IDs across the app if you use specific Ad Units, or leave them for Auto Ads.

---

## Deployment (Vercel)
1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy! Next.js will automatically build and cache static pages for lightning-fast delivery.
