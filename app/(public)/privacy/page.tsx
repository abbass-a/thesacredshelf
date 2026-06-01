import { buildMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy | The Sacred Shelf',
  description: 'Privacy Policy for The Sacred Shelf, detailing how we handle your data, cookies, and analytics.',
  path: '/privacy',
});

/**
 * Privacy Policy page.
 */
export default function PrivacyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Privacy Policy', url: 'https://thesacredshelf.com/privacy' },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-24 pt-10">
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-lg">
            Last updated: May 30, 2026
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <p>
            At <strong>The Sacred Shelf</strong> ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and disclosed by The Sacred Shelf.
          </p>

          <h2 className="font-serif font-bold text-[#1a1a1a] mt-8 mb-4">1. Information We Collect</h2>
          <p>
            <strong>Information you provide to us:</strong> If you use our Contact Form, we collect your name, email address, and the contents of your message. We use this information solely to respond to your inquiries and support requests.
          </p>
          <p>
            <strong>Information collected automatically:</strong> We may automatically collect certain information when you visit, use, or navigate the site. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our site.
          </p>

          <h2 className="font-serif font-bold text-[#1a1a1a] mt-8 mb-4">2. Use of Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific uses include:
          </p>
          <ul>
            <li><strong>Analytics:</strong> We use tools (such as Google Analytics) to help us understand how users engage with the website so we can improve the reading experience.</li>
            <li><strong>Advertising:</strong> We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site based on your prior visits to our site or other websites on the Internet.</li>
          </ul>

          <h2 className="font-serif font-bold text-[#1a1a1a] mt-8 mb-4">3. Google AdSense & DoubleClick Cookie</h2>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet. Users may opt-out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#A67C2E] hover:underline">Google's Ads Settings</a>.
          </p>
          <p>
            Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer" className="text-[#A67C2E] hover:underline">www.aboutads.info</a>.
          </p>

          <h2 className="font-serif font-bold text-[#1a1a1a] mt-8 mb-4">4. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, including responding to your contact form submissions.</li>
          </ul>

          <h2 className="font-serif font-bold text-[#1a1a1a] mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at <strong>contact@thesacredshelf.com</strong> or use our <a href="/contact" className="text-[#A67C2E] hover:underline">Contact Form</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
