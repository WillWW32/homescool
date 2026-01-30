'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function GalleryContent() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        let query = supabase
          .from('student_work')
          .select(`
            *,
            students!student_id (name, age),
            teachers!teacher_id (name)
          `)
          .eq('status', 'submitted')
          .order('created_at', { ascending: false });

        if (filter !== 'all' && filter !== 'featured') {
          query = query.eq('teacher_id', filter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setSubmissions(data || []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Show & Tell Gallery</h1>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'featured' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter('nelson')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'nelson' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Coach Nelson
            </button>
            <button
              onClick={() => setFilter('thad')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'thad' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Thad
            </button>
            <button
              onClick={() => setFilter('tyra')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'tyra' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tyra
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Featured */}
        <section>
          <h2 className="text-xl font-bold mb-4">Featured This Week ⭐</h2>
          <div className="card">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">🎬 Video Thumbnail</span>
            </div>
            <h3 className="font-bold text-lg">My First YouTube Video</h3>
            <p className="text-sm text-gray-600 mt-1">by Alex (age 14) • Thad's Studio</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span>💬 12 comments</span>
              <span>❤️ 23</span>
              <span>⚡ 8 inspired</span>
            </div>
            <button className="text-blue-600 text-sm font-medium mt-3">
              View Full Submission →
            </button>
          </div>
        </section>

        {/* Recent Submissions */}
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">🎨</p>
              <p>No submissions yet. Complete a challenge to share your work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="card p-4 cursor-pointer hover:shadow-md transition">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-gray-400">🖼️</span>
                  </div>
                  <h4 className="font-semibold text-sm truncate">{submission.title || 'Untitled'}</h4>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    by {submission.students?.name} • {submission.teachers?.name}
                  </p>
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
          <Link href="/projects" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">📁</span>
            <span className="text-xs mt-1">Projects</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-blue-600">
            <span className="text-2xl">🎨</span>
            <span className="text-xs mt-1 font-medium">Gallery</span>
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

export default function GalleryPage() {
  return (
    <ProtectedRoute>
      <GalleryContent />
    </ProtectedRoute>
  );
}
