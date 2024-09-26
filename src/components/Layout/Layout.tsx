import { Header } from '@/components/Layout/Header';
import { Toaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className='flex min-h-svh flex-col'>
    <Header />
    <main className='mx-auto flex w-full grow flex-col gap-y-8 px-6'>{children}</main>
    <Toaster />
  </div>
);
