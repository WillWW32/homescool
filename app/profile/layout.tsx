import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | HomeScool',
  description: 'View your progress, badges, and activity. Track your learning journey at HomeScool Academy.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
