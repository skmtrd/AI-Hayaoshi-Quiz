'use client';

import CreateRoomButton from '@/components/element/CreateRoomButton';
import RoomList from '@/components/element/RoomList';
import { LoadScreen } from '@/components/Layout/LoadScreen';
import Protected from '@/components/Layout/Protected';
import useAllRoomData from '@/hooks/SWR/useAllRoomData';

const Room = () => {
  const { rooms, isError, isLoading, mutate } = useAllRoomData();

  if (isLoading || !rooms) return <LoadScreen />;
  if (isError)
    return (
      <div className='text-center text-xl text-red-500'>
        エラーが発生しました。再度お試しください。
      </div>
    );

  return (
    <Protected>
      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-y-10 px-4 py-8'>
        <h1 className='mb-6 text-3xl font-bold'>ルーム一覧</h1>
        <div className='flex w-full flex-col'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>公開中の部屋</h2>
            <CreateRoomButton />
          </div>
          <RoomList rooms={rooms} />
        </div>
      </div>
    </Protected>
  );
};

export default Room;
