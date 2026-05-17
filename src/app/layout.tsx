import type { Metadata } from 'next';
import './globals.css';
import './page.css';
import Providers from '@/providers/Providers';
import GameOfLifeBackground from '@/components/ui/GameOfLifeBackground';
import Navbar from '@/components/layout/Navbar';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f0a1a] text-white min-h-screen">
        <GameOfLifeBackground style={{ pointerEvents: 'none' }} />
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}