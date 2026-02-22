'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { userAPI, shopAPI, reviewAPI, blogAPI } from '@/lib/api';
import LineChart from '@/components/Admin/LineChart';
import BarChart from '@/components/Admin/BarChart';

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
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    reviews: 0,
    blogs: 0,
  });

  const [userGrowthData] = useState([
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
  ]);

  const [shopsByCategoryData, setShopsByCategoryData] = useState<{ name: string; value: number; color?: string }[]>([]);

  useEffect(() => {
    // Load stats from API
    const loadStats = () => {
      setStats({
        users: userAPI.getAll().length,
        shops: shopAPI.getAll().length,
        reviews: reviewAPI.getAll().length,
        blogs: blogAPI.getAll().length,
      });
    };

    // Calculate shops by category
    const loadShopsByCategory = () => {
      const shops = shopAPI.getAll();
      const categories = [
        { id: 1, name: 'Quán ăn sáng', color: '#FF6B6B' },
        { id: 2, name: 'Quán cơm', color: '#4ECDC4' },
        { id: 3, name: 'Quán nhậu', color: '#FFE66D' },
        { id: 4, name: 'Quán cafe', color: '#95E1D3' },
      ];

      const categoryCounts = categories.map(category => {
        const count = shops.filter(shop => shop.categoryId === category.id).length;
        return {
          name: category.name,
          value: count,
          color: category.color,
        };
      });

      setShopsByCategoryData(categoryCounts);
    };

    loadStats();
    loadShopsByCategory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container with Sidebar */}
      <div className="flex">
        {/* Sidebar - Data Management */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Data Management</h2>
          <nav className="space-y-2">
            {models.map((model) => (
              <Link
                key={model.path}
                href={`/admin/${model.path}`}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border border-transparent hover:border-blue-200"
              >
                <h3 className="font-semibold text-sm">{model.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{model.description}</p>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your F&B recommender system data</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Users"
                value={stats.users.toString()}
                change="+12% from last month"
                icon="👥"
              />
              <StatsCard
                title="Total Shops"
                value={stats.shops.toString()}
                change="+8% from last month"
                icon="🏪"
              />
              <StatsCard
                title="Total Reviews"
                value={stats.reviews.toString()}
                change="+15% from last month"
                icon="⭐"
              />
              <StatsCard
                title="Total Blogs"
                value={stats.blogs.toString()}
                change="+5% from last month"
                icon="📝"
              />
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
  );
}