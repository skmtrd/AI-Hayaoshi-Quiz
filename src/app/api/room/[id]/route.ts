import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

//部屋への参加api
export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const { roomId, userId } = await req.json();
    const numberOfUser = await prisma.room.findUnique({
      id: roomId,
    });
    return NextResponse.json<apiRes>({ message: 'join success' });
  });
