import type { Metadata } from 'next';
import './globals.css';
import './page.css';
import Providers from '@/providers/Providers';
import GameOfLifeBackground from '@/components/ui/GameOfLifeBackground';

export const metadata: Metadata = {
  title: "Cohatech",
  description: "Frontend base built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-[#0f0a1a] text-white min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}