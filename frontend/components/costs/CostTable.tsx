import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { Cost } from '@/types';

export function CostTable({ costs }: { costs: Cost[] }) {
  if (costs.length === 0) {
    return <Card className="text-sm font-bold text-[#637a75]">No medical costs recorded yet.</Card>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#d9e4de] bg-white shadow-paper">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-[#f3f8f4] text-xs font-black uppercase tracking-[0.12em] text-[#5f746f]">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#edf1ee]">
          {costs.map((cost) => (
            <tr key={cost.id}>
              <td className="px-4 py-3 font-bold text-[#102f2f]">{formatDate(cost.costDate)}</td>
              <td className="px-4 py-3">{cost.category}</td>
              <td className="px-4 py-3">{cost.description || 'Not set'}</td>
              <td className="px-4 py-3 text-right font-black text-[#102f2f]">${cost.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
