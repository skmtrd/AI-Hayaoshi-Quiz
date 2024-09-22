import { auth } from '@/auth';
import CreateRoomButton from '@/components/element/CreateRoomButton';
import SignIn from '@/components/SignIn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
const Home = async () => {
  const session = await auth();

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-y-10 px-4'>
      <div className='flex w-full flex-col'>
        {!session?.user?.image ? (
          <SignIn />
        ) : (
          <>
            <CreateRoomButton />
            <h2 className='mb-2 text-xl font-semibold'>公開中の部屋</h2>
            <div className='h-10'></div>
            <ScrollArea className='h-[calc(100vh-220px)] w-full'>
              {[...Array(10)].map((_, i) => (
                <Card key={i} className='mb-4 bg-white shadow-md'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-lg font-bold'>クイズ部屋 {i + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      参加者: {Math.floor(Math.random() * 10) + 1}/10
                    </p>
                    <p className='text-sm text-muted-foreground'>ジャンル: 一般常識</p>
                    <Button className='mt-2 w-full text-white'>参加する</Button>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
