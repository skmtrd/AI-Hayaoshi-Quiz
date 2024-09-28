import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    const roomId: string = req.url.split('/')[5];
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json<apiRes>({ message: 'user not found', data: null }, { status: 404 });
    }

    //現在の部屋情報を取得する
    const roomInfos = await prisma.room.findUnique({
      where: { id: roomId },
      include: { RoomUser: true },
    });

    //部屋が存在しない場合の処理(この処理がないとroomInfosの型エラーが発生する)
    if (!roomInfos) {
      return NextResponse.json<apiRes>({ message: 'room not exits', data: null }, { status: 404 });
    }

    //部屋に参加してないユーザーが退室しようとした場合
    if (roomInfos.RoomUser.length === 0) {
      return NextResponse.json<apiRes>(
        { message: 'you not joined', data: roomInfos },
        { status: 400 },
      );
    }

    //ユーザー退室の処理
    console.log('pass');
    const updateRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        numberOfUser: roomInfos.numberOfUser - 1,
      },
    });

    const removedUser = await prisma.roomUser.delete({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: roomId,
        },
      },
    });

    //部屋の人数が０人に成ったら、もしくは部屋のホストが退室したら、部屋を削除する。
    if (
      roomInfos.numberOfUser - 1 === 0 ||
      roomInfos.RoomUser.find((roomUser) => roomUser.userId === userId)?.isHost
    ) {
      const deleteRoomUser = await prisma.roomUser.deleteMany({
        where: {
          roomId: roomId,
        },
      });

      const deleteQuestion = await prisma.question.deleteMany({
        where: {
          roomId: roomId,
        },
      });

      const deleteRoom = await prisma.room.delete({
        where: {
          id: roomId,
        },
      });
      return NextResponse.json<apiRes>(
        { message: 'room is deleted', data: deleteRoom },
        { status: 200 },
      );
    }

    return NextResponse.json({ message: 'success leave', data: updateRoom }, { status: 200 });
  });
