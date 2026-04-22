import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AlgoQuest MVP',
  description: 'Browser coding challenge platform MVP',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-slate-100 antialiased">{children}</body>
    </html>
  );
}
