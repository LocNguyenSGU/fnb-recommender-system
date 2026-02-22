'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/dashboard/nav';
import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Nav />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Sign in</h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to write blog posts and manage your account.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
