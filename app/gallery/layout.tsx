import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | HomeScool',
  description: 'Discover amazing work from students across the academy. Get inspired and share feedback.',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
