'use client';

import CreateRoomButton from '@/components/element/CreateRoomButton';
import RoomList from '@/components/element/RoomList';
import useAllRoomData from '@/hooks/SWR/useAllRoomData';

const Room = () => {
  const { rooms, isError, isLoading, mutate } = useAllRoomData();

  // useEffect(() => {
  //   let interval;
  //   interval = setInterval(() => {
  //     mutate();
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, [mutate]);

  if (isLoading || !rooms) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-y-10 px-4'>
      <div className='flex w-full flex-col'>
        <CreateRoomButton />
        <h2 className='mb-2 text-xl font-semibold'>公開中の部屋</h2>
        <div className='h-10'></div>
        <RoomList rooms={rooms} />
      </div>
    </div>
  );
};

export default Room;
