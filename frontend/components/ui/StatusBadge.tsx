import { classNames } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={classNames(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-[0.1em]',
        status === 'Applied' && 'bg-[#d9efe4] text-[#1f6b4c]',
        status === 'Overdue' && 'bg-[#ffe2dd] text-[#a6362f]',
        status === 'Pending' && 'bg-[#fff0ce] text-[#8a5a00]',
        !['Applied', 'Overdue', 'Pending'].includes(status) && 'bg-[#e8eeee] text-[#49605b]'
      )}
    >
      {status}
    </span>
  );
}
