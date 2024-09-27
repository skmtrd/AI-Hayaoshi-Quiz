import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Gamepad, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'AIが生成する問題',
    description: 'GPT-4oが様々なテーマで問題を生成。自由にお題を設定して遊ぶこともできます。',
    icon: <Brain className='size-6' />,
  },
  {
    title: 'リアルタイム対戦',
    description: '最大4人で同時対戦。友達や見知らぬ人と競い合いながら知識を深めましょう。',
    icon: <Users className='size-6' />,
  },
  {
    title: '楽しみながら学習',
    description: 'ゲーム感覚で様々な分野の知識が身につきます。遊びながら賢くなりましょう。',
    icon: <Gamepad className='size-6' />,
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className='mx-auto flex max-w-6xl flex-col items-center justify-center gap-y-10 px-4 py-16'>
      <h1 className='text-4xl font-bold text-primary'>AI早押しバトルへようこそ！</h1>

      <div className='flex w-full flex-col md:flex-row md:items-center md:justify-between'>
        <div className='mb-8 md:mb-0 md:w-1/2'>
          <h2 className='mb-4 text-2xl font-semibold'>知識と反射神経を競う新感覚クイズゲーム</h2>
          <p className='mb-6 text-lg text-muted-foreground'>
            AIが生成する多彩な問題に挑戦し、友達や世界中のプレイヤーと競い合おう。
            楽しみながら知識が身につく、新しい学習体験が待っています！
          </p>
          {!session?.user ? (
            <Link href='/api/auth/signin'>
              <Button size='lg'>
                今すぐ始める <ArrowRight className='ml-2 size-4' />
              </Button>
            </Link>
          ) : (
            <Link href='/room'>
              <Button size='lg'>
                ルームに参加する <ArrowRight className='ml-2 size-4' />
              </Button>
            </Link>
          )}
        </div>
        <div className='md:w-1/2'>
          <Image
            src=''
            alt='AI早押しバトルのイメージ'
            width={500}
            height={300}
            className='rounded-lg shadow-lg'
          />
        </div>
      </div>

      <div className='grid w-full gap-6 md:grid-cols-3'>
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {feature.icon}
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
