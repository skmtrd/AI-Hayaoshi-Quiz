import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const leaveRoom = async (roomId: string) => {
  const res = await fetch(`/api/room/${roomId}/leave`, {
    method: 'PUT',
  });
  return res.json();
};

const LeaveRoomButton = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const handleLeaveRoom = async () => {
    const res = await leaveRoom(roomId);
    if (res.message === 'success leave') {
      router.push('/room');
    } else if (res.message === 'room is deleted') {
      router.push('/room');
    } else if (res.message === 'you not joined') {
      router.push('/room');
    } else if (res.message === 'room not exits') {
      router.push('/room');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <LogOut className='size-5' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に部屋を退室しますか？</AlertDialogTitle>
          {/* <AlertDialogDescription>
            
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveRoom}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveRoomButton;
