import Link from 'next/link';
import { usePathname } from 'next/navigation';

const models = [
  { name: 'Dashboard', path: '', description: 'Overview and statistics' },
  { name: 'Users', path: 'users', description: 'Manage user accounts' },
  { name: 'Categories', path: 'categories', description: 'Manage food categories' },
  { name: 'Shops', path: 'shops', description: 'Manage restaurant/shop listings' },
  { name: 'Menus', path: 'menus', description: 'Manage shop menus' },
  { name: 'Menu Items', path: 'menu-items', description: 'Manage individual menu items' },
  { name: 'Reviews', path: 'reviews', description: 'Manage customer reviews' },
  { name: 'Blogs', path: 'blogs', description: 'Manage blog posts' },
  { name: 'Comments', path: 'comments', description: 'Manage blog comments' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">F&B Recommender System</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
        <nav className="space-y-2">
          {models.map((model) => {
            const href = model.path === '' ? '/admin' : `/admin/${model.path}`;
            const isActive = pathname === href;

            return (
              <Link
                key={model.name}
                href={href}
                className={`block p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="font-medium text-sm">{model.name}</div>
                <div className={`text-xs mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {model.description}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="text-xs text-gray-500">
          <p>© 2026 F&B System</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}