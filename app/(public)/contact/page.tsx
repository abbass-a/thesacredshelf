import { buildMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/seo';
import ContactForm from './ContactForm';

export const metadata = buildMetadata({
  title: 'Contact Us | The Sacred Shelf',
  description: 'Get in touch with the team at The Sacred Shelf. We welcome inquiries about Tarique Mahmood Hashmi\'s translation work.',
  path: '/contact',
});

/**
 * Contact page.
 */
export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://thesacredshelf.com' },
    { name: 'Contact', url: 'https://thesacredshelf.com/contact' },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF7] pb-24 pt-10">
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column - Information */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-[#A67C2E] font-serif mb-8 italic">
              We welcome your thoughts, inquiries, and support.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              If you have questions about specific translations, would like to report an issue with the reading experience, or wish to support the ongoing efforts of Tarique Mahmood Hashmi, please use the contact form.
            </p>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-4">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-4">Other Ways to Connect</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-[#F5EDD8] text-[#A67C2E] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <span>contact@thesacredshelf.com</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="lg:w-7/12">
            <ContactForm />
          </div>
          
        </div>
      </div>
    </main>
  );
}
