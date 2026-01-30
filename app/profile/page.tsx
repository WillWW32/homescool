'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useInitAcademy } from '@/hooks/use-init-academy';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

function ProfileContent() {
  const { studentContext } = useInitAcademy();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  // Get data from studentContext with fallback values
  const studentName = studentContext?.name || "Student";
  const age = studentContext?.age || 0;
  const credits = studentContext?.credits || 0;
  const level = studentContext?.level || "Freshman";
  const streak = 15; // TODO: Get from streaks table

  // Generate initials from name
  const initials = studentName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-3">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout →
            </button>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
              {initials || 'ST'}
            </div>
            <h1 className="text-2xl font-bold">{studentName}</h1>
            <p className="text-gray-600">{age} years old</p>
            <p className="text-sm text-gray-500 mt-1">
              {level} • Member since Jan 2026
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Progress */}
        <section className="card">
          <h2 className="text-xl font-bold mb-4">Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Credits</span>
              <span className="font-bold">{credits} / 1,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${(credits / 1000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">25% to graduation</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold">{streak} days</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📚</div>
              <div className="font-bold">3</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎨</div>
              <div className="font-bold">2</div>
              <div className="text-xs text-gray-600">Submitted</div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="card">
          <h2 className="text-xl font-bold mb-4">Badges (5)</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['🏆', '📖', '🎯', '🤝', '⭐'].map((emoji, i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl mb-2">
                  {emoji}
                </div>
                <p className="text-xs text-gray-600 max-w-[4rem]">Badge {i + 1}</p>
              </div>
            ))}
          </div>
          <button className="text-blue-600 text-sm font-medium mt-4">
            View All Badges →
          </button>
        </section>

        {/* Working With */}
        <section className="card">
          <h2 className="text-xl font-bold mb-4">Working With</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-semibold">🏀 Coach Nelson</p>
                <p className="text-sm text-gray-600">2 active challenges</p>
              </div>
              <Link href="/classroom/nelson" className="text-blue-600 text-sm">
                Visit →
              </Link>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-semibold">🎬 Thad</p>
                <p className="text-sm text-gray-600">1 active challenge</p>
              </div>
              <Link href="/classroom/thad" className="text-blue-600 text-sm">
                Visit →
              </Link>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold">🧘 Tyra</p>
                <p className="text-sm text-gray-600">Weekly check-ins</p>
              </div>
              <Link href="/classroom/tyra" className="text-blue-600 text-sm">
                Visit →
              </Link>
            </div>
          </div>
          <Link href="/academy" className="text-blue-600 text-sm font-medium mt-4 inline-block">
            Explore More Teachers →
          </Link>
        </section>

        {/* Recent Activity */}
        <section className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg">✅</span>
              <div className="flex-1">
                <p className="font-medium">Completed "Write Game Recap"</p>
                <p className="text-gray-600 text-xs">+75 credits • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🎥</span>
              <div className="flex-1">
                <p className="font-medium">Watched "Editing Rhythm" by Thad</p>
                <p className="text-gray-600 text-xs">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">💬</span>
              <div className="flex-1">
                <p className="font-medium">Commented on Alex's video</p>
                <p className="text-gray-600 text-xs">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">⚡</span>
              <div className="flex-1">
                <p className="font-medium">Inspired by Maya's art project</p>
                <p className="text-gray-600 text-xs">3 days ago</p>
              </div>
            </div>
          </div>
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
          <Link href="/gallery" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">🎨</span>
            <span className="text-xs mt-1">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-blue-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
