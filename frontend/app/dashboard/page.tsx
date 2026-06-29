'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Baby as BabyIcon, CalendarClock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { getBaby, getDashboardSummary } from '@/graphql/babies';
import { getSelectedBabyId } from '@/lib/baby-selection';
import { formatDate, getAgeLabel } from '@/lib/utils';
import type { Baby, DashboardSummary } from '@/types';

export default function DashboardPage() {
  const [baby, setBaby] = useState<Baby | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsBaby, setNeedsBaby] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const babyId = getSelectedBabyId();
      if (!babyId) {
        setNeedsBaby(true);
        setLoading(false);
        return;
      }

      try {
        const [babyData, summaryData] = await Promise.all([getBaby(babyId), getDashboardSummary(babyId)]);
        setBaby(babyData);
        setSummary(summaryData);
        if (!babyData) setNeedsBaby(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Live overview"
        title="Dashboard"
        description="A real summary calculated from the selected baby profile and records persisted by the backend."
        action={
          <Link href="/babies">
            <Button type="button" variant="secondary">
              Manage babies
              <ArrowRight size={16} />
            </Button>
          </Link>
        }
      />

      {loading && <Card>Loading dashboard...</Card>}
      {error && <p className="rounded-md bg-[#fff1ee] px-3 py-2 text-sm font-bold text-[#a6362f]">{error}</p>}

      {!loading && needsBaby && (
        <Card className="max-w-2xl">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-[#f0b35b] text-[#102f2f]">
              <BabyIcon size={24} />
            </span>
            <div>
              <h2 className="font-display text-3xl font-black text-[#102f2f]">No active baby selected</h2>
              <p className="mt-2 text-sm leading-6 text-[#637a75]">
                Create or select a baby profile to start tracking health records.
              </p>
              <Link href="/babies" className="mt-5 inline-block">
                <Button type="button">Go to Babies</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {!loading && baby && summary && (
        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c56545]">Active baby</p>
                <h2 className="mt-2 font-display text-5xl font-black text-[#102f2f]">{baby.name}</h2>
                <p className="mt-2 text-lg font-bold text-[#53706b]">{getAgeLabel(baby.birthDate)}</p>
              </div>
              <div className="grid gap-3 rounded-lg bg-[#f5faf6] p-4 text-sm">
                <p>
                  <span className="font-black text-[#102f2f]">Birth date:</span> {formatDate(baby.birthDate)}
                </p>
                <p>
                  <span className="font-black text-[#102f2f]">Blood type:</span> {baby.bloodType || 'Not set'}
                </p>
                <p>
                  <span className="font-black text-[#102f2f]">Pediatrician:</span> {baby.pediatricianName || 'Not set'}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Consultations" value={summary.consultationsCount} note="Total visits recorded" />
            <SummaryCard label="Vaccines" value={summary.vaccinesCount} note={`${summary.pendingVaccinesCount} pending`} />
            <SummaryCard label="Total costs" value={`$${summary.totalCosts.toFixed(2)}`} note="Medical spending" />
            <SummaryCard label="Last consult" value={<CalendarClock size={31} />} note={formatDate(summary.lastConsultationDate)} />
          </div>

          <Card>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c56545]">Next vaccine</p>
            <p className="mt-3 font-display text-3xl font-black text-[#102f2f]">{summary.nextVaccineName || 'No upcoming vaccine'}</p>
            <p className="mt-2 text-sm font-bold text-[#637a75]">{formatDate(summary.nextVaccineDate)}</p>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
