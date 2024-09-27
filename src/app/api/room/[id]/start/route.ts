import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();
    const roomId: string = req.url.split('/')[5];
    if (!roomId) {
      return NextResponse.json<apiRes>({ message: 'room not exits' }, { status: 400 });
    }
    const newRoomInfos = await prisma.room.update({
      where: { id: roomId },
      data: { status: RoomStatus.PLAYING },
    });

    return NextResponse.json<apiRes>(
      { message: 'match start', data: newRoomInfos },
      { status: 200 },
    );
  });
