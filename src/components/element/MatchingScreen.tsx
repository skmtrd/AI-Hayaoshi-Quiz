import { User as AuthUser } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { z } from 'zod';

import QuizDialog from '@/components/element/QuizDialog';
import QuizInfo from '@/components/element/QuizInfo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isFutureTime } from '@/lib/isFutureTime';
import { RoomWithRoomUserAndUserAndQuestionSchema } from '@/lib/schemas';
import { Circle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isOpenIncorrectDialog, setIsOpenIncorrectDialog] = useState(false);
  const [isOpenCorrectDialog, setIsOpenCorrectDialog] = useState(false);
  const [isOpenOtherUserCorrectDialog, setIsOpenOtherUserCorrectDialog] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isTimerActive) {
      const newTimer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            setIsTimerActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => {
        clearInterval(newTimer);
      };
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isTimerActive, timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roomInfo.questionOpenTimeStamp || roomInfo.currentQuestionIndex === null) return;
      setIsQuizOpen(isFutureTime(roomInfo.questionOpenTimeStamp));
      setAlreadyAnswered(
        roomInfo.questions[roomInfo.currentQuestionIndex]?.solvers.some(
          (solver) => solver.userId === currentUser.id,
        ),
      );
      if (
        isFutureTime(roomInfo.questionOpenTimeStamp) &&
        !isTimerActive &&
        !roomInfo.currentSolverId
      ) {
        console.log('setIsTimerActive(true)');
        console.log(isTimerActive);
        setIsTimerActive(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [
    roomInfo.questionOpenTimeStamp,
    roomInfo.currentQuestionIndex,
    currentUser.id,
    roomInfo.questions,
    isQuizOpen,
    isTimerActive,
    roomInfo.currentSolverId,
  ]);

  const handleAnswer = async (choice: string) => {
    if (roomInfo.currentQuestionIndex === null) return;
    setAlreadyAnswered(true);
    const currentQuestion = roomInfo.questions[roomInfo.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = choice === currentQuestion.answer;
    await submitAnswer(isCorrect, currentQuestion.id, roomInfo.id);
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setIsOpenCorrectDialog(true);
      setTimeout(() => {
        setIsOpenCorrectDialog(false);
      }, 5000);
    } else {
      setIsOpenIncorrectDialog(true);
      setTimeout(() => {
        setIsOpenIncorrectDialog(false);
      }, 5000);
    }
    mutate(`/api/room/${roomInfo.id}`);
  };

  const handlePress = async () => {
    console.log(timeLeft);
    if (alreadyAnswered || !isQuizOpen || timeLeft === 0) return;
    console.log('handlePress');
    const now = new Date().toISOString();
    await tryAnswer(now, roomInfo.id);
    mutate(`/api/room/${roomInfo.id}`);
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (alreadyAnswered || !isQuizOpen || timeLeft === 0) return;
      if (open) {
        setIsOpen(open);
      }
    },
    [alreadyAnswered, isQuizOpen, timeLeft],
  );

  useEffect(() => {
    setIsOpen(!!roomInfo.currentSolverId);
    if (!roomInfo.currentSolverId) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [roomInfo.currentSolverId]);

  useEffect(() => {
    setTimeLeft(15);
    setIsTimerActive(false);
    if (roomInfo.currentQuestionIndex === null || roomInfo.currentQuestionIndex === 0) return;
    if (
      roomInfo.questions[roomInfo.currentQuestionIndex - 1].solvers.find(
        (solver) => solver.isCorrect,
      )?.userId !== currentUser.id
    ) {
      setIsOpenOtherUserCorrectDialog(true);
      setTimeout(() => {
        setIsOpenOtherUserCorrectDialog(false);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomInfo.currentQuestionIndex]);

  if (!roomInfo.questionOpenTimeStamp || roomInfo.currentQuestionIndex === null) {
    return <div>loading...</div>;
  }

  if (roomInfo.status === 'FINISHED') {
    setTimeout(() => {
      router.push(`/result/${roomInfo.id}`);
    }, 10000);
  }

  const currentQuestion = roomInfo.questions[roomInfo.currentQuestionIndex];

  return (
    <Card className='mx-auto w-full max-w-sm shadow-md'>
      {isOpenIncorrectDialog && (
        <AlertDialog open={isOpenIncorrectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{currentQuestion?.question}</AlertDialogTitle>
              <AlertDialogDescription>回答</AlertDialogDescription>
              <div className='flex items-center justify-center'>
                <X size={100} color={'blue'} strokeWidth={4} />
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isOpenCorrectDialog && (
        <AlertDialog open={isOpenCorrectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {roomInfo.currentQuestionIndex === 0
                  ? ''
                  : roomInfo.questions[roomInfo.currentQuestionIndex - 1].question}
              </AlertDialogTitle>
              <AlertDialogDescription>回答</AlertDialogDescription>
              <div className='flex items-center justify-center'>
                <Circle size={100} color={'red'} strokeWidth={4} />
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isOpenOtherUserCorrectDialog && (
        <AlertDialog open={isOpenOtherUserCorrectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {roomInfo.questions[roomInfo.currentQuestionIndex - 1].question}
              </AlertDialogTitle>
              <AlertDialogDescription>回答</AlertDialogDescription>
              <Avatar className='relative z-10 box-content size-20 border border-primary'>
                <AvatarImage
                  src={
                    roomInfo.questions[roomInfo.currentQuestionIndex - 1].solvers.find(
                      (solver) => solver.isCorrect,
                    )?.user.image ?? ''
                  }
                  className='z-20'
                />
                <AvatarFallback>
                  {
                    roomInfo.questions[roomInfo.currentQuestionIndex - 1].solvers.find(
                      (solver) => solver.isCorrect,
                    )?.user.name
                  }
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center justify-center'>
                <Circle size={100} color={'red'} strokeWidth={4} />
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <CardHeader className='bg-gray-100 py-4 sm:py-6'>
        <CardTitle className='text-center text-xl font-bold text-gray-800 sm:text-2xl'>
          {roomInfo.theme}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
        <QuizInfo
          score={score}
          timeLeft={timeLeft}
          users={roomInfo.RoomUser}
          questionInfos={roomInfo.questions}
          currentQuestionIndex={roomInfo.currentQuestionIndex}
        />
        <div className='space-y-4 sm:space-y-6'>
          {isQuizOpen && currentQuestion && (
            <p className='text-center text-lg font-semibold text-gray-700 sm:text-xl'>
              {currentQuestion.question}
            </p>
          )}
          {!currentQuestion && (
            <p className='text-center text-lg font-semibold text-gray-700 sm:text-xl'>
              集計中です...
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
