import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase browser client (singleton).
 * Uses @supabase/ssr's createBrowserClient to automatically synchronize
 * the session into cookies, allowing Next.js server-side middleware/routes
 * to authenticate requests.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
