import { calculateResults } from '@/lib/calculateResults';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    const roomId: string = req.url.split('/')[5];
    const userId = await getUserId();

    if (!roomId) {
      return NextResponse.json<apiRes>({ message: 'room not exits' }, { status: 400 });
    }

    const roomInfos = await prisma.room.findUnique({
      where: { id: roomId },
      include: { questions: true, Result: true, RoomUser: true },
    });

    if (roomInfos?.status === 'FINISHED') {
      return NextResponse.json<apiRes>({ message: 'room is finished' }, { status: 400 });
    }

    if (roomInfos?.currentQuestionIndex === null || roomInfos?.currentQuestionIndex === undefined) {
      return NextResponse.json<apiRes>({ message: 'room is finished' }, { status: 400 });
    }
    const nowDate = new Date();
    nowDate.setSeconds(nowDate.getSeconds() + 7);
    const questionOpenTimeStamp = nowDate.toISOString();
    console.log(questionOpenTimeStamp);
    const newRoomInfos = await prisma.room.update({
      where: { id: roomId },
      data: {
        currentSolverId: null,
        buttonTimeStamp: null,
        questionOpenTimeStamp: questionOpenTimeStamp,
        currentQuestionIndex: roomInfos?.currentQuestionIndex + 1,
      },
    });

    const results = await calculateResults(roomId, newRoomInfos.types === 'RATED');
    console.log(results);

    if (newRoomInfos.currentQuestionIndex === roomInfos?.questions.length) {
      const updatedRoomInfos = await prisma.room.update({
        where: { id: roomId },
        data: {
          status: 'FINISHED',
          Result: {
            createMany: {
              data: results,
            },
          },
        },
      });
    }

    return NextResponse.json<apiRes>(
      { message: 'solver created', data: newRoomInfos },
      { status: 200 },
    );
  });
