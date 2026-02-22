import Link from 'next/link';
import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}