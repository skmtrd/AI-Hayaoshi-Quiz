import { auth, signIn, signOut } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export const Header = async () => {
  const session = await auth();
  return (
    <header className='sticky top-0 z-50 border-b bg-white backdrop-blur-md'>
      <div className='mx-auto flex items-center justify-between px-14 py-4 text-2xl font-bold'>
        <div className='size-10'></div>
        <Link href='/room' className='text-primary'>
          AI早押しバトル
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center justify-center'>
            <Avatar className='select-none'>
              <AvatarImage src={session?.user?.image ?? ''} />
              <AvatarFallback>
                <User className='size-6' />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>アカウント</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {session?.user?.id && (
              <DropdownMenuItem asChild>
                <Link href={`/user/${session.user.id}`} className='flex'>
                  <User className='mr-2 size-4' />
                  プロフィール
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              {session ? (
                <form
                  action={async () => {
                    'use server';
                    await signOut();
                  }}
                  className='flex'
                >
                  <button type='submit' className='flex w-full items-center'>
                    <LogOut className='mr-2 size-4' />
                    <span>ログアウト</span>
                  </button>
                </form>
              ) : (
                <form
                  action={async () => {
                    'use server';
                    await signIn('google');
                  }}
                  className='flex'
                >
                  <button type='submit' className='flex w-full items-center'>
                    <LogIn className='mr-2 size-4' />
                    <span>ログイン</span>
                  </button>
                </form>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
