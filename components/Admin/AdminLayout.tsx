import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', current: false },
  { name: 'Users', href: '/admin/users', current: false },
  { name: 'Categories', href: '/admin/categories', current: false },
  { name: 'Shops', href: '/admin/shops', current: false },
  { name: 'Menus', href: '/admin/menus', current: false },
  { name: 'Menu Items', href: '/admin/menu-items', current: false },
  { name: 'Reviews', href: '/admin/reviews', current: false },
  { name: 'Blogs', href: '/admin/blogs', current: false },
  { name: 'Comments', href: '/admin/comments', current: false },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

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