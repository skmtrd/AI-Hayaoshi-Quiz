import type { ReactNode } from 'react';

import { Header } from './Header';

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className='flex min-h-svh flex-col gap-y-8'>
    <Header />
    <main className='mx-auto flex w-full grow flex-col gap-y-8 px-6'>{children}</main>
  </div>
);
