import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Academy | HomeScool',
  description: 'Explore classrooms and connect with expert teachers. Join challenges, earn credits, and build your skills.',
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
