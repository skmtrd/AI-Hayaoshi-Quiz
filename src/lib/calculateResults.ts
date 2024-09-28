import { prisma } from './prisma';

const calcRatingDelta = (place: number, playerCount: number, isRated: boolean) => {
  if (!isRated) return 0;
  // top: +10
  // higher: +5
  // middle: 0
  // lower: -5
  // bottom: -10
  const middle = Math.floor(playerCount / 2);
  const isTop = place === 1;
  const isBottom = place === playerCount;
  const isHigher = place < middle;
  const isLower = place > middle;

  const ratingDelta = isTop ? 10 : isBottom ? -10 : isHigher ? 5 : isLower ? -5 : 0;
  return ratingDelta;
};

export async function calculateResults(roomId: string, rated: boolean = false) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      RoomUser: {
        include: {
          user: true,
        },
      },
      questions: {
        include: {
          solvers: {
            where: {
              isCorrect: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  const userCorrectCounts = room.questions.reduce(
    (counts, question) => {
      question.solvers.forEach((solver) => {
        counts[solver.userId] = (counts[solver.userId] || 0) + 1;
      });
      return counts;
    },
    {} as Record<string, number>,
  );

  const sortedRoomUsers = room.RoomUser.sort(
    (a, b) => (userCorrectCounts[b.userId] || 0) - (userCorrectCounts[a.userId] || 0),
  );

  const results = sortedRoomUsers.map((roomUser, index) => {
    const place = index + 1;
    const ratingDelta = calcRatingDelta(place, sortedRoomUsers.length, rated);

    return {
      userId: roomUser.userId,
      correctCount: userCorrectCounts[roomUser.userId] || 0,
      ratingDelta: ratingDelta,
    };
  });

  const sortedResults = results.sort((a, b) => {
    if (b.correctCount === a.correctCount) {
      if (b.ratingDelta === a.ratingDelta) {
        return b.userId.localeCompare(a.userId);
      }
      return b.ratingDelta - a.ratingDelta;
    }
    return b.correctCount - a.correctCount;
  });

  return sortedResults;
}
