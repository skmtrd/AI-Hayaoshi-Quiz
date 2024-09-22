import SignIn from '@/components/SignIn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { auth } from '../../auth';

const Home = async () => {
  const session = await auth();

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-y-10 px-4'>
      <div className='flex w-full flex-col'>
        {!session?.user?.image ? (
          <SignIn />
        ) : (
          <>
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
                    <Label htmlFor='name' className='text-center font-bold'>
                      テーマ
                    </Label>
                    <Input id='name' placeholder='テーマを入力' className='col-span-3' />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-center font-bold'>
                      難易度
                    </Label>
                    <div></div>
                    <Select>
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
                    <Label htmlFor='name' className='text-center font-bold'>
                      回答時間
                    </Label>
                    <div></div>
                    <div>
                      <Select>
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
                      <Label htmlFor='name' className='whitespace-nowrap font-bold'>
                        プライベート
                      </Label>
                    </div>
                    <div />
                    <div />
                    <div className='grid place-items-end'>
                      <Switch id='airplane-mode' />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit'>作成</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <h2 className='mb-2 text-xl font-semibold'>公開中の部屋</h2>
            <div className='h-10'></div>
            <ScrollArea className='h-[calc(100vh-220px)] w-full'>
              {[...Array(10)].map((_, i) => (
                <Card key={i} className='mb-4 bg-white shadow-md'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-lg font-bold'>クイズ部屋 {i + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      参加者: {Math.floor(Math.random() * 10) + 1}/10
                    </p>
                    <p className='text-sm text-muted-foreground'>ジャンル: 一般常識</p>
                    <Button className='mt-2 w-full text-white'>参加する</Button>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
