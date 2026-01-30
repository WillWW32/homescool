import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Projects | HomeScool',
  description: 'Manage your active challenges and completed projects. View submissions and track your creative work.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
