import { buildMetadata } from '@/lib/seo';
import { supabaseAdmin } from '@/lib/supabase-server';
import AnalyticsDashboard from './AnalyticsDashboard';
import { cookies } from 'next/headers';

export const metadata = buildMetadata({
  title: 'Analytics Dashboard | The Sacred Shelf Admin',
  description: 'Admin dashboard for The Sacred Shelf.',
  path: '/admin/analytics',
});

// Avoid caching the admin dashboard
export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  // 1. Fetch page visits from Supabase
  // For larger datasets, this should be done via an RPC function or paginated.
  // We'll limit to 10000 for this prototype.
  const { data: visits } = await supabaseAdmin
    .from('page_visits')
    .select('id, session_id, page_url, country, country_code, timestamp')
    .order('timestamp', { ascending: false })
    .limit(10000);

  // 2. Fetch GA4 Demographics via our API route
  // We have to call the route directly because we are already on the server, 
  // but to avoid fetch issues, we can just fetch the absolute URL or extract the logic.
  // For simplicity, let's do a local fetch to the API route since it is standard in Next.
  
  let demographics = null;
  try {
    const headersList = cookies();
    const cookieString = headersList.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    
    const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${proto}://${host}/api/admin/ga4-demographics`;

    const res = await fetch(apiUrl, {
      headers: {
        'Cookie': cookieString
      },
      cache: 'no-store'
    });

    if (res.ok) {
      demographics = await res.json();
    } else {
      console.error('Failed to fetch GA4 demographics:', res.statusText);
    }
  } catch (err) {
    console.error('Error fetching GA4 demographics during SSR:', err);
  }

  return (
    <AnalyticsDashboard 
      visits={visits || []} 
      demographics={demographics} 
    />
  );
}
