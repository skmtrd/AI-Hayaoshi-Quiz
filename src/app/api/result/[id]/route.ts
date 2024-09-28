import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const roomId = params.id;

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { Result: { include: { user: true } } },
    });

    const results = room?.Result;

    if (!results) {
      return NextResponse.json({ message: 'no results found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      message: 'success',
      data: {
        room,
      },
    });
  } catch (error) {
    console.error('An error occurred while fetching results:', error);
    return NextResponse.json({ message: 'internal server error', data: null }, { status: 500 });
  }
}
