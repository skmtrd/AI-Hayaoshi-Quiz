import { dbConnect } from '@/lib/dbConnect';
import { prisma } from '@/lib/prisma';

const getRoomUserId = async (roomId: string, userId: string) => {
  dbConnect();
  const roomUser = await prisma.roomUser.findUnique({
    where: { roomId, userId },
  });

  return session?.user?.id;
};
