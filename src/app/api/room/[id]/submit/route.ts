import { calculateResults } from '@/lib/calculateResults';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import console from 'console';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    const roomId: string = req.url.split('/')[5];
    const userId = await getUserId();

    if (!roomId) {
      return NextResponse.json<apiRes>({ message: 'room not exits' }, { status: 400 });
    }
    const { isCorrect, questionId } = await req.json();

    const roomInfos = await prisma.room.findUnique({
      where: { id: roomId },
      include: { questions: true, Result: true },
    });

    if (roomInfos?.status === 'FINISHED') {
      return NextResponse.json<apiRes>({ message: 'room is finished' }, { status: 400 });
    }

    const solver = await prisma.solver.create({
      data: {
        isCorrect,
        user: { connect: { id: userId } },
        question: { connect: { id: questionId } },
      },
    });
    if (
      isCorrect &&
      roomInfos?.currentQuestionIndex !== null &&
      roomInfos?.currentQuestionIndex !== undefined
    ) {
      const nowDate = new Date();
      nowDate.setSeconds(nowDate.getSeconds() + 15);
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

      // results計算と保存を修正
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
    } else {
      const newRoomInfos = await prisma.room.update({
        where: { id: roomId },
        data: {
          currentSolverId: null,
          buttonTimeStamp: null,
        },
      });
    }
    return NextResponse.json<apiRes>({ message: 'solver created', data: solver }, { status: 200 });
  });
