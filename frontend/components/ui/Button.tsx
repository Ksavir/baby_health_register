import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' && 'bg-[#0f3d3e] text-white shadow-ink hover:-translate-y-0.5 hover:bg-[#0b3031]',
        variant === 'secondary' && 'border border-[#cad7d2] bg-white text-[#173536] hover:bg-[#f4faf7]',
        variant === 'ghost' && 'text-[#315451] hover:bg-[#eaf4ef]',
        variant === 'danger' && 'bg-[#a6362f] text-white hover:bg-[#872821]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
