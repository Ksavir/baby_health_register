import type { TextareaHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#55706b]">{label}</span>
      <textarea
        className={classNames(
          'min-h-24 w-full rounded-md border border-[#cbd8d1] bg-white px-3 py-3 text-sm text-[#142f2f] outline-none transition placeholder:text-[#9aaaa4] focus:border-[#0f3d3e] focus:ring-4 focus:ring-[#b9ddd0]/45',
          className
        )}
        {...props}
      />
    </label>
  );
}
