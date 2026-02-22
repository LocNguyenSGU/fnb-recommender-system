'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/dashboard/nav';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
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

      <div className="pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-600 mb-8">
            Sign up to write blog posts and join the community.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Registration form can be added here (e.g. email, password, name).
          </p>
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
