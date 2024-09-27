import { Layout } from '@/components/Layout/Layout';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI早押しバトル',
  description: 'AI早押しバトル by INIAD.ts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang='en'>
        <body className=''>
          <Layout>{children}</Layout>
        </body>
      </html>
    </SessionProvider>
  );
}
