import type { HTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames(
        'rounded-lg border border-[#dbe3de] bg-white/90 p-5 shadow-paper backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
