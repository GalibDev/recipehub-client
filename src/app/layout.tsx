import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'RecipeHub',
  description: 'Discover, share, save, and purchase recipes from a vibrant cooking community.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
