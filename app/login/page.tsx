'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/** Redirect to home and open sign-in modal (single sign-in experience, no duplicate page). */
export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    } else {
      router.replace('/?signin=1', { scroll: false });
    }
  }, [isAuthenticated, router]);

  return null;
}
