import { dbConnect } from '@/lib/dbConnect';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export const POST = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const { theme, difficulty, answerTimeLimit, thinkingTimeLimit, types } = await req.json();

    const userId = await getUserId();
    const inviteId: string = uuidv4();

    const newRoom = await prisma.room.create({
      data: {
        theme,
        difficulty,
        answerTimeLimit,
        thinkingTimeLimit,
        types,
        inviteId,
        status: RoomStatus.WAITING,
        users: { connect: { id: userId } },
      },
    });

    return NextResponse.json<apiRes>(
      {
        message: 'room created',
        data: { inviteId: inviteId, newRoom: newRoom },
      },
      { status: 200 },
    );
  });
