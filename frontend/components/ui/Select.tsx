import type { SelectHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Array<{ label: string; value: string }>;
};

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#55706b]">{label}</span>
      <select
        className={classNames(
          'h-11 w-full rounded-md border border-[#cbd8d1] bg-white px-3 text-sm text-[#142f2f] outline-none transition focus:border-[#0f3d3e] focus:ring-4 focus:ring-[#b9ddd0]/45',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
