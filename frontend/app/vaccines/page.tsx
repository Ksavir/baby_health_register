'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VaccineTable } from '@/components/vaccines/VaccineTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createVaccine, getVaccines } from '@/graphql/vaccines';
import { getSelectedBabyId } from '@/lib/baby-selection';
import type { Vaccine } from '@/types';

const emptyForm = {
  name: '',
  recommendedAge: '',
  appliedDate: '',
  nextDoseDate: '',
  status: 'Pending' as Vaccine['status'],
  notes: '',
};

export default function VaccinesPage() {
  const [babyId, setBabyId] = useState<number | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadItems(id: number) {
    try {
      setError('');
      setLoading(true);
      setVaccines(await getVaccines(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load vaccines.');
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
    if (!form.name.trim() || !form.status) {
      setError('Name and status are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createVaccine({
        babyId,
        name: form.name.trim(),
        recommendedAge: form.recommendedAge || null,
        appliedDate: form.appliedDate || null,
        nextDoseDate: form.nextDoseDate || null,
        status: form.status,
        notes: form.notes || null,
      });
      setForm(emptyForm);
      await loadItems(babyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save vaccine.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="Immunization" title="Vaccines" description="Track pending, applied and overdue vaccine records for the selected baby." />
      {!babyId && <NeedBabyCard />}
      {error && <p className="mb-5 rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

      {babyId && (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card>
            <h2 className="mb-5 font-display text-2xl font-black text-[#102f2f]">New vaccine</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input label="Name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              <Input label="Recommended age" value={form.recommendedAge} onChange={(event) => updateField('recommendedAge', event.target.value)} />
              <Input label="Applied date" type="date" value={form.appliedDate} onChange={(event) => updateField('appliedDate', event.target.value)} />
              <Input label="Next dose date" type="date" value={form.nextDoseDate} onChange={(event) => updateField('nextDoseDate', event.target.value)} />
              <Select
                label="Status"
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Applied', value: 'Applied' },
                  { label: 'Overdue', value: 'Overdue' },
                ]}
              />
              <Textarea label="Notes" value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
              <Button type="submit" disabled={saving}>
                <Plus size={16} />
                {saving ? 'Saving...' : 'Add vaccine'}
              </Button>
            </form>
          </Card>
          <section>{loading ? <Card>Loading vaccines...</Card> : <VaccineTable vaccines={vaccines} />}</section>
        </div>
      )}
    </AppLayout>
  );
}

function NeedBabyCard() {
  return (
    <Card className="max-w-2xl">
      <h2 className="font-display text-3xl font-black text-[#102f2f]">Select a baby first</h2>
      <p className="mt-2 text-sm text-[#637a75]">Vaccines need a selected baby profile.</p>
      <Link href="/babies" className="mt-5 inline-block">
        <Button type="button">Go to Babies</Button>
      </Link>
    </Card>
  );
}
