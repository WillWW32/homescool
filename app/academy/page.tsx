'use client';

import { ALL_TEACHERS } from '@/sdk/personas/all-teachers';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useInitAcademy } from '@/hooks/use-init-academy';

function AcademyContent() {
  const { studentContext } = useInitAcademy();
  
  // Default values if student context not loaded yet
  const studentName = studentContext?.name || "Student";
  const credits = studentContext?.credits || 0;
  const level = studentContext?.level || "Freshman";
  const streak = 15; // TODO: Get from streaks table

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {studentName}! 🌟
              </h1>
              <p className="text-gray-600 mt-1">
                {level} • {credits} credits • 🔥 {streak}-day streak
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* This Week */}
        <section>
          <h2 className="text-xl font-bold mb-4">This Week</h2>
          <div className="space-y-3">
            <div className="card">
              <h3 className="font-semibold mb-2">Coach Nelson's Check-In</h3>
              <p className="text-gray-600 text-sm mb-3">Sunday at 10am</p>
              <button className="btn-primary text-sm">Join Now</button>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">New Video: "Editing Rhythm"</h3>
              <p className="text-gray-600 text-sm mb-3">from Thad • 12 min</p>
              <button className="btn-primary text-sm">Watch</button>
            </div>
          </div>
        </section>

        {/* The Academy - Teachers Grid */}
        <section>
          <h2 className="text-xl font-bold mb-4">The Academy</h2>
          <p className="text-gray-600 mb-6">Select a classroom to enter</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_TEACHERS.map((teacher) => (
              <Link
                key={teacher.id}
                href={`/classroom/${teacher.id}`}
                className="card hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {teacher.subjects.join(', ')}
                    </p>
                    {teacher.classPet.name && (
                      <p className="text-xs text-gray-500 mt-2">
                        🐾 {teacher.classPet.name} is here
                      </p>
                    )}
                  </div>
                  <button className="text-blue-600 text-sm font-medium">
                    Enter →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Active Challenges */}
        <section>
          <h2 className="text-xl font-bold mb-4">My Active Challenges (2)</h2>
          <div className="space-y-3">
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">📝 Write Game Recap</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    with Coach Nelson • 60% complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <Link href="/projects" className="btn-primary text-sm ml-4">
                  Continue
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">🎥 First YouTube Video</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    with Thad • 30% complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <Link href="/projects" className="btn-primary text-sm ml-4">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-around">
          <Link href="/academy" className="flex flex-col items-center text-blue-600">
            <span className="text-2xl">🏛️</span>
            <span className="text-xs mt-1 font-medium">Academy</span>
          </Link>
          <Link href="/projects" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">📁</span>
            <span className="text-xs mt-1">Projects</span>
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

export default function AcademyPage() {
  return (
    <ProtectedRoute>
      <AcademyContent />
    </ProtectedRoute>
  );
}
