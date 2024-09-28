import { Loader2 } from 'lucide-react';

export const LoadScreen = () => (
  <div className='flex flex-1 items-center justify-center'>
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <Loader2 className='size-10 animate-spin' />
      <p className='text-sm text-muted-foreground'>読み込み中...</p>
    </div>
  </div>
);
