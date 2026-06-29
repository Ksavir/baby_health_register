import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { Consultation } from '@/types';

export function ConsultationTable({ consultations }: { consultations: Consultation[] }) {
  if (consultations.length === 0) {
    return <Card className="text-sm font-bold text-[#637a75]">No consultations recorded yet.</Card>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#d9e4de] bg-white shadow-paper">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[#f3f8f4] text-xs font-black uppercase tracking-[0.12em] text-[#5f746f]">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Doctor</th>
            <th className="px-4 py-3">Specialty</th>
            <th className="px-4 py-3">Growth</th>
            <th className="px-4 py-3">Diagnosis</th>
            <th className="px-4 py-3">Next</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#edf1ee]">
          {consultations.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="px-4 py-3 font-bold text-[#102f2f]">{formatDate(item.consultationDate)}</td>
              <td className="px-4 py-3">{item.doctorName}</td>
              <td className="px-4 py-3">{item.specialistType || 'General'}</td>
              <td className="px-4 py-3">
                {item.weight ? `${item.weight} kg` : '--'} / {item.height ? `${item.height} cm` : '--'}
              </td>
              <td className="px-4 py-3">{item.diagnosis || 'Not set'}</td>
              <td className="px-4 py-3">{formatDate(item.nextAppointmentDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
