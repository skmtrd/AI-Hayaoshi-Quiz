import { signOut } from '@/auth';

const SignOut = () => {
  return (
    <form
      className='grid place-items-center rounded-xl p-3 ring-1 ring-slate-400'
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type='submit'>SignOut</button>
    </form>
  );
};

export default SignOut;
