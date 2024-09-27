'use client';

import LeaveRoomButton from '@/components/element/LeaveRoomButton';
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
import { RoomSchema, RoomUserSchema, UserSchema } from '@/lib/schemas';
import { Flag, PlayIcon, Settings } from 'lucide-react';
import { User as AuthUser } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

const RoomUserWithUserSchema = RoomUserSchema.extend({
  user: UserSchema,
});

const RoomWithRoomUserSchema = RoomSchema.extend({
  RoomUser: z.array(RoomUserWithUserSchema),
});

type RoomInfoType = z.infer<typeof RoomWithRoomUserSchema>;

type WaitingScreenProps = {
  currentUser: AuthUser;
  roomInfo: RoomInfoType;
};

const leaveRoom = async (roomId: string) => {
  const res = await fetch(`/api/room/${roomId}/leave`, {
    method: 'PUT',
  });
  return res.json();
};

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ currentUser, roomInfo }) => {
  const router = useRouter();
  const roomId = usePathname().split('room/')[1];

  const handleStartGame = async () => {
    const res = await fetch(`/api/room/${roomId}/start`, {
      method: 'PUT',
    });
  };

  const [dots, setDots] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  if (!roomInfo) {
    return <div>loading...</div>;
  }

  const isHost = roomInfo.RoomUser.find((roomUser) => roomUser.userId === currentUser.id)?.isHost;

  const handleLeaveRoom = async () => {
    const res = await leaveRoom(roomInfo.id);
    if (res.message === 'success leave') {
      router.push('/rooms');
    } else if (res.message === 'room is deleted') {
      router.push('/rooms');
    } else if (res.message === 'you not joined') {
      router.push('/rooms');
    } else if (res.message === 'room not exits') {
      router.push('/rooms');
    }
  };

  return (
    <Card className='w-96'>
      <CardHeader className='border-b border-border p-3'>
        <div className='flex w-full items-center justify-between'>
          <LeaveRoomButton
            roomId={roomInfo.id}
            isHost={
              roomInfo.RoomUser.find((roomUser) => roomUser.userId === currentUser.id)?.isHost ??
              false
            }
          />
          <CardTitle>{roomInfo.theme}</CardTitle>
          <div className='size-10' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-y-5'>
        <div className='h-2' />
        <p className='text-lg font-medium'>
          参加者: {roomInfo.RoomUser.length} / {roomInfo.maxPlayer}
        </p>
        <ul
          className='flex max-h-[30vh] flex-col gap-2 overflow-y-auto'
          style={{ scrollbarWidth: 'thin' }}
        >
          {roomInfo.RoomUser.map((roomUser) => (
            <li
              key={roomUser.id}
              className='flex items-center justify-between gap-2 rounded-md bg-secondary px-4 py-2'
            >
              <div className='flex items-center gap-2'>
                <Avatar className='box-content border border-primary'>
                  <AvatarImage src={roomUser.user.image ?? ''} />
                  <AvatarFallback>{roomUser.user.name}</AvatarFallback>
                </Avatar>
                {roomUser.user.name}
              </div>
              {roomUser.isHost && <Flag fill='orange' />}
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
        {!isHost && (
          <div className='mt-4 flex items-center justify-center text-muted-foreground'>
            ホストが開始するのをお待ちください{'.'.repeat(dots)}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isHost && (
          <Button
            onClick={handleStartGame}
            className='flex items-center justify-center gap-1 font-semibold'
          >
            <PlayIcon size={16} fill='white' />
            スタート
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
