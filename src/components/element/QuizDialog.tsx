import InteractiveBuzzerButton from '@/components/element/InteractiveBuzzerButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RoomWithRoomUserAndUserAndQuestionSchema } from '@/lib/schemas';
import { User as AuthUser } from 'next-auth';
import React from 'react';
import { z } from 'zod';

type QuizDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: AuthUser;
  roomInfo: z.infer<typeof RoomWithRoomUserAndUserAndQuestionSchema>;
  currentQuestion:
    | z.infer<typeof RoomWithRoomUserAndUserAndQuestionSchema>['questions'][number]
    | undefined;
  handlePress: () => Promise<void>;
  handleAnswer: (choice: string) => Promise<void>;
  questionTextIndex: number;
};

const QuizDialog: React.FC<QuizDialogProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  roomInfo,
  currentQuestion,
  handlePress,
  handleAnswer,
  questionTextIndex,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <InteractiveBuzzerButton onClick={handlePress} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentQuestion?.question.slice(0, questionTextIndex)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {roomInfo.currentSolverId === currentUser.id
              ? '以下から正しい答えを選んでください。'
              : roomInfo.currentSolverId === null
                ? '回答権の確認中です。'
                : '他のプレイヤーが回答中です。'}
          </AlertDialogDescription>
          {roomInfo.currentSolverId === currentUser.id && currentQuestion && (
            <div className='grid grid-cols-1 gap-3 sm:gap-4'>
              {[...currentQuestion.incorrectAnswers, currentQuestion.answer]
                .sort()
                .map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
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
  );
};

export default QuizDialog;
