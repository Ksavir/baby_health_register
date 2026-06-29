import { db } from '../db/connection';
import { validateDate, validateRequired, validateVaccineStatus } from '../utils/validation';
import type { Vaccine } from './types';

type VaccineRow = {
  id: number;
  baby_id: number;
  name: string;
  recommended_age: string | null;
  applied_date: string | null;
  next_dose_date: string | null;
  status: string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function mapVaccine(row: VaccineRow): Vaccine {
  return {
    id: row.id,
    babyId: row.baby_id,
    name: row.name,
    recommendedAge: row.recommended_age,
    appliedDate: row.applied_date,
    nextDoseDate: row.next_dose_date,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getVaccines(babyId: number) {
  const rows = db
    .prepare(`
      SELECT * FROM vaccines
      WHERE baby_id = ?
      ORDER BY COALESCE(next_dose_date, applied_date, created_at) ASC
    `)
    .all(babyId) as VaccineRow[];
  return rows.map(mapVaccine);
}

export function getVaccine(id: number) {
  const row = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(id) as VaccineRow | undefined;
  return row ? mapVaccine(row) : null;
}

export function createVaccine(input: {
  babyId: number;
  name: string;
  recommendedAge?: string | null;
  appliedDate?: string | null;
  nextDoseDate?: string | null;
  status?: string | null;
  notes?: string | null;
}) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.name, 'Vaccine name');
  validateDate(input.appliedDate, 'Applied date');
  validateDate(input.nextDoseDate, 'Next dose date');
  validateVaccineStatus(input.status);

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  const result = db
    .prepare(`
      INSERT INTO vaccines (
        baby_id, name, recommended_age, applied_date, next_dose_date, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      input.babyId,
      input.name.trim(),
      input.recommendedAge ?? null,
      input.appliedDate ?? null,
      input.nextDoseDate ?? null,
      input.status ?? 'Pending',
      input.notes ?? null,
    );

  return getVaccine(Number(result.lastInsertRowid));
}

export function updateVaccine(
  id: number,
  input: {
    name?: string | null;
    recommendedAge?: string | null;
    appliedDate?: string | null;
    nextDoseDate?: string | null;
    status?: string | null;
    notes?: string | null;
  },
) {
  const existing = getVaccine(id);
  if (!existing) {
    throw new Error('Vaccine not found');
  }

  const updated = {
    name: input.name ?? existing.name,
    recommendedAge: input.recommendedAge ?? existing.recommendedAge,
    appliedDate: input.appliedDate ?? existing.appliedDate,
    nextDoseDate: input.nextDoseDate ?? existing.nextDoseDate,
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
  };

  validateRequired(updated.name, 'Vaccine name');
  validateDate(updated.appliedDate, 'Applied date');
  validateDate(updated.nextDoseDate, 'Next dose date');
  validateVaccineStatus(updated.status);

  db.prepare(`
    UPDATE vaccines
    SET name = ?, recommended_age = ?, applied_date = ?, next_dose_date = ?,
        status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.name.trim(),
    updated.recommendedAge,
    updated.appliedDate,
    updated.nextDoseDate,
    updated.status,
    updated.notes,
    id,
  );

  return getVaccine(id);
}

export function deleteVaccine(id: number) {
  const result = db.prepare('DELETE FROM vaccines WHERE id = ?').run(id);
  return result.changes > 0;
}
