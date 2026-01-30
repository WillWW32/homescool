import { Metadata } from 'next';
import { ALL_TEACHERS } from '@/sdk/personas/all-teachers';

export async function generateMetadata({
  params
}: {
  params: Promise<{ teacherId: string }>
}): Promise<Metadata> {
  const { teacherId } = await params;
  const teacher = ALL_TEACHERS.find(t => t.id === teacherId);

  if (!teacher) {
    return {
      title: 'Classroom Not Found | HomeScool',
      description: 'This classroom could not be found.',
    };
  }

  return {
    title: `${teacher.name}'s Classroom | HomeScool`,
    description: `Join ${teacher.name}'s classroom for ${teacher.subjects.join(', ')}. Chat with your teacher, watch lessons, and take on challenges.`,
  };
}

export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
