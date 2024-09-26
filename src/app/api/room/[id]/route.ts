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
      where: {
        id: roomId,
      },
    });
    return NextResponse.json<apiRes>({ message: 'join success' });
  });

//部屋の情報取得api
export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
  res: NextResponse,
) =>
  handleAPIError(async () => {
    await dbConnect();

    if (!params.id) {
      return NextResponse.json<apiRes>(
        { message: 'room id is required', data: null },
        { status: 400 },
      );
    }

    const room = await prisma.room.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!room) {
      return NextResponse.json<apiRes>({ message: 'not found id' }, { status: 404 });
    }
    return NextResponse.json<apiRes>({ message: 'success', data: room }, { status: 200 });
  });
