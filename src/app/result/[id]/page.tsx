import { ShareModal } from '@/components/element/ShareModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getResult(id: string) {
  const res = await fetch(`http://localhost:3000/api/result/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('結果の取得に失敗しました');
  }
  return res.json();
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const { data } = await getResult(params.id);

  if (!data || !data.room) {
    notFound();
  }

  const { room } = data;

  const highestScore = Math.max(...room.Result.map((result: any) => result.correctCount));

  return (
    <div className='flex flex-1 items-center justify-center'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>試合結果</CardTitle>
          <p className='text-xl'>テーマ：{room.theme}</p>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {room.Result.map((result: any) => (
              <Link href={`/user/${result.user.id}`} key={result.id} className='block'>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div className='flex items-center'>
                    <Avatar className='mr-3'>
                      <AvatarImage src={result.user.image} alt={result.user.name} />
                      <AvatarFallback>{result.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='flex items-center text-lg font-semibold'>
                        {result.user.name}
                        {result.correctCount === highestScore && (
                          <Crown className='ml-2 size-5 text-yellow-500' />
                        )}
                      </h3>
                      <p className='text-sm text-muted-foreground'>正解数: {result.correctCount}</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      result.ratingDelta > 0
                        ? 'bg-green-500 hover:bg-green-600'
                        : result.ratingDelta < 0
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-500 hover:bg-gray-600',
                      'text-white',
                    )}
                  >
                    {result.ratingDelta >= 0
                      ? result.ratingDelta === 0
                        ? '±0'
                        : `+${result.ratingDelta}`
                      : result.ratingDelta}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
        <CardFooter className='flex w-full justify-between'>
          <Link href='/room' passHref className='mr-2 flex-1'>
            <Button className='w-full' variant='secondary'>
              <ArrowLeft className='mr-2' />
              部屋一覧に戻る
            </Button>
          </Link>
          <div className='ml-2 flex-1'>
            <ShareModal roomId={room.id} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
