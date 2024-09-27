import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserWithResultsSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';

const getUser = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/user/${id}`);
  const data = await res.json();
  const parsedData = UserWithResultsSchema.parse(data?.data);
  return parsedData;
};

const UserPage = async ({ params }: { params: { id: string } }) => {
  const user = await getUser(params.id);

  if (!user) {
    redirect('/');
  }

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-y-10 px-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <div className='flex items-center'>
            <Avatar className='mr-4 size-24'>
              <AvatarImage src={user.image ?? ''} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <p>
              <span className='font-semibold'>評価:</span> {user.rating}
            </p>
            <p>
              <span className='font-semibold'>作成日:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString('ja-JP')}
            </p>
            <p>
              <span className='font-semibold'>更新日:</span>{' '}
              {new Date(user.updatedAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          {user.results.length > 0 ? (
            <div>
              <h2 className='mb-2 text-xl font-semibold'>最近のマッチ履歴</h2>
              <ul className='space-y-4'>
                {user.results.map((result: any) => (
                  <li
                    key={result.id}
                    className={cn(
                      result.ratingDelta > 0 ? 'bg-green-50' : 'bg-red-50',
                      'rounded-md border border-border p-2',
                    )}
                  >
                    <p>
                      <span className='font-semibold'>ルームID:</span> {result.roomId}
                    </p>
                    <p>
                      <span className='font-semibold'>レーティング変動:</span>{' '}
                      <span className={result.ratingDelta > 0 ? 'text-green-500' : 'text-red-500'}>
                        {result.ratingDelta > 0 ? '+' : ''}
                        {result.ratingDelta}
                      </span>
                    </p>
                    <p>
                      <span className='font-semibold'>日時:</span>{' '}
                      {new Date(result.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className='text-muted-foreground'>まだマッチ履歴がありません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
