import { auth } from '@/auth';
import { WaitingScreen } from '@/components/element/waitingScreen';
import { RoomStatus } from '@prisma/client';

export default async function RoomPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const room = {
    name: 'Room 1',
    users: [
      {
        id: session?.user?.id,
        name: session?.user?.name,
        image: session?.user?.image,
      },
    ],
  };
  // const room = await prisma.room.findUnique({
  //   where: {
  //     id: params.id,
  //   },
  //   include: {
  //     users: true,
  //   },
  // });

  // if (!room || room.status === 'FINISHED') {
  //   return redirect('/');
  // }

  // // if waiting, show waiting screen
  // if (room.status === 'WAITING') {
  //   return <div>Waiting</div>; // <
  // }

  // // if playing, show playing screen
  // if (room.status === 'PLAYING') {
  //   return <div>Playing</div>;
  // }

  // mock
  const mockRoom = {
    id: '1',
    name: 'テストルーム',
    status: 'waiting' as RoomStatus,
    currentSolverId: null,
    inviteId: 'invite123',
    category: null,
    difficulty: null,
    anserTimeLimit: null,
    thinkingTimeLimit: null,
    currentQuestionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    users: [
      {
        name: 'ユーザー1',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocItEyx8BOvLCYTsy5HHk87LsWotccQbWy2d3tRtMUQZ4JRSiE8=s96-c',
      },
      {
        name: 'ユーザー1',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocItEyx8BOvLCYTsy5HHk87LsWotccQbWy2d3tRtMUQZ4JRSiE8=s96-c',
      },
      {
        name: 'ユーザー1',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocItEyx8BOvLCYTsy5HHk87LsWotccQbWy2d3tRtMUQZ4JRSiE8=s96-c',
      },
      {
        name: 'ユーザー1',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocItEyx8BOvLCYTsy5HHk87LsWotccQbWy2d3tRtMUQZ4JRSiE8=s96-c',
      },
      {
        name: 'ユーザー1',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocItEyx8BOvLCYTsy5HHk87LsWotccQbWy2d3tRtMUQZ4JRSiE8=s96-c',
      },
    ],
  };

  const fixedMockRoom = {
    ...mockRoom,
    users: mockRoom.users.map((user) => ({
      id: '1',
      name: user.name,
      email: 'user@example.com',
      emailVerified: null,
      image: user.image,
      rating: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };

  return (
    <div className='mx-auto flex w-full grow flex-col items-center justify-center'>
      <WaitingScreen room={fixedMockRoom} currentUser={fixedMockRoom.users[0]} />
    </div>
  );
}
