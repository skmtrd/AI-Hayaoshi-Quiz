import InteractiveBuzzerButton from '@/components/element/InteractiveBuzzerButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCallback, useState } from 'react';

const MatchingScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: '坂村健が提唱した「デジタルアーカイブ」の基本的な理念は何ですか？',
      choices: ['デジタル化', '保存', '公開', '共有'],
      correctAnswer: 0,
    },
    // 他の質問をここに追加
  ]);
  const [isSolver, setIsSolver] = useState(false);

  const handleAnswer = (index: number) => {
    setIsOpen(false);
  };

  const handlePress = () => {
    setIsSolver(!isSolver);
  };

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      return;
    }
    setIsOpen(open);
  }, []);

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
          <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
              <InteractiveBuzzerButton onClick={handlePress} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className='grid grid-cols-1 gap-3 sm:gap-4'>
                  {questions[questionIndex].choices.map((choice, index) => (
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
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingScreen;
