import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ------------------------------------------------------------------
  // Admin Route Protection
  // ------------------------------------------------------------------
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // If accessing admin, we skip visitor tracking
    return response;
  }

  // ------------------------------------------------------------------
  // Visitor Tracking
  // ------------------------------------------------------------------
  const skipTracking =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt';

  if (!skipTracking) {
    let sessionId = request.cookies.get('tss-session')?.value;
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      response.cookies.set('tss-session', sessionId, {
        maxAge: 1800, // 30 minutes
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    // Fire-and-forget tracking
    const visitUrl = new URL('/api/visits', request.url);
    fetch(visitUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        page_url: pathname,
        ip,
        user_agent: userAgent,
      }),
    }).catch(() => {
      // Swallow errors silently
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
