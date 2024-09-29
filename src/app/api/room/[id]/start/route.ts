import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    const roomId: string = req.url.split('/')[5];
    if (!roomId) {
      return NextResponse.json<apiRes>({ message: 'room not exits' }, { status: 400 });
    }

    const nowDate = new Date();
    nowDate.setSeconds(nowDate.getSeconds() + 7);
    const questionOpenTimeStamp = nowDate.toISOString();

    const newRoomInfos = await prisma.room.update({
      where: { id: roomId },
      data: { status: RoomStatus.PLAYING, questionOpenTimeStamp },
    });

    return NextResponse.json<apiRes>(
      { message: 'match start', data: newRoomInfos },
      { status: 200 },
    );
  });
