import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YardFlow Simulations',
  description: 'Interactive before/after simulations showing how YardFlow transforms yard operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
