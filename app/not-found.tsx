import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 bg-gray-100 p-6 rounded-full inline-flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#A67C2E]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/"
          className="px-6 py-3 bg-[#1a1a1a] text-white font-medium rounded-md hover:bg-black transition-colors"
        >
          Go to Homepage
        </Link>
        <Link 
          href="/library"
          className="px-6 py-3 bg-white text-[#1a1a1a] border border-[#1a1a1a] font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Browse Library
        </Link>
      </div>
    </main>
  );
}
