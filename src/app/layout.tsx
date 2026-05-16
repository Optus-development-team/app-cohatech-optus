import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
