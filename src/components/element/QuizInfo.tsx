import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuestionWithSolverSchema, RoomUserWithUserSchema } from '@/lib/schemas';
import React from 'react';
import { z } from 'zod';

const UsersSchema = z.array(RoomUserWithUserSchema);
const QuestionInfosSchema = z.array(QuestionWithSolverSchema);

type QuizInfoProps = {
  score: number;
  timeLeft: number;
  users: z.infer<typeof UsersSchema>;
  questionInfos: z.infer<typeof QuestionInfosSchema>;
};

const QuizInfo: React.FC<QuizInfoProps> = ({ score, timeLeft, users, questionInfos }) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
          問題 1/3
        </Badge>
        <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
          スコア: {score}
        </Badge>
      </div>
      <div className='flex w-full items-center justify-center gap-2'>
        {users.map((user) => (
          <div key={user.id} className='flex flex-col items-center'>
            <Avatar className='z-10 box-content border border-primary'>
              <AvatarImage src={user.user.image ?? ''} className='z-20' />
              <AvatarFallback>{user.user.name}</AvatarFallback>
            </Avatar>
            <span className='z-50 -mt-3 flex size-2 items-center justify-center rounded-full bg-slate-400/80 p-3 text-xs font-bold text-black'>
              {
                questionInfos.filter((question) =>
                  question.solvers.some((solver) => solver.userId === user.userId),
                ).length
              }
            </span>
          </div>
        ))}
      </div>
      <Progress value={(timeLeft / 15) * 100} className='h-2 w-full sm:h-3' />
    </>
  );
};

export default QuizInfo;
