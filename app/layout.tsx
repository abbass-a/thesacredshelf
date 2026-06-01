import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Nastaliq_Urdu, Lora } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

// ============================================================
// Font Loading
// ============================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-nastaliq',
  preload: true,
});

// ============================================================
// Metadata
// ============================================================

export const viewport: Viewport = {
  themeColor: '#A67C2E',
};

export const metadata: Metadata = {
  title: {
    default: 'The Sacred Shelf — مقدس شیلف',
    template: '%s | The Sacred Shelf',
  },
  description:
    'A digital library of Urdu-language translated religious books. Read online for free — translated by Tarique Mahmood Hashmi.',
  keywords: [
    'Islamic books',
    'Urdu translation',
    'religious books',
    'Tarique Mahmood Hashmi',
    'مقدس شیلف',
    'اردو ترجمہ',
    'اسلامی کتب',
  ],
  authors: [{ name: 'Tarique Mahmood Hashmi' }],
  openGraph: {
    title: 'The Sacred Shelf — مقدس شیلف',
    description:
      'A digital library of Urdu-language translated religious books by Tarique Mahmood Hashmi.',
    url: 'https://thesacredshelf.com',
    siteName: 'The Sacred Shelf',
    locale: 'ur_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sacred Shelf — مقدس شیلف',
    description:
      'Read Urdu-language translated religious books online — translated by Tarique Mahmood Hashmi.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${notoNastaliq.variable} ${lora.variable}`}>
      <head>
        {/* Google Analytics 4 — placeholder, replace GA_MEASUREMENT_ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Translator credit on every page */}
        <div className="translator-credit">
          Translated by <strong>Tarique Mahmood Hashmi</strong> — طارق محمود ہاشمی
        </div>

        {children}

        {/* Google AdSense using Next.js Script */}
        {adsensePublisherId && (
          <Script 
            id="adsense-init"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`} 
            strategy="afterInteractive" 
            crossOrigin="anonymous" 
          />
        )}
      </body>
    </html>
  );
}
