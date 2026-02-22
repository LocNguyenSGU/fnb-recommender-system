'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { logout as apiLogout } from '@/lib/api/userApi';
import SignInModal from '@/components/auth/SignInModal';
import { LogOut, ChevronDown } from 'lucide-react';

export default function Nav() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Discover', href: '/' },
    { label: 'Categories', href: '#' },
    { label: 'Blog', href: '/blog' },
    { label: 'Support', href: '#' },
  ];

  const handleLogout = async () => {
    try {
      await apiLogout();
    } finally {
      logout();
      setUserMenuOpen(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <nav
      className="fixed top-4 left-4 right-4 z-50
                backdrop-blur-md bg-white/60
                px-8 py-4
                flex items-center justify-between
                rounded-2xl shadow-lg border border-white/40"
    >
      <Link href="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="relative w-10 h-10">
          <Image
            src="/img/nav_logo.png"
            alt="Ăn Đâu Kbang Logo"
            fill
            sizes="20px"
            className="object-contain"
            priority
          />
        </div>
        <span className="text-2xl font-semibold text-gray-900 tracking-wide transition-colors duration-300 group-hover:text-blue-600">
          Ăn Đâu Kbang
        </span>
      </Link>

      <div className="flex gap-10 items-center">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="relative text-gray-700 font-medium transition-colors duration-300 hover:text-blue-600 group"
          >
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700 max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSignInOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95"
            >
              Login
            </button>
            <SignInModal
              open={signInOpen}
              onClose={() => setSignInOpen(false)}
            />
          </>
        )}
        <button
          type="button"
          onClick={() => router.push('/blog')}
          className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:bg-gray-700 hover:scale-105 active:scale-95"
        >
          Open FnB Map
        </button>
      </div>
    </nav>
  );
}