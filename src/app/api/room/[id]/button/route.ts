import { dbConnect } from '@/lib/dbConnect';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { isAfter } from 'date-fns';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();
    const roomId: string = req.url.split('/')[5];
    const roomInfos = await prisma.room.findUnique({ where: { id: roomId } });
    const userId = await getUserId();

    if (!roomInfos)
      return NextResponse.json<apiRes>({ message: 'room not exits' }, { status: 400 });

    //ボタンが押された時の時間
    const { buttonTimeStamp } = await req.json();
    //既にデータベースに保存されている部屋のbuttonTimeStamp
    const savedButtonTimeStamp = roomInfos?.buttonTimeStamp;

    if (!savedButtonTimeStamp) {
      const newRoomInfos = await prisma.room.update({
        where: { id: roomId },
        data: {
          buttonTimeStamp: buttonTimeStamp,
          currentSolverId: userId,
        },
      });
      return NextResponse.json<apiRes>(
        { message: 'buttonTimeStamp is saved to db', data: newRoomInfos },
        { status: 200 },
      );
    }

    //データベースに保存されているbuttonTimeStampとフロントから送られて来たroomInfos.buttonTimeStampの比較
    //
    if (!isAfter(buttonTimeStamp, savedButtonTimeStamp)) {
      const newRoomInfos = await prisma.room.update({
        where: { id: roomId },
        data: {
          buttonTimeStamp: buttonTimeStamp,
          currentSolverId: userId,
        },
      });
      return NextResponse.json<apiRes>(
        { message: 'buttonTimeStamp is updated', data: newRoomInfos },
        { status: 200 },
      );
    } else {
      return NextResponse.json<apiRes>(
        { message: 'no update buttonTimeStamp(success)', data: roomInfos },
        { status: 200 },
      );
    }
  });
