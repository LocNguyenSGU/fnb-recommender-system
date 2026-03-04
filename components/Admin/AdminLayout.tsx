'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '@/store/authStore';
import { logout as apiLogout } from '@/lib/api/userApi';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiLogout({ refreshToken: user?.refreshToken || '' });
    } finally {
      logout();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}