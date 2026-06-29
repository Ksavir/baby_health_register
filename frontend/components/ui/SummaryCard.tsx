import type { ReactNode } from 'react';
import { Card } from './Card';

type SummaryCardProps = {
  label: string;
  value: ReactNode;
  note?: string;
};

export function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-2 bg-[#f0b35b]" />
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6c817b]">{label}</p>
      <div className="mt-3 font-display text-3xl font-black text-[#102f2f]">{value}</div>
      {note && <p className="mt-2 text-sm text-[#647a75]">{note}</p>}
    </Card>
  );
}
