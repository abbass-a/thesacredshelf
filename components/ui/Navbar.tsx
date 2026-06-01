'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Library', href: '/library' },
    { name: 'About', href: '/about/tarique-mahmood-hashmi' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {/* Gold Open Book Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6 text-[#A67C2E]"
            aria-hidden="true"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
          </svg>
          
          <span className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a]">
            The Sacred Shelf
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 font-inter text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            
            return (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`transition-colors hover:text-[#A67C2E] ${
                    isActive ? 'text-[#A67C2E]' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  );
}
