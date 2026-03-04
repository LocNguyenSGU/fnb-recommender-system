'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import usersApi from '@/lib/users';
import shopsApi from '@/lib/shops';
import reviewsApi from '@/lib/reviews';
import blogsApi from '@/lib/blogs';
import categoriesApi from '@/lib/categories';
import commentsApi from '@/lib/comments';
import menusApi from '@/lib/menus';
import menuItemsApi from '@/lib/menuItems';
import LineChart from '@/components/Admin/LineChart';
import BarChart from '@/components/Admin/BarChart';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import { useAuthStore } from '@/store/authStore';
import { logout as apiLogout } from '@/lib/api/userApi';

/** API từ lib/*.js (crudFactory) có getAll; TypeScript có thể không thấy do .js */
type ApiGetAll = { getAll: () => Promise<{ data?: unknown }> };

/** Chuẩn hóa response từ apiClient (getAll): có thể là mảng hoặc { content: [] } */
function toList(res: { data?: unknown }): unknown[] {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object' && 'content' in d && Array.isArray((d as { content: unknown }).content))
    return (d as { content: unknown[] }).content;
  return [];
}

// Stats Card Component
const StatsCard = ({ title, value, change, icon }: { title: string; value: string; change?: string; icon: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className="text-sm text-green-600">{change}</p>
        )}
      </div>
      <div className="text-3xl text-blue-500">{icon}</div>
    </div>
  </div>
);

const models = [
  { name: 'Users', path: 'users', description: 'Manage user accounts' },
  { name: 'Categories', path: 'categories', description: 'Manage food categories' },
  { name: 'Shops', path: 'shops', description: 'Manage restaurant/shop listings' },
  { name: 'Menus', path: 'menus', description: 'Manage shop menus' },
  { name: 'Menu Items', path: 'menu-items', description: 'Manage individual menu items' },
  { name: 'Reviews', path: 'reviews', description: 'Manage customer reviews' },
  { name: 'Blogs', path: 'blogs', description: 'Manage blog posts' },
  { name: 'Comments', path: 'comments', description: 'Manage blog comments' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    reviews: 0,
    blogs: 0,
    categories: 0,
    comments: 0,
    menus: 0,
    menuItems: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [userGrowthData, setUserGrowthData] = useState<{ name: string; value: number }[]>([]);

  const [shopsByCategoryData, setShopsByCategoryData] = useState<{ name: string; value: number; color?: string }[]>([]);

  const handleLogout = async () => {
    try {
      await apiLogout({ refreshToken: (user as any)?.refreshToken || '' });
    } finally {
      logout();
      router.push('/');
      router.refresh();
    }
  };

  useEffect(() => {
    // Chỉ cho phép admin gọi các API thống kê
    if (!user || (user as any)?.role !== 'admin') {
      setStatsLoading(false);
      setStatsError('Bạn không có quyền truy cập thống kê admin.');
      return;
    }

    // Gọi API thật (lib/users.js, lib/shops.js, ...) qua apiClient/crudFactory, tự thống kê từ getAll()
    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const [usersRes, shopsRes, reviewsRes, blogsRes, categoriesRes, commentsRes, menusRes, menuItemsRes] =
          await Promise.all([
            (usersApi as any).getAll(),
            (shopsApi as any).getAll(),
            (reviewsApi as any).getAll(),
            (blogsApi as any).getAll(),
            (categoriesApi as any).getAll(),
            (commentsApi as any).getAll(),
            (menusApi as any).getAll(),
            (menuItemsApi as any).getAll(),
          ]);

        const users = toList(usersRes);
        const shops = toList(shopsRes);
        const reviews = toList(reviewsRes);
        const blogs = toList(blogsRes);
        const categories = toList(categoriesRes);
        const comments = toList(commentsRes);
        const menus = toList(menusRes);
        const menuItems = toList(menuItemsRes);

        setStats({
          users: users.length,
          shops: shops.length,
          reviews: reviews.length,
          blogs: blogs.length,
          categories: categories.length,
          comments: comments.length,
          menus: menus.length,
          menuItems: menuItems.length,
        });
      } catch (error) {
        const status = (error as any)?.response?.status;
        if (status === 403) {
          setStatsError('Bạn không có quyền truy cập thống kê admin.');
        } else {
          setStatsError('Không tải được thống kê. Kiểm tra kết nối backend.');
        }
        setStats({
          users: 0,
          shops: 0,
          reviews: 0,
          blogs: 0,
          categories: 0,
          comments: 0,
          menus: 0,
          menuItems: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    // Thống kê shops theo category từ API shops + categories
    const loadShopsByCategory = async () => {
      try {
        const [shopsRes, categoriesRes] = await Promise.all([
          (shopsApi as unknown as ApiGetAll).getAll(),
          (categoriesApi as unknown as ApiGetAll).getAll(),
        ]);
        const shops = toList(shopsRes) as { categoryId?: number; category_id?: number }[];
        const categoriesList = toList(categoriesRes) as { id: number; name: string }[];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A78BFA', '#F472B6'];

        const categoryCounts =
          categoriesList.length > 0
            ? categoriesList.map((cat, i) => ({
                name: cat.name,
                value: shops.filter((s) => (s.categoryId ?? s.category_id) === cat.id).length,
                color: colors[i % colors.length],
              }))
            : [
                { name: 'Quán ăn sáng', value: shops.filter((s) => (s.categoryId ?? s.category_id) === 1).length, color: '#FF6B6B' },
                { name: 'Quán cơm', value: shops.filter((s) => (s.categoryId ?? s.category_id) === 2).length, color: '#4ECDC4' },
                { name: 'Quán nhậu', value: shops.filter((s) => (s.categoryId ?? s.category_id) === 3).length, color: '#FFE66D' },
                { name: 'Quán cafe', value: shops.filter((s) => (s.categoryId ?? s.category_id) === 4).length, color: '#95E1D3' },
              ];

        setShopsByCategoryData(categoryCounts);
      } catch (error) {
        const status = (error as any)?.response?.status;
        if (status !== 403) {
          // Chỉ log khi không phải lỗi quyền
          console.error('Failed to load shops by category:', error);
        }
        setShopsByCategoryData([]);
      }
    };

    // Thống kê user growth theo tháng từ API users
    const loadUserGrowth = async () => {
      try {
        const usersRes = await (usersApi as unknown as ApiGetAll).getAll();
        const users = toList(usersRes) as { createdAt?: string }[];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const countsByMonth: Record<string, number> = {};
        monthNames.forEach((_, i) => (countsByMonth[String(i + 1)] = 0));

        users.forEach((u) => {
          const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
          const monthKey = String(createdAt.getMonth() + 1);
          if (monthKey in countsByMonth) countsByMonth[monthKey]++;
        });

        setUserGrowthData(
          monthNames.map((name, i) => ({
            name,
            value: countsByMonth[String(i + 1)] ?? 0,
          }))
        );
      } catch (error) {
        const status = (error as any)?.response?.status;
        if (status !== 403) {
          console.error('Failed to load user growth:', error);
        }
        setUserGrowthData([]);
      }
    };

    loadStats();
    loadShopsByCategory();
    loadUserGrowth();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome to the F&amp;B Recommender System Admin Panel
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl">
              {/* Stats Cards - data from backend API */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsError && (
                  <div className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                    {statsError}
                  </div>
                )}
                {statsLoading ? (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    Đang tải thống kê...
                  </div>
                ) : (
                  <>
                    <StatsCard title="Tổng Users" value={stats.users.toString()} icon="👥" />
                    <StatsCard title="Tổng Shops" value={stats.shops.toString()} icon="🏪" />
                    <StatsCard title="Tổng Reviews" value={stats.reviews.toString()} icon="⭐" />
                    <StatsCard title="Tổng Blogs" value={stats.blogs.toString()} icon="📝" />
                    <StatsCard title="Tổng Categories" value={stats.categories.toString()} icon="📁" />
                    <StatsCard title="Tổng Comments" value={stats.comments.toString()} icon="💬" />
                    <StatsCard title="Tổng Menus" value={stats.menus.toString()} icon="📋" />
                    <StatsCard title="Tổng Menu Items" value={stats.menuItems.toString()} icon="🍽️" />
                  </>
                )}
              </div>

              {/* Charts Section - Bar chart first, then Line chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <BarChart data={shopsByCategoryData} title="Shops by Category" />
                <LineChart data={userGrowthData} title="User Growth Over Time" />
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">New user registered: john_doe</p>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">New shop added: Phở Hà Nội</p>
                    <span className="text-xs text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">New review posted</p>
                    <span className="text-xs text-gray-400">6 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Blog post published</p>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}