import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YardFlow Simulations v2',
  description: 'Deterministic before/after simulations for YardFlow YNS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b1220] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
