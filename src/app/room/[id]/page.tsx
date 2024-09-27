import { auth } from '@/auth';
import { WaitingScreen } from '@/components/element/WaitingScreen';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function RoomPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect('/');
  }
  const room = await prisma.room.findUnique({
    where: { id: params.id },
    include: {
      RoomUser: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!room) {
    return redirect('/rooms');
  }

  return (
    <div className='mx-auto flex w-full grow flex-col items-center justify-center'>
      <WaitingScreen room={room} currentUser={user} />
    </div>
  );
}
