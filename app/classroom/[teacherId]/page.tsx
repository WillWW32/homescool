'use client';

import { use, useState } from 'react';
import { ALL_TEACHERS } from '@/sdk/personas/all-teachers';
import Link from 'next/link';
import { useAcademyStore } from '@/stores/academy-store';
import { useInitAcademy } from '@/hooks/use-init-academy';
import { ProtectedRoute } from '@/components/protected-route';
import toast from 'react-hot-toast';

function ClassroomContent({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = use(params);
  const teacher = ALL_TEACHERS.find(t => t.id === teacherId);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [sending, setSending] = useState(false);
  
  const { chatWithTeacher } = useAcademyStore();
  const { academy, studentContext } = useInitAcademy();

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Teacher not found</h1>
          <Link href="/academy" className="text-blue-600">
            ← Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim() || !academy || !studentContext || sending) return;
    
    // Add user message to chat
    const userMessage = { role: 'student', content: message };
    setChat(prev => [...prev, userMessage]);
    setMessage('');
    setSending(true);
    
    try {
      // Call HomeScool SDK to get teacher response
      const response = await chatWithTeacher(teacherId, message);
      
      const teacherResponse = {
        role: 'teacher',
        content: response.message
      };
      
      setChat(prev => [...prev, teacherResponse]);
      
      // Show credits if awarded
      if (response.creditsAwarded > 0) {
        setTimeout(() => {
          toast.success(`🎉 You earned ${response.creditsAwarded} credits!`, {
            duration: 4000,
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error chatting with teacher:', error);
      const errorMessage = {
        role: 'teacher',
        content: "I'm having trouble responding right now. Please try again."
      };
      setChat(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/academy" className="text-blue-600 text-sm mb-2 inline-block">
            ← Back to Academy
          </Link>
          <h1 className="text-2xl font-bold">{teacher.name}'s Classroom</h1>
          <p className="text-gray-600 mt-1">{teacher.subjects.join(', ')}</p>
          {teacher.classPet.name && (
            <p className="text-sm text-gray-500 mt-2">
              🐾 {teacher.classPet.name} ({teacher.classPet.description})
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Chat with Teacher */}
        <section>
          <h2 className="text-xl font-bold mb-4">Chat with {teacher.name}</h2>
          <div className="card">
            {/* Chat messages */}
            <div className="h-64 overflow-y-auto mb-4 space-y-3">
              {chat.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="font-medium">{teacher.catchphrases[0]}</p>
                  <p className="text-sm mt-2">Start a conversation...</p>
                </div>
              ) : (
                chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.role === 'student'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !sending && handleSend()}
                placeholder="Type your message..."
                disabled={sending || !academy || !studentContext}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button 
                onClick={handleSend} 
                disabled={sending || !academy || !studentContext}
                className="btn-primary disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
            
            {!academy && (
              <p className="text-xs text-gray-500 text-center">
                Connecting to Academy...
              </p>
            )}
          </div>
        </section>

        {/* Weekly Video */}
        <section>
          <h2 className="text-xl font-bold mb-4">This Week's Lesson</h2>
          <div className="card">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">📹 Video Player</span>
            </div>
            <h3 className="font-semibold">Weekly Topic</h3>
            <p className="text-sm text-gray-600 mt-1">12 min • Not watched yet</p>
            <button className="btn-primary mt-3 text-sm">Watch Now</button>
          </div>
        </section>

        {/* Challenges */}
        <section>
          <h2 className="text-xl font-bold mb-4">Challenges for You</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🔸 SMALL (1-2 weeks, 50-100 credits)
            </h3>
            <div className="space-y-3">
              <div className="card">
                <h4 className="font-semibold">Sample Challenge 1</h4>
                <p className="text-sm text-gray-600 mt-1">75 credits • 2 weeks</p>
                <button className="btn-primary mt-3 text-sm">Accept Challenge</button>
              </div>
              <div className="card">
                <h4 className="font-semibold">Sample Challenge 2</h4>
                <p className="text-sm text-gray-600 mt-1">50 credits • 1 week</p>
                <button className="btn-primary mt-3 text-sm">Accept Challenge</button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🔶 LARGE (4-8 weeks, 200-300 credits)
            </h3>
            <div className="space-y-3">
              <div className="card">
                <h4 className="font-semibold">Sample Large Challenge</h4>
                <p className="text-sm text-gray-600 mt-1">250 credits • 6 weeks</p>
                <button className="btn-primary mt-3 text-sm">Accept Challenge</button>
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
          <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function ClassroomPage({ params }: { params: Promise<{ teacherId: string }> }) {
  return (
    <ProtectedRoute>
      <ClassroomContent params={params} />
    </ProtectedRoute>
  );
}
