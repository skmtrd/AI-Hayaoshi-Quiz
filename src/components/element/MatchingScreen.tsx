import InteractiveBuzzerButton from '@/components/element/InteractiveBuzzerButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const MatchingScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questions, setQuestions] = useState([
    {
      question: '坂村健が提唱した「デジタルアーカイブ」の基本的な理念は何ですか？',
      choices: ['デジタル化', '保存', '公開', '共有'],
      correctAnswer: 0,
    },
    // 他の質問をここに追加
  ]);

  const handleAnswer = (index: number) => {
    // 回答処理のロジックをここに実装
  };

  const questionIndex = 0;

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
            問題 {questionIndex + 1}/{questions.length}
          </Badge>
          <Badge variant='outline' className='px-2 py-1 text-sm sm:text-base'>
            スコア: {score}
          </Badge>
        </div>
        <Progress value={(timeLeft / 15) * 100} className='h-2 w-full sm:h-3' />
        <div className='space-y-4 sm:space-y-6'>
          <p className='text-center text-lg font-semibold text-gray-700 sm:text-xl'>
            {questions[questionIndex].question}
          </p>
          <InteractiveBuzzerButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingScreen;
