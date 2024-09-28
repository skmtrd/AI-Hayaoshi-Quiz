import { User as AuthUser } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { z } from 'zod';

import QuizDialog from '@/components/element/QuizDialog';
import QuizInfo from '@/components/element/QuizInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isFutureTime } from '@/lib/isFutureTime';
import { RoomWithRoomUserAndUserAndQuestionSchema } from '@/lib/schemas';

type MatchingScreenProps = {
  currentUser: AuthUser;
  roomInfo: z.infer<typeof RoomWithRoomUserAndUserAndQuestionSchema>;
};

const tryAnswer = async (now: string, roomId: string) => {
  const res = await fetch(`/api/room/${roomId}/button`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ buttonTimeStamp: now }),
  });
  return res.json();
};

const submitAnswer = async (isCorrect: boolean, questionId: string, roomId: string) => {
  const res = await fetch(`/api/room/${roomId}/submit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isCorrect, questionId }),
  });
  return res.json();
};

const MatchingScreen: React.FC<MatchingScreenProps> = ({ currentUser, roomInfo }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roomInfo.questionOpenTimeStamp) return;
      setIsQuizOpen(isFutureTime(roomInfo.questionOpenTimeStamp));
    }, 100);
    return () => clearInterval(interval);
  }, [roomInfo.questionOpenTimeStamp]);

  const handleAnswer = async (choice: string) => {
    if (roomInfo.currentQuestionIndex === null) return;
    setAlreadyAnswered(true);
    const currentQuestion = roomInfo.questions[roomInfo.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = choice === currentQuestion.answer;
    await submitAnswer(isCorrect, currentQuestion.id, roomInfo.id);
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handlePress = async () => {
    const now = new Date().toISOString();
    await tryAnswer(now, roomInfo.id);
    mutate(`/api/room/${roomInfo.id}`);
  };

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsOpen(open);
    }
  }, []);

  useEffect(() => {
    setIsOpen(!!roomInfo.currentSolverId);
  }, [roomInfo.currentSolverId]);

  if (!roomInfo.questionOpenTimeStamp || roomInfo.currentQuestionIndex === null) {
    return <div>loading...</div>;
  }

  const currentQuestion = roomInfo.questions[roomInfo.currentQuestionIndex];

  return (
    <Card className='mx-auto w-full max-w-sm shadow-md'>
      <CardHeader className='bg-gray-100 py-4 sm:py-6'>
        <CardTitle className='text-center text-xl font-bold text-gray-800 sm:text-2xl'>
          オンラインクイズ
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
        <QuizInfo score={score} timeLeft={timeLeft} />
        <div className='space-y-4 sm:space-y-6'>
          {isQuizOpen && currentQuestion && (
            <p className='text-center text-lg font-semibold text-gray-700 sm:text-xl'>
              {currentQuestion.question}
            </p>
          )}
          <QuizDialog
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            currentUser={currentUser}
            roomInfo={roomInfo}
            currentQuestion={currentQuestion}
            handlePress={handlePress}
            handleAnswer={handleAnswer}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingScreen;
