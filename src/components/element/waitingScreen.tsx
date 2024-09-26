'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Room, RoomUser, User } from '@prisma/client';
import { ArrowLeft, PlayIcon, Settings } from 'lucide-react';
import { User as AuthUser } from 'next-auth';
import Link from 'next/link';

type WaitingScreenProps = {
  room: Room & {
    RoomUser: (RoomUser & {
      user: User;
    })[];
  };
  currentUser: AuthUser;
};

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ room, currentUser }) => {
  const isHost = room.RoomUser.find(
    (roomUser) => roomUser.user.id === currentUser.id && roomUser.isHost,
  );

  return (
    <Card className='w-96'>
      <CardHeader className='border-b border-border p-3'>
        <div className='flex w-full items-center justify-between'>
          <Link href='/room' passHref>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='size-5' />
            </Button>
          </Link>
          <CardTitle>{room.theme}</CardTitle>
          <div className='size-10' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-y-5'>
        <div className='h-2' />
        <p>
          参加者: {room.RoomUser.length} / 8{/* 参加者 : {room.users.length} / {room.maxUsers}*/}
        </p>
        <ul
          className='flex max-h-[30vh] flex-col gap-2 overflow-y-auto'
          style={{ scrollbarWidth: 'thin' }}
        >
          {room.RoomUser.map((roomUser) => (
            <li
              key={roomUser.user.id}
              className='flex items-center gap-2 rounded-md bg-secondary p-2'
            >
              <Avatar className='box-content border border-primary'>
                <AvatarImage src={roomUser.user.image ?? ''} />
                <AvatarFallback>{roomUser.user.name}</AvatarFallback>
              </Avatar>
              {roomUser.user.name}
            </li>
          ))}
        </ul>
        {isHost && (
          <Accordion type='single' collapsible className='w-full border-t border-border'>
            <AccordionItem value='room-settings'>
              <AccordionTrigger>
                <div className='flex items-center gap-2'>
                  <Settings className='size-5' />
                  <h3 className='text-lg font-semibold'>ルーム設定</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-muted-foreground' htmlFor='public-room'>
                      公開ルーム
                    </Label>
                    <Switch id='public-room' />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter>
        {isHost && (
          <Button>
            <PlayIcon />
            スタート
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
