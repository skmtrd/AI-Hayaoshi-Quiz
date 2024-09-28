import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoomSchema } from '@/lib/schemas';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

interface RoomListProps {
  rooms: z.infer<typeof RoomSchema>[];
}

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

const RoomList = ({ rooms }: RoomListProps) => {
  const router = useRouter();
  const handleJoinRoom = async (roomId: string) => {
    const res = await joinRoom(roomId);
    console.log(res);
    if (res.message === 'join success') {
      router.push(`/room/${res.data.id}`);
    } else if (res.message === 'room not exits') {
      toast.error('部屋が存在しません');
    } else if (res.message === 'room is full') {
      toast.error('部屋が満員です');
    }
  };
  return (
    <ScrollArea>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {rooms.map((room) => (
          <Card key={room.id} className='transition-shadow duration-300 hover:shadow-lg'>
            <CardHeader>
              <CardTitle>{room.theme}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-2 flex items-center'>
                <Users className='mr-2' size={16} />
                <span>
                  {room.numberOfUser} / {room.maxPlayer} 人
                </span>
              </div>
              <div className='flex items-center'>
                <Clock className='mr-2' size={16} />
                <span>
                  作成日時:{' '}
                  {formatDistanceToNow(new Date(room.createdAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </span>
              </div>
            </CardContent>
            <CardFooter className='flex'>
              <Button onClick={() => handleJoinRoom(room.id)} className='w-full'>
                参加する
              </Button>
            </CardFooter>
          </Card>
        ))}
        {rooms.length === 0 && (
          <div className='text-center text-xl text-muted-foreground'>部屋がありません</div>
        )}
      </div>
    </ScrollArea>
  );
};

export default RoomList;
