'use client';

import { CheckCircle2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAgeLabel } from '@/lib/utils';
import type { Baby } from '@/types';

type BabySelectorProps = {
  babies: Baby[];
  selectedBabyId: number | null;
  onSelect: (baby: Baby) => void;
  onEdit: (baby: Baby) => void;
};

export function BabySelector({ babies, selectedBabyId, onSelect, onEdit }: BabySelectorProps) {
  if (babies.length === 0) {
    return <Card className="text-sm font-bold text-[#637a75]">No baby profiles yet. Create one to start tracking records.</Card>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {babies.map((baby) => {
        const active = selectedBabyId === baby.id;
        return (
          <Card key={baby.id} className={active ? 'border-[#0f3d3e] ring-4 ring-[#b9ddd0]/40' : ''}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-black text-[#102f2f]">{baby.name}</p>
                <p className="mt-1 text-sm font-bold text-[#657a75]">{getAgeLabel(baby.birthDate)}</p>
              </div>
              {active && <CheckCircle2 className="text-[#1f6b4c]" size={22} />}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-black uppercase tracking-[0.12em] text-[#7a8c87]">Blood</dt>
                <dd className="mt-1 font-bold text-[#102f2f]">{baby.bloodType || 'Not set'}</dd>
              </div>
              <div>
                <dt className="font-black uppercase tracking-[0.12em] text-[#7a8c87]">Doctor</dt>
                <dd className="mt-1 font-bold text-[#102f2f]">{baby.pediatricianName || 'Not set'}</dd>
              </div>
            </dl>
            <div className="mt-5 flex gap-2">
              <Button type="button" variant={active ? 'secondary' : 'primary'} onClick={() => onSelect(baby)}>
                {active ? 'Selected' : 'Select'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => onEdit(baby)}>
                <Pencil size={16} />
                Edit
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
