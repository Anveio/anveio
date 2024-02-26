import * as React from 'react';

import { Merriweather } from 'next/font/google';
import { cn } from '@/lib/utils';

const merriweather = Merriweather({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export default function BlogLayout(props: React.PropsWithChildren<object>) {
  return (
    <div className={cn(merriweather.className)}>
      <div className='max-w-4xl m-auto'>
        <div className='py-4'></div>
        {props.children}
      </div>
    </div>
  );
}
