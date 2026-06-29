'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CostTable } from '@/components/costs/CostTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { Textarea } from '@/components/ui/Textarea';
import { createCost, getCosts } from '@/graphql/costs';
import { getSelectedBabyId } from '@/lib/baby-selection';
import type { Cost } from '@/types';

const emptyForm = {
  costDate: '',
  category: 'Consultation' as Cost['category'],
  description: '',
  amount: '',
};

export default function CostsPage() {
  const [babyId, setBabyId] = useState<number | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const total = useMemo(() => costs.reduce((sum, cost) => sum + cost.amount, 0), [costs]);

  async function loadItems(id: number) {
    try {
      setError('');
      setLoading(true);
      setCosts(await getCosts(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load costs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const selected = getSelectedBabyId();
    setBabyId(selected);
    if (selected) loadItems(selected);
    else setLoading(false);
  }, []);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!babyId) return;

    const amount = Number(form.amount);
    if (!form.costDate || !form.category || !amount || amount <= 0) {
      setError('Cost date, category and a positive amount are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createCost({
        babyId,
        costDate: form.costDate,
        category: form.category,
        description: form.description || null,
        amount,
      });
      setForm(emptyForm);
      await loadItems(babyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save cost.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="Medical spending" title="Costs" description="Record medical expenses and calculate the selected baby's total spend." />
      {!babyId && <NeedBabyCard />}
      {error && <p className="mb-5 rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

      {babyId && (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="grid gap-4">
            <SummaryCard label="Current total" value={`$${total.toFixed(2)}`} note={`${costs.length} costs recorded`} />
            <Card>
              <h2 className="mb-5 font-display text-2xl font-black text-[#102f2f]">New cost</h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <Input label="Cost date" type="date" value={form.costDate} onChange={(event) => updateField('costDate', event.target.value)} />
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  options={[
                    { label: 'Consultation', value: 'Consultation' },
                    { label: 'Medicine', value: 'Medicine' },
                    { label: 'Vaccine', value: 'Vaccine' },
                    { label: 'Test', value: 'Test' },
                    { label: 'Other', value: 'Other' },
                  ]}
                />
                <Textarea label="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
                <Input label="Amount" type="number" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} />
                <Button type="submit" disabled={saving}>
                  <Plus size={16} />
                  {saving ? 'Saving...' : 'Add cost'}
                </Button>
              </form>
            </Card>
          </div>
          <section className="overflow-x-auto">{loading ? <Card>Loading costs...</Card> : <CostTable costs={costs} />}</section>
        </div>
      )}
    </AppLayout>
  );
}

function NeedBabyCard() {
  return (
    <Card className="max-w-2xl">
      <h2 className="font-display text-3xl font-black text-[#102f2f]">Select a baby first</h2>
      <p className="mt-2 text-sm text-[#637a75]">Costs need a selected baby profile.</p>
      <Link href="/babies" className="mt-5 inline-block">
        <Button type="button">Go to Babies</Button>
      </Link>
    </Card>
  );
}
