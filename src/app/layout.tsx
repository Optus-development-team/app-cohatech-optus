import type { Metadata } from 'next';
import './globals.css';
import './page.css';
import Providers from '@/providers/Providers';
import GameOfLifeBackground from '@/components/ui/GameOfLifeBackground';

export const metadata: Metadata = {
  title: 'OptusCocha — Finanzas Universitarias Bolivia',
  description: 'La primera plataforma de finanzas embebidas para el ecosistema universitario boliviano. Ahorro inteligente, pagos QR y crédito transparente.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0a0a14" />
      </head>
      <body>
        {/* Game of Life Background - Principal */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GameOfLifeBackground
            cellSize={16}
            color="#9353d0"
            speed={0.4}
            density={0.09}
            fillOpacity={1.0}
          />
        </div>

        <div className="relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
