import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  await prisma.room.deleteMany({
    where: {
      status: {
        in: ['WAITING', 'PLAYING'],
      },
      createdAt: {
        lt: new Date(Date.now() - 1000 * 60 * 10), // old than 10 minutes
      },
    },
  });

  return new Response('OK', {
    status: 200,
  });
}
