import InteractiveBuzzerButton from '@/components/element/InteractiveBuzzerButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { isFutureTime } from '@/lib/isFutureTime';
import { QuestionSchema, RoomWithRoomUserAndUserAndQuestionSchema } from '@/lib/schemas';
import { User as AuthUser } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { z } from 'zod';

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

const MatchingScreen: React.FC<MatchingScreenProps> = ({ currentUser, roomInfo }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [isSolver, setIsSolver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<null | z.infer<typeof QuestionSchema>>(
    null,
  );

  const [choices, setChoices] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roomInfo.questionOpenTimeStamp) return;
      else if (isFutureTime(roomInfo.questionOpenTimeStamp) && currentQuestion === null) {
        if (roomInfo.currentQuestionIndex === null) return;
        setCurrentQuestion(roomInfo.questions[roomInfo.currentQuestionIndex]);
        setChoices(
          [
            ...roomInfo.questions[roomInfo.currentQuestionIndex].incorrectAnswers,
            roomInfo.questions[roomInfo.currentQuestionIndex].answer,
          ].sort(),
        );
      }
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (index: number) => {
    setIsOpen(false);
  };

  const handlePress = async () => {
    mutate(`/api/room/${roomInfo.id}`);
    const now = new Date().toISOString();
    const res = await tryAnswer(now, roomInfo.id);
    if (res.message === 'buttonTimeStamp is saved to db') {
      setIsSolver(true);
    } else if (res.message === 'buttonTimeStamp is updated') {
      setIsSolver(true);
    } else if (res.message === 'no update buttonTimeStamp(success)') {
      setIsSolver(false);
    }
    mutate(`/api/room/${roomInfo.id}`);
  };

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      return;
    }
    setIsOpen(open);
  }, []);
  if (roomInfo.currentSolverId && !isOpen) {
    setIsOpen(true);
  }

  return (
    <Card className='mx-auto w-full max-w-sm shadow-md'>
      <CardHeader className='bg-gray-100 py-4 sm:py-6'>
        <CardTitle className='text-center text-xl font-bold text-gray-800 sm:text-2xl'>
          オンラインクイズ
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
        <div className='flex items-center justify-between'>
          <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
            問題 {1}/3
          </Badge>
          <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
            スコア: {score}
          </Badge>
        </div>
        <Progress value={(timeLeft / 15) * 100} className='h-2 w-full sm:h-3' />
        <div className='space-y-4 sm:space-y-6'>
          {currentQuestion && (
            <p className='text-center text-lg font-semibold text-gray-700 sm:text-xl'>
              {currentQuestion.question}
            </p>
          )}
          <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
              <InteractiveBuzzerButton onClick={handlePress} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{currentQuestion?.question}</AlertDialogTitle>
                <AlertDialogDescription>
                  {isSolver
                    ? '以下から正しい答えを選んでください。'
                    : roomInfo.currentSolverId === null
                      ? '回答権の確認中です。'
                      : '他のプレイヤーが回答中です。'}
                </AlertDialogDescription>
                {isSolver && (
                  <div className='grid grid-cols-1 gap-3 sm:gap-4'>
                    {currentQuestion &&
                      choices.map((choice, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className='h-auto py-3 text-sm font-bold sm:py-4 sm:text-base'
                          variant='outline'
                        >
                          {choice}
                        </Button>
                      ))}
                  </div>
                )}
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingScreen;
