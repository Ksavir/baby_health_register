import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, eyebrow, description, action }: PageHeaderProps) {
  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-[#d9e4de] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#c56545]">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-black text-[#102f2f] md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#57716d]">{description}</p>}
      </div>
      {action}
    </header>
  );
}
