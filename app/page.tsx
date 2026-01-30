'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/academy');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏛️</div>
          <p className="text-gray-600">Loading HomeScool Academy...</p>
        </div>
      </div>
    );
  }
  
  return null;
}
