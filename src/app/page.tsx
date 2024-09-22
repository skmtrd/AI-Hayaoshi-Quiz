import { auth } from '@/auth';
import SignIn from '@/components/SignIn';
import SignOut from '@/components/SignOut';
const Home = async () => {
  const session = await auth();

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-y-10 px-4'>
      <div className='flex w-full flex-col'>{!session?.user?.image ? <SignIn /> : <SignOut />}</div>
    </div>
  );
};

export default Home;
