import { dbConnect } from '@/lib/dbConnect';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

//roomテーブルからmaxPlayerカラムを取得
//これはPUTのApiで使用している関数
const getRoomMaxPlayer = async (roomId: string) => {
  try {
    dbConnect();
    const roomInfos = await prisma.room.findUnique({ where: { id: roomId } });
    const maxPlayer = roomInfos?.maxPlayer;

    //maxPlayerが部屋作成時に設定されていない場合は最大人数(4人)を返す
    if (!maxPlayer) {
      return 4;
    } else {
      return maxPlayer;
    }
  } catch (error) {
    throw error;
  } finally {
    prisma.$disconnect();
  }
};

//部屋への参加api
export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const roomId: string = req.url.split('/')[5];
    const userId = await getUserId();

    //現在の部屋情報を取得する
    const roomInfos = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomUser: true,
      },
    });

    //ユーザーが既に部屋に参加している場合
    if (roomInfos?.RoomUser.find((roomUser) => roomUser.userId === userId)) {
      return NextResponse.json<apiRes>(
        { message: 'join success', data: roomInfos },
        { status: 200 },
      );
    }

    //部屋が存在しない場合の処理(この処理がないとroomInfosの型エラーが発生する)
    if (!roomInfos) {
      return NextResponse.json<apiRes>({ message: 'room not exits', data: null }, { status: 404 });
    }

    //更新した部屋情報をNextResponseで返すための変数
    let updateRoomInfo;
    const currentNumOfUser = roomInfos.numberOfUser;

    const maxPlayer = await getRoomMaxPlayer(roomId);

    //既に部屋の人数が最大（4人）の場合
    if (currentNumOfUser === maxPlayer) {
      return NextResponse.json<apiRes>(
        { message: 'room is full', data: roomInfos },
        { status: 400 },
      );
      //あと一人参加すると最大人数になる場合の処理
    } else if (currentNumOfUser === maxPlayer - 1) {
      updateRoomInfo = await prisma.room.update({
        where: { id: roomId },
        data: {
          status: RoomStatus.PLAYING,
          numberOfUser: maxPlayer,
        },
      });
      //部屋の人数が1人,2人のときの処理
    } else {
      updateRoomInfo = await prisma.room.update({
        where: { id: roomId },
        data: { numberOfUser: currentNumOfUser + 1 },
      });
    }

    const roomUser = await prisma.roomUser.create({
      data: {
        isHost: false,
        room: { connect: { id: roomId } },
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json<apiRes>(
      { message: 'join success', data: updateRoomInfo },
      { status: 200 },
    );
  });
