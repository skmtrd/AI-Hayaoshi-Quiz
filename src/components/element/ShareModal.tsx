'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ShareIcon } from 'lucide-react';
import process from 'process';
import { useState } from 'react';

interface ShareModalProps {
  roomId: string;
}

export function ShareModal({ roomId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/room/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>
          <ShareIcon className='mr-2' />
          この試合の結果をシェア
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>試合結果をシェア</DialogTitle>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <Input value={shareUrl} readOnly />
          <Button onClick={copyToClipboard}>{copied ? 'コピーしました！' : 'コピー'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
