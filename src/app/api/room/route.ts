import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export const POST = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const { name, userId, category, difficulty, answerTimeLimit, thinkingTimeLimit, types } =
      await req.json();

    const inviteId: string = uuidv4();
    const newRoom = await prisma.room.create({
      data: {
        name,
        category,
        difficulty,
        answerTimeLimit,
        thinkingTimeLimit,
        types,
        inviteId,
        status: RoomStatus.WAITING,
        users: { connect: { id: userId } },
      },
    });

    return NextResponse.json<apiRes>({
      message: 'room created',
      data: { inviteId: inviteId, newRoom: newRoom },
    });
  });
