import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import React from 'react';

type QuizInfoProps = {
  score: number;
  timeLeft: number;
};

const QuizInfo: React.FC<QuizInfoProps> = ({ score, timeLeft }) => {
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
      <Progress value={(timeLeft / 15) * 100} className='h-2 w-full sm:h-3' />
    </>
  );
};

export default QuizInfo;
