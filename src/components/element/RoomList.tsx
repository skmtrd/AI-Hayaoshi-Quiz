import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoomSchema } from '@/lib/schemas';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

interface RoomListProps {
  rooms: z.infer<typeof RoomSchema>[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <ScrollArea className='max-h-[400px]'>
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
              <Link href={`/room/${room.id}`} className='w-full' passHref>
                <Button className='w-full'>参加する</Button>
              </Link>
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
