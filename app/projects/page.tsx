'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useInitAcademy } from '@/hooks/use-init-academy';

function ProjectsContent() {
  const { studentContext } = useInitAcademy();
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!studentContext?.id) return;

      try {
        const { data: active } = await supabase
          .from('student_work')
          .select(`
            *,
            challenges!challenge_id (title),
            teachers!teacher_id (name)
          `)
          .eq('student_id', studentContext.id)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false });

        const { data: completed } = await supabase
          .from('student_work')
          .select(`
            *,
            challenges!challenge_id (title, credits_reward),
            teachers!teacher_id (name)
          `)
          .eq('student_id', studentContext.id)
          .eq('status', 'submitted')
          .order('created_at', { ascending: false });

        setActiveProjects(active || []);
        setCompletedProjects(completed || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [studentContext?.id]);

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">Active Projects ({loading ? '...' : activeProjects.length})</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-2 bg-gray-200 rounded w-full mb-4" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded w-32" />
                    <div className="h-10 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">📁</p>
              <p>No active projects. Visit the Academy to start a challenge!</p>
              <Link href="/academy" className="btn-primary inline-block mt-4">
                Explore Classrooms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="card">
                  <h3 className="font-bold text-lg">📝 {project.challenges?.title || 'Untitled Project'}</h3>
                  <p className="text-sm text-gray-600 mt-1">with {project.teachers?.name}</p>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/classroom/${project.teacher_id}`} className="btn-primary text-sm">
                      Continue Working
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Completed Projects ({loading ? '...' : completedProjects.length})</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : completedProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed projects yet</p>
          ) : (
            <div className="space-y-3">
              {completedProjects.map((project) => (
                <div key={project.id} className="card opacity-75">
                  <h3 className="font-semibold">✅ {project.challenges?.title || 'Completed Project'}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Completed • {project.challenges?.credits_reward || 0} credits earned
                  </p>
                  <Link href="/gallery" className="text-blue-600 text-sm mt-2 inline-block">
                    View in Gallery →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-around">
          <Link href="/academy" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">🏛️</span>
            <span className="text-xs mt-1">Academy</span>
          </Link>
          <Link href="/projects" className="flex flex-col items-center text-blue-600">
            <span className="text-2xl">📁</span>
            <span className="text-xs mt-1 font-medium">Projects</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">🎨</span>
            <span className="text-xs mt-1">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}
