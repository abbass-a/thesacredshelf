/**
 * GA4 Data API client for the admin analytics dashboard.
 *
 * Uses the @google-analytics/data package with a service account
 * to pull demographic and traffic data from GA4.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

/**
 * Returns a lazily-initialised GA4 BetaAnalyticsDataClient.
 * The service account credentials are read from the
 * GA4_SERVICE_ACCOUNT_KEY environment variable (JSON string).
 */
export function getGA4Client(): BetaAnalyticsDataClient {
  if (!analyticsDataClient) {
    const rawKey = process.env.GA4_SERVICE_ACCOUNT_KEY;
    if (!rawKey) {
      throw new Error(
        'Missing GA4_SERVICE_ACCOUNT_KEY environment variable. ' +
          'Set it to the JSON contents of your Google service-account key file.'
      );
    }

    const credentials = JSON.parse(rawKey) as {
      client_email: string;
      private_key: string;
    };

    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });
  }

  return analyticsDataClient;
}

/** GA4 property ID, e.g. "properties/123456789" */
export const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? '';
