import { ShareModal } from '@/components/element/ShareModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getUser(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      results: {
        include: {
          room: true,
        },
      },
    },
  });
  return data;
}

const UserPage = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);

  if (!user) {
    redirect('/');
  }

  const winRate =
    user.results.length > 0
      ? Math.round(
          (user.results.filter((result) => result.ratingDelta && result.ratingDelta > 0).length /
            user.results.length) *
            100,
        )
      : 0;

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-y-10 px-4'>
      <Card className='max-h-full w-full max-w-2xl'>
        <CardHeader>
          <div className='flex items-center'>
            <Avatar className='mr-4 size-24'>
              <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
              <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() ?? ''}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className='mb-1 text-2xl'>{user.name}</CardTitle>
              <CardDescription className='text-sm'>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-6 grid grid-cols-2 gap-4'>
            <p>
              <span className='font-semibold text-gray-600'>レーティング:</span>
              <span className='text-lg'>{user.rating}</span>
            </p>
            <p>
              <span className='font-semibold text-gray-600'>勝率:</span>
              <span
                className={cn(
                  'text-lg font-semibold',
                  winRate === 50
                    ? 'text-gray-500'
                    : winRate > 50
                      ? 'text-green-600'
                      : 'text-red-600',
                )}
              >
                {winRate}%
              </span>
            </p>
            <p>
              <span className='font-semibold text-gray-600'>作成日:</span>
              <span className='text-sm'>
                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
              </span>
            </p>
            <p>
              <span className='font-semibold text-gray-600'>更新日:</span>
              <span className='text-sm'>
                {new Date(user.updatedAt).toLocaleDateString('ja-JP')}
              </span>
            </p>
          </div>
          {user.results.length > 0 ? (
            <div>
              <h2 className='mb-4 text-xl font-semibold text-gray-800'>
                最近のマッチ履歴
                <span className='ml-2 text-sm text-muted-foreground'>
                  ({user.results.length}件)
                </span>
              </h2>
              <ScrollArea className='max-h-[400px]'>
                <ul className='flex flex-col gap-y-4'>
                  {user.results.map((result) => (
                    <Link href={`/result/${result.room.id}`} key={result.id} passHref>
                      <li
                        key={result.id}
                        className={cn(
                          result.ratingDelta
                            ? result.ratingDelta > 0
                              ? 'bg-green-50'
                              : 'bg-red-50'
                            : 'bg-gray-50',
                          'rounded-lg border border-gray-200 p-3 shadow-sm',
                        )}
                      >
                        <p className='mb-2 text-lg font-medium'>{result.room.theme}</p>
                        <div className='flex items-center justify-between'>
                          <p>
                            <span className='font-semibold text-muted-foreground'>
                              レーティング変動:
                            </span>
                            <span
                              className={cn(
                                'font-bold',
                                result.ratingDelta
                                  ? result.ratingDelta > 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {result.ratingDelta && result.ratingDelta > 0 ? '+' : ''}
                              {result.ratingDelta}
                            </span>
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(result.createdAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <p className='italic text-muted-foreground'>まだマッチ履歴がありません。</p>
          )}
        </CardContent>
        <CardFooter className='flex w-full justify-between'>
          <Link href='/room' passHref className='mr-2 flex-1'>
            <Button className='w-full' variant='secondary'>
              <ArrowLeft className='mr-2' />
              部屋一覧に戻る
            </Button>
          </Link>
          <div className='ml-2 flex-1'>
            <ShareModal path={`user/${user.id}`} text='ユーザーをシェア' />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserPage;
