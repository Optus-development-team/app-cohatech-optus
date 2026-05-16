import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Optus Cocha Tech',
  description: 'Frontend foundation for the Optus Cocha Tech project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
