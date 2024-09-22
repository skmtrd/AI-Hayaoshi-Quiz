import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export const GET = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ message: 'success', data: todos });
  });

export const POST = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();
    console.log('success');

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { title } = await req.json();

    const todo = await prisma.todo.create({
      data: {
        title,
        user: {
          connect: { id: userId },
        },
        completed: false,
      },
    });
    return NextResponse.json({ message: 'success', data: todo }, { status: 201 });
  });

export const DELETE = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await req.json();

    const todo = await prisma.todo.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: 'success', data: todo });
  });

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();

    const { id, completed } = await req.json();

    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed,
      },
    });
    return NextResponse.json({ message: 'success', data: todo });
  });
