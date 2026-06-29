import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import type { Vaccine } from '@/types';

function visualStatus(vaccine: Vaccine) {
  if (vaccine.status !== 'Applied' && vaccine.nextDoseDate) {
    const next = new Date(`${vaccine.nextDoseDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (next < today) return 'Overdue';
  }
  return vaccine.status;
}

export function VaccineTable({ vaccines }: { vaccines: Vaccine[] }) {
  if (vaccines.length === 0) {
    return <Card className="text-sm font-bold text-[#637a75]">No vaccines recorded yet.</Card>;
  }

  return (
    <div className="grid gap-3">
      {vaccines.map((vaccine) => (
        <Card key={vaccine.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-2xl font-black text-[#102f2f]">{vaccine.name}</h3>
              <StatusBadge status={visualStatus(vaccine)} />
            </div>
            <p className="mt-2 text-sm font-bold text-[#637a75]">Recommended age: {vaccine.recommendedAge || 'Not set'}</p>
            {vaccine.notes && <p className="mt-2 text-sm text-[#637a75]">{vaccine.notes}</p>}
          </div>
          <div className="grid gap-1 text-sm">
            <p>
              <span className="font-black text-[#102f2f]">Applied:</span> {formatDate(vaccine.appliedDate)}
            </p>
            <p>
              <span className="font-black text-[#102f2f]">Next dose:</span> {formatDate(vaccine.nextDoseDate)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
