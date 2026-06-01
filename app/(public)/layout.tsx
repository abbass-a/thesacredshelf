/**
 * Public layout — wraps all user-facing pages.
 * Applies RTL direction for Urdu content.
 */
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#1a1a1a]">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
