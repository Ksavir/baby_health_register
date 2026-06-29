'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConsultationTable } from '@/components/consultations/ConsultationTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Textarea } from '@/components/ui/Textarea';
import { createConsultation, getConsultations } from '@/graphql/consultations';
import { getSelectedBabyId } from '@/lib/baby-selection';
import { toOptionalNumber } from '@/lib/utils';
import type { Consultation } from '@/types';

const emptyForm = {
  consultationDate: '',
  doctorName: '',
  specialistType: '',
  weight: '',
  height: '',
  diagnosis: '',
  notes: '',
  medicinePrescribed: '',
  nextAppointmentDate: '',
};

export default function ConsultationsPage() {
  const [babyId, setBabyId] = useState<number | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadItems(id: number) {
    try {
      setError('');
      setLoading(true);
      setConsultations(await getConsultations(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load consultations.');
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

    const weight = toOptionalNumber(form.weight);
    const height = toOptionalNumber(form.height);
    if (!form.consultationDate || !form.doctorName.trim()) {
      setError('Consultation date and doctor name are required.');
      return;
    }
    if ((form.weight && (!weight || weight <= 0)) || (form.height && (!height || height <= 0))) {
      setError('Weight and height must be positive numbers.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createConsultation({
        babyId,
        consultationDate: form.consultationDate,
        doctorName: form.doctorName.trim(),
        specialistType: form.specialistType || null,
        weight,
        height,
        diagnosis: form.diagnosis || null,
        notes: form.notes || null,
        medicinePrescribed: form.medicinePrescribed || null,
        nextAppointmentDate: form.nextAppointmentDate || null,
      });
      setForm(emptyForm);
      await loadItems(babyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save consultation.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="Medical visits" title="Consultations" description="Register doctor visits and growth notes for the selected baby." />
      {!babyId && <NeedBabyCard />}
      {error && <p className="mb-5 rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

      {babyId && (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card>
            <h2 className="mb-5 font-display text-2xl font-black text-[#102f2f]">New consultation</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input label="Consultation date" type="date" value={form.consultationDate} onChange={(event) => updateField('consultationDate', event.target.value)} />
              <Input label="Doctor name" value={form.doctorName} onChange={(event) => updateField('doctorName', event.target.value)} />
              <Input label="Specialist type" value={form.specialistType} onChange={(event) => updateField('specialistType', event.target.value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Weight kg" type="number" step="0.01" value={form.weight} onChange={(event) => updateField('weight', event.target.value)} />
                <Input label="Height cm" type="number" step="0.01" value={form.height} onChange={(event) => updateField('height', event.target.value)} />
              </div>
              <Textarea label="Diagnosis" value={form.diagnosis} onChange={(event) => updateField('diagnosis', event.target.value)} />
              <Textarea label="Medicine" value={form.medicinePrescribed} onChange={(event) => updateField('medicinePrescribed', event.target.value)} />
              <Input label="Next appointment" type="date" value={form.nextAppointmentDate} onChange={(event) => updateField('nextAppointmentDate', event.target.value)} />
              <Textarea label="Notes" value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
              <Button type="submit" disabled={saving}>
                <Plus size={16} />
                {saving ? 'Saving...' : 'Add consultation'}
              </Button>
            </form>
          </Card>
          <section className="overflow-x-auto">{loading ? <Card>Loading consultations...</Card> : <ConsultationTable consultations={consultations} />}</section>
        </div>
      )}
    </AppLayout>
  );
}

function NeedBabyCard() {
  return (
    <Card className="max-w-2xl">
      <h2 className="font-display text-3xl font-black text-[#102f2f]">Select a baby first</h2>
      <p className="mt-2 text-sm text-[#637a75]">Consultations need a selected baby profile.</p>
      <Link href="/babies" className="mt-5 inline-block">
        <Button type="button">Go to Babies</Button>
      </Link>
    </Card>
  );
}
