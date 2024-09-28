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

type ShareModalProps = {
  path: string;
  text: string;
};

export function ShareModal({ path, text }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/${path}`
    : `http://localhost:3000/${path}`;

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
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <Input value={shareUrl} readOnly />
          <Button onClick={copyToClipboard}>{copied ? 'コピーしました！' : 'コピー'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
