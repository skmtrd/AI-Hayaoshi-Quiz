import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RoomUserWithUserSchema } from '@/lib/schemas';
import React from 'react';
import { z } from 'zod';

const UsersSchema = z.array(RoomUserWithUserSchema);

type QuizInfoProps = {
  score: number;
  timeLeft: number;
  users: z.infer<typeof UsersSchema>;
};

const QuizInfo: React.FC<QuizInfoProps> = ({ score, timeLeft, users }) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
          問題 {1}/3
        </Badge>
        <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
          スコア: {score}
        </Badge>
      </div>
      <div className='flex w-full items-center justify-center gap-2'>
        {users.map((user) => (
          <Avatar key={user.id} className='box-content border border-primary'>
            <AvatarImage src={user.user.image ?? ''} />
            <AvatarFallback>{user.user.name}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <Progress value={(timeLeft / 15) * 100} className='h-2 w-full sm:h-3' />
    </>
  );
};

export default QuizInfo;
