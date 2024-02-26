'use client';

import { useToast } from '@/components/ui/use-toast';

interface Props {
  text: string;
  filename: string;
}

export const CopyCodeButton = (props: Props) => {
  const { toast } = useToast();
  return (
    <div>
      <label className='hidden'>Copy Code</label>
      <button
        aria-labelledby='copy-code-button'
        onClick={async () => {
          try {
            await copyToClipboard(props.text);

            toast({
              title: `Copied ${props.filename}`,
            });
          } catch (error) {
            toast({
              variant: 'destructive',
              title: 'Error copying code.',
              description:
                'Try manually copying instead. This is usually a permissions issue.',
            });
          }
        }}
        aria-label='Copy code'
        className='h-8 w-8 rounded-sm border-none text-zinc border-zinc-700 cursor-pointer p-0 flex items-center justify-center bg-inherit relative hover:bg-zinc-900 hover:text-zinc-200'
      >
        <svg
          className='absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4'
          data-testid='geist-icon'
          fill='none'
          height='24'
          shapeRendering='geometricPrecision'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          width='24'
          aria-hidden='true'
          style={{ color: 'currentcolor', width: 20, height: 20 }}
        >
          <path d='M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z'></path>
        </svg>
      </button>
    </div>
  );
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text successfully copied');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
