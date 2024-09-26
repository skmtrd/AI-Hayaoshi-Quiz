import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
  res: NextResponse,
) =>
  handleAPIError(async () => {
    await dbConnect();

    if (!params.id) {
      return NextResponse.json<apiRes>(
        { message: 'user id is required', data: null },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        results: true,
      },
    });

    if (!user) {
      return NextResponse.json<apiRes>({ message: 'not found id' }, { status: 404 });
    }
    return NextResponse.json<apiRes>({ message: 'success', data: user }, { status: 200 });
  });
