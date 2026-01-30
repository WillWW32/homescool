'use client';

import { useEffect } from 'react';
import { useAcademyStore } from '@/stores/academy-store';
import { useAuth } from '@/lib/auth-context';

export function useInitAcademy() {
  const { user } = useAuth();
  const { initAcademy, loadStudentContext, academy, studentContext } = useAcademyStore();

  useEffect(() => {
    // Initialize academy with Grok API key
    const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;
    
    if (apiKey && !academy) {
      initAcademy(apiKey);
    }
  }, [academy, initAcademy]);

  useEffect(() => {
    // Load student context when user is authenticated
    if (user && academy && !studentContext) {
      loadStudentContext(user.id);
    }
  }, [user, academy, studentContext, loadStudentContext]);

  return { academy, studentContext };
}
