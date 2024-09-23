import { dbConnect } from '@/lib/dbConnect';
import { getUserId } from '@/lib/getUserId';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { apiRes } from '@/lib/types';
import { RoomStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

//部屋への参加api
export const PUT = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    await dbConnect();
    const roomId = req.url.split('/room/')[1];
    const userId = await getUserId();

    //現在の部屋情報を取得する
    const roomInfos = await prisma.room.findUnique({
      where: { id: roomId },
    });

    //部屋が存在しない場合の処理(この処理がないとroomInfosの型エラーが発生する)
    if (!roomInfos) {
      return NextResponse.json<apiRes>({ message: 'room not exits', data: null }, { status: 404 });
    }

    //更新した部屋情報をNextResponseで返すための変数
    let updateRoomInfo;
    const currentNumOfUser = roomInfos.numberOfUser;

    //既に部屋の人数が最大（4人）の場合
    if (currentNumOfUser === 4) {
      return NextResponse.json<apiRes>(
        { message: 'room is full', data: roomInfos },
        { status: 400 },
      );
      //あと一人参加すると最大人数になる場合の処理
    } else if (currentNumOfUser === 3) {
      updateRoomInfo = await prisma.room.update({
        where: { id: roomId },
        data: {
          status: RoomStatus.PLAYING,
          numberOfUser: 4,
          RoomUser: { connect: { id: userId } },
        },
      });
      //部屋の人数が1人,2人のときの処理
    } else {
      updateRoomInfo = await prisma.room.update({
        where: { id: roomId },
        data: { numberOfUser: currentNumOfUser + 1, RoomUser: { connect: { id: userId } } },
      });
    }

    return NextResponse.json<apiRes>(
      { message: 'join success', data: updateRoomInfo },
      { status: 200 },
    );
  });
