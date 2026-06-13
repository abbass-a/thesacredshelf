import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const dynamic = 'force-dynamic';

// Mock data generator for when GA4 is not configured
const getMockData = () => ({
  mock: true,
  gender: {
    male: 540,
    female: 420,
    unknown: 120
  },
  age: {
    '18-24': 210,
    '25-34': 450,
    '35-44': 320,
    '45-54': 180,
    '55-64': 90,
    '65+': 45
  }
});

export async function GET() {
  try {
    // 1. Protected: check Supabase admin session
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check for GA4 environment variables
    const propertyId = process.env.GA4_PROPERTY_ID;
    const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY;

    if (!propertyId || !serviceAccountKey) {
      console.warn('GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_KEY missing. Returning mock demographic data.');
      return NextResponse.json(getMockData());
    }

    // 3. Authenticate and initialize client
    let credentials;
    try {
      credentials = JSON.parse(serviceAccountKey);
    } catch (e) {
      console.error('Failed to parse GA4_SERVICE_ACCOUNT_KEY. Returning mock demographic data.');
      return NextResponse.json(getMockData());
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });

    // 4. Run ONE report request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '90daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'userGender' },
        { name: 'userAgeBracket' },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });

    // 5. Structure JSON output
    const structuredData = {
      mock: false,
      gender: {
        male: 0,
        female: 0,
        unknown: 0,
      } as Record<string, number>,
      age: {
        '18-24': 0,
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55-64': 0,
        '65+': 0,
      } as Record<string, number>,
    };

    if (response.rows) {
      response.rows.forEach(row => {
        const gender = row.dimensionValues?.[0]?.value?.toLowerCase() || 'unknown';
        const ageBracket = row.dimensionValues?.[1]?.value || 'unknown';
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);

        // Aggregate gender
        if (gender === 'male' || gender === 'female') {
          structuredData.gender[gender] += users;
        } else {
          structuredData.gender.unknown += users;
        }

        // Aggregate age
        if (structuredData.age[ageBracket] !== undefined) {
          structuredData.age[ageBracket] += users;
        }
      });
    }

    return NextResponse.json(structuredData);

  } catch (error) {
    console.error('Error fetching GA4 demographics:', error);
    // Return mock data on error so dashboard renders
    return NextResponse.json(getMockData());
  }
}
