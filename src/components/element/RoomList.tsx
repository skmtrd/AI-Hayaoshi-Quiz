import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoomSchema } from '@/lib/schemas';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

const joinRoom = async (roomId: string) => {
  const res = await fetch(`/api/room/${roomId}/join`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

type RoomType = z.infer<typeof RoomSchema>;

const RoomList = ({ rooms }: { rooms: RoomType[] }) => {
  const router = useRouter();
  const handleJoinRoom = async (roomId: string) => {
    const res = await joinRoom(roomId);
    if (res.message === 'join success') {
      router.push(`/room/${res.data.newRoom.id}`);
    } else if (res.message === 'room is full') {
      toast.error('部屋が満員です');
    }
  };

  return (
    <ScrollArea className='h-[calc(100vh-220px)] w-full'>
      {rooms.map((room) => (
        <Card key={room.id} className='mb-4 bg-white shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-bold'>{room.theme}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>参加者:{room.numberOfUser}/10人</p>
            <Button className='mt-2 w-full text-white' onClick={() => handleJoinRoom(room.id)}>
              参加する
            </Button>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default RoomList;
