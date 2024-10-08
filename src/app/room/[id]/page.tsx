'use client';
import MatchingScreen from '@/components/element/MatchingScreen';
import { WaitingScreen } from '@/components/element/WaitingScreen';
import { LoadScreen } from '@/components/Layout/LoadScreen';
import Protected from '@/components/Layout/Protected';
import useRoomData from '@/hooks/SWR/useRoomData';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function RoomPage() {
  const { data } = useSession();
  const roomId = usePathname().split('room/')[1];
  const { roomInfo, isError, isLoading, mutate } = useRoomData(roomId);

  if (data?.user === undefined) {
    return <LoadScreen />;
  }

  if (isLoading || !roomInfo) return <LoadScreen />;

  // if (roomInfo.status === 'FINISHED') {
  //   setTimeout(() => {
  //     redirect(`/result/${roomId}`);
  //   }, 5000);
  // }

  return (
    <Protected>
      <div className='mx-auto flex w-full grow flex-col items-center justify-center'>
        {roomInfo.status === 'WAITING' && (
          <WaitingScreen currentUser={data.user} roomInfo={roomInfo} />
        )}
        {(roomInfo.status === 'PLAYING' || roomInfo.status === 'FINISHED') && (
          <MatchingScreen currentUser={data.user} roomInfo={roomInfo} />
        )}
      </div>
    </Protected>
  );
}
