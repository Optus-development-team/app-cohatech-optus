import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';
import MeshBackground from '@/components/MeshBackground';

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
        {/* Ambient glow orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <MeshBackground />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
