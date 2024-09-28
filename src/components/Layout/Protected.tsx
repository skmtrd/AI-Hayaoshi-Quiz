'use client';

import { LoadScreen } from '@/components/Layout/LoadScreen';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const Protected: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <LoadScreen />;
  }

  return session ? (
    <>{children}</>
  ) : (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-y-4'>
        <h1 className='text-2xl font-bold'>ログインが必要です</h1>
        <p className='text-sm text-muted-foreground'>
          ログインしていない場合は、ログインしてください。
        </p>
        <Button onClick={() => signIn('google')}>ログイン</Button>
      </div>
    </div>
  );
};

export default Protected;
