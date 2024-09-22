import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<apiRes>({ message: 'success', data: rooms }, { status: 200 });
  });
