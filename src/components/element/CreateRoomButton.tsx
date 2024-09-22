'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const createRoom = async (params: {
  theme: string;
  difficulty: number;
  answerTimeLimit: number;
  thinkingTimeLimit: number;
  types: string;
}) => {
  const res = await fetch('/api/room', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.json();
};

const CreateRoomButton = () => {
  const [theme, setTheme] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [time, setTime] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const answerTimeLimit = time === 'unlimited' ? 9999 : Number(time);
    const types = isPrivate ? 'PRIVATE' : 'PUBLIC';
    const difficultyNum = difficulty === 'easy' ? 25 : difficulty === 'normal' ? 50 : 75;
    const res = await createRoom({
      theme,
      difficulty: difficultyNum,
      answerTimeLimit,
      thinkingTimeLimit: 30,
      types,
    });
    router.push(`/room/${res.data.newRoom.id}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mb-4 w-full bg-green-500 text-white hover:bg-green-600'>
          <Plus className='mr-2 size-4' /> 部屋を作成
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>部屋を作成</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='theme' className='text-center font-bold'>
              テーマ
            </Label>
            <Input
              id='theme'
              placeholder='テーマを入力'
              className='col-span-3'
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='difficulty' className='text-center font-bold'>
              難易度
            </Label>
            <div></div>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='難易度を選択' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>難易度</SelectLabel>
                  <SelectItem value='easy'>かんたん</SelectItem>
                  <SelectItem value='normal'>ふつう</SelectItem>
                  <SelectItem value='hard'>むずかしい</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='time' className='text-center font-bold'>
              回答時間
            </Label>
            <div></div>
            <div>
              <Select value={time} onValueChange={(value) => setTime(value)}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='回答時間を選択' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>回答時間</SelectLabel>
                    <SelectItem value='5'>5秒</SelectItem>
                    <SelectItem value='10'>10秒</SelectItem>
                    <SelectItem value='15'>15秒</SelectItem>
                    <SelectItem value='20'>20秒</SelectItem>
                    <SelectItem value='25'>25秒</SelectItem>
                    <SelectItem value='30'>30秒</SelectItem>
                    <SelectItem value='unlimited'>無制限</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className='absolute mt-2 text-right text-xs text-muted-foreground'>
                ボタンを押してからの猶予
              </p>
            </div>
          </div>
          <div className='mt-3 grid grid-cols-4 items-center gap-4'>
            <div className='grid place-items-center'>
              <Label htmlFor='private' className='whitespace-nowrap font-bold'>
                プライベート
              </Label>
            </div>
            <div />
            <div />
            <div className='grid place-items-end'>
              <Switch
                id='private'
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='button' onClick={handleSubmit}>
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomButton;
