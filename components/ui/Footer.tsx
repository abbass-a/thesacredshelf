import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-8 px-6 text-sm text-gray-600 font-inter">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>
            &copy; {currentYear} The Sacred Shelf — Translations by Tarique Mahmood Hashmi
          </p>
          <span className="hidden md:inline" aria-hidden="true">|</span>
          <Link href="/privacy" className="hover:underline hover:text-accent">
            Privacy Policy
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
           <span>Browse by Category:</span>
           {/* In a full implementation, these would be fetched dynamically or passed as props */}
           <Link href="/category/tafseer" className="hover:underline hover:text-accent">Tafseer</Link>
           <Link href="/category/hadith" className="hover:underline hover:text-accent">Hadith</Link>
           <Link href="/category/fiqh" className="hover:underline hover:text-accent">Fiqh</Link>
        </div>
      </div>
    </footer>
  );
}
