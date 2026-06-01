import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import geoip from 'geoip-lite';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, page_url, ip, user_agent } = body;

    // Use geoip-lite to get location data from IP
    let country = null;
    let country_code = null;
    let city = null;

    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      const geo = geoip.lookup(ip);
      if (geo) {
        country = geo.country; // We'll just use the code as country name if we don't map it, or leave it. Actually geoip-lite returns country code in `.country`.
        country_code = geo.country; 
        city = geo.city;
      }
    }

    // Insert into Supabase page_visits
    await supabaseAdmin
      .from('page_visits')
      .insert([
        {
          session_id,
          page_url,
          country,
          country_code,
          city,
          user_agent,
        }
      ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Swallow errors silently so tracking never breaks the user experience
    console.error('Visit tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
