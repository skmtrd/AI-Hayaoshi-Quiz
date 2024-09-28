import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

//部屋の情報取得api
export const GET = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    console.log('passmedkonldknsjnj');
    await dbConnect();
    const roomId: string = req.url.split('room/')[1];

    if (!roomId) {
      return NextResponse.json<apiRes>(
        { message: 'room id is required', data: null },
        { status: 400 },
      );
    }

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        RoomUser: {
          include: {
            user: true,
          },
        },
        questions: true,
      },
    });

    if (!room) {
      return NextResponse.json<apiRes>({ message: 'not found id' }, { status: 404 });
    }
    return NextResponse.json<apiRes>({ message: 'success', data: room }, { status: 200 });
  });
