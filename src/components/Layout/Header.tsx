import Link from 'next/link';

export const Header = () => (
  <header className='sticky top-0 z-50 border-b backdrop-blur-md'>
    <div className='mx-auto flex max-w-max items-center justify-between gap-y-4 px-6 py-4 text-2xl font-bold'>
      <Link href='/' className=''>
        AI早押しバトル
      </Link>
      <Link href='/stats' className=''></Link>
    </div>
  </header>
);
