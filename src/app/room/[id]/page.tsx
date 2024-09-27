import { auth } from '@/auth';
import { WaitingScreen } from '@/components/element/WaitingScreen';
import { redirect } from 'next/navigation';

export default async function RoomPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect('/');
  }

  return (
    <div className='mx-auto flex w-full grow flex-col items-center justify-center'>
      <WaitingScreen currentUser={user} />
    </div>
  );
}
