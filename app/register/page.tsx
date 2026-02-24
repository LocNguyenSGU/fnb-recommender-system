'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/dashboard/nav';
import { useAuthStore } from '@/store/authStore';
import { X } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

/** Sign-up page: same overlay + blur style as sign-in modal, centered card. */
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
      <Suspense fallback={<div className="h-16" />}>
        <Nav />
      </Suspense>

      {/* Full-screen overlay with blur (same z-index and effect as sign-in modal) */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        aria-modal
        role="dialog"
      >
        <Link
          href="/"
          className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity"
          aria-label="Close"
        />
        <div
          className="relative z-[101] w-full max-w-sm max-h-[90vh] min-h-[320px] flex flex-col rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between shrink-0 px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Create an account</h2>
            <Link
              href="/"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0 p-6">
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full">
              <p className="text-gray-600 text-sm mb-6 text-center">
                Sign up to write blog posts and join the community.
              </p>
              <div className="w-full flex justify-center mb-6">
                <RegisterForm />
              </div>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/?signin=1"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
