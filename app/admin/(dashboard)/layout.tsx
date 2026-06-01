'use client';

import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/admin/analytics' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Books', href: '/admin/books' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1C1C1E] text-white fixed h-full shrink-0 flex flex-col hidden md:flex z-50">
        <div className="p-6">
          <h2 className="font-serif text-xl font-bold text-[#A67C2E] mb-1">The Sacred Shelf</h2>
          <p className="text-xs uppercase tracking-wider text-gray-400">Admin</p>
        </div>
        
        <nav className="flex-grow px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors block ${
                  isActive 
                    ? 'bg-[#A67C2E] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white cursor-pointer'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors w-full text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
