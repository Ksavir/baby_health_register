'use client';

import { useEffect, useState } from 'react';
import { Baby as BabyIcon, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BabySelector } from '@/components/babies/BabySelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createBaby, getBabies, updateBaby } from '@/graphql/babies';
import { getSelectedBabyId, saveSelectedBabyId } from '@/lib/baby-selection';
import { getUser } from '@/lib/auth';
import type { Baby, User } from '@/types';

const emptyForm = {
  name: '',
  birthDate: '',
  gender: '',
  bloodType: '',
  allergies: '',
  pediatricianName: '',
  notes: '',
};

export default function BabiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<number | null>(null);
  const [editingBabyId, setEditingBabyId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadBabies(currentUser: User) {
    setError('');
    setLoading(true);
    try {
      const items = await getBabies(currentUser.id);
      setBabies(items);
      const currentSelected = getSelectedBabyId();
      setSelectedBabyId(currentSelected);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load babies.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      loadBabies(currentUser);
    }
  }, []);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSelect(baby: Baby) {
    saveSelectedBabyId(baby.id);
    setSelectedBabyId(baby.id);
  }

  function handleEdit(baby: Baby) {
    setEditingBabyId(baby.id);
    setForm({
      name: baby.name,
      birthDate: baby.birthDate,
      gender: baby.gender || '',
      bloodType: baby.bloodType || '',
      allergies: baby.allergies || '',
      pediatricianName: baby.pediatricianName || '',
      notes: baby.notes || '',
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    setError('');
    if (!form.name.trim() || !form.birthDate) {
      setError('Name and birth date are required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      birthDate: form.birthDate,
      gender: form.gender || null,
      bloodType: form.bloodType || null,
      allergies: form.allergies || null,
      pediatricianName: form.pediatricianName || null,
      notes: form.notes || null,
    };

    try {
      setSaving(true);
      if (editingBabyId) {
        await updateBaby(editingBabyId, payload);
      } else {
        const created = await createBaby({ ...payload, userId: user.id });
        if (babies.length === 0) {
          saveSelectedBabyId(created.id);
          setSelectedBabyId(created.id);
        }
      }
      setForm(emptyForm);
      setEditingBabyId(null);
      await loadBabies(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save baby.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Profiles"
        title="Babies"
        description="Create, edit and select the active baby profile used by consultations, vaccines and costs."
      />

      {error && <p className="mb-5 rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section>{loading ? <Card>Loading baby profiles...</Card> : <BabySelector babies={babies} selectedBabyId={selectedBabyId} onSelect={handleSelect} onEdit={handleEdit} />}</section>

        <Card>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[#f0b35b] text-[#102f2f]">
              <BabyIcon size={20} />
            </span>
            <h2 className="font-display text-2xl font-black text-[#102f2f]">{editingBabyId ? 'Edit baby' : 'New baby'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Input label="Name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            <Input label="Birth date" type="date" value={form.birthDate} onChange={(event) => updateField('birthDate', event.target.value)} />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              options={[
                { label: 'Not set', value: '' },
                { label: 'Female', value: 'Female' },
                { label: 'Male', value: 'Male' },
                { label: 'Other', value: 'Other' },
              ]}
            />
            <Input label="Blood type" value={form.bloodType} onChange={(event) => updateField('bloodType', event.target.value)} />
            <Input label="Pediatrician" value={form.pediatricianName} onChange={(event) => updateField('pediatricianName', event.target.value)} />
            <Textarea label="Allergies" value={form.allergies} onChange={(event) => updateField('allergies', event.target.value)} />
            <Textarea label="Notes" value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save size={16} />
                {saving ? 'Saving...' : editingBabyId ? 'Update baby' : 'Create baby'}
              </Button>
              {editingBabyId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingBabyId(null); setForm(emptyForm); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
