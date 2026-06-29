import { db } from '../db/connection';
import { validateDate, validateRequired } from '../utils/validation';
import type { Baby, DashboardSummary } from './types';

type BabyRow = {
  id: number;
  user_id: number;
  name: string;
  birth_date: string;
  gender: string | null;
  blood_type: string | null;
  allergies: string | null;
  pediatrician_name: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CountRow = { count: number };
type TotalRow = { total: number };

function mapBaby(row: BabyRow): Baby {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    birthDate: row.birth_date,
    gender: row.gender,
    bloodType: row.blood_type,
    allergies: row.allergies,
    pediatricianName: row.pediatrician_name,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getBabies(userId: number) {
  const rows = db
    .prepare('SELECT * FROM babies WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as BabyRow[];
  return rows.map(mapBaby);
}

export function getBaby(id: number) {
  const row = db.prepare('SELECT * FROM babies WHERE id = ?').get(id) as BabyRow | undefined;
  return row ? mapBaby(row) : null;
}

export function createBaby(input: {
  userId: number;
  name: string;
  birthDate: string;
  gender?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  pediatricianName?: string | null;
  notes?: string | null;
}) {
  validateRequired(input.userId, 'User ID');
  validateRequired(input.name, 'Baby name');
  validateRequired(input.birthDate, 'Birth date');
  validateDate(input.birthDate, 'Birth date');

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = db
    .prepare(`
      INSERT INTO babies (
        user_id, name, birth_date, gender, blood_type, allergies, pediatrician_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      input.userId,
      input.name.trim(),
      input.birthDate,
      input.gender ?? null,
      input.bloodType ?? null,
      input.allergies ?? null,
      input.pediatricianName ?? null,
      input.notes ?? null,
    );

  return getBaby(Number(result.lastInsertRowid));
}

export function updateBaby(
  id: number,
  input: {
    name?: string | null;
    birthDate?: string | null;
    gender?: string | null;
    bloodType?: string | null;
    allergies?: string | null;
    pediatricianName?: string | null;
    notes?: string | null;
  },
) {
  const existing = getBaby(id);
  if (!existing) {
    throw new Error('Baby not found');
  }

  const updated = {
    name: input.name ?? existing.name,
    birthDate: input.birthDate ?? existing.birthDate,
    gender: input.gender ?? existing.gender,
    bloodType: input.bloodType ?? existing.bloodType,
    allergies: input.allergies ?? existing.allergies,
    pediatricianName: input.pediatricianName ?? existing.pediatricianName,
    notes: input.notes ?? existing.notes,
  };

  validateRequired(updated.name, 'Baby name');
  validateRequired(updated.birthDate, 'Birth date');
  validateDate(updated.birthDate, 'Birth date');

  db.prepare(`
    UPDATE babies
    SET name = ?, birth_date = ?, gender = ?, blood_type = ?, allergies = ?,
        pediatrician_name = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.name.trim(),
    updated.birthDate,
    updated.gender,
    updated.bloodType,
    updated.allergies,
    updated.pediatricianName,
    updated.notes,
    id,
  );

  return getBaby(id);
}

export function deleteBaby(id: number) {
  const result = db.prepare('DELETE FROM babies WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getDashboardSummary(babyId: number): DashboardSummary {
  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  const consultationsCount = db
    .prepare('SELECT COUNT(*) as count FROM consultations WHERE baby_id = ?')
    .get(babyId) as CountRow;
  const vaccinesCount = db
    .prepare('SELECT COUNT(*) as count FROM vaccines WHERE baby_id = ?')
    .get(babyId) as CountRow;
  const pendingVaccinesCount = db
    .prepare(`
      SELECT COUNT(*) as count
      FROM vaccines
      WHERE baby_id = ? AND status IN ('Pending', 'Overdue')
    `)
    .get(babyId) as CountRow;
  const totalCosts = db
    .prepare('SELECT COALESCE(SUM(amount), 0) as total FROM costs WHERE baby_id = ?')
    .get(babyId) as TotalRow;
  const nextVaccine = db
    .prepare(`
      SELECT name, next_dose_date
      FROM vaccines
      WHERE baby_id = ? AND next_dose_date IS NOT NULL AND status != 'Applied'
      ORDER BY next_dose_date ASC
      LIMIT 1
    `)
    .get(babyId) as { name: string; next_dose_date: string } | undefined;
  const lastConsultation = db
    .prepare(`
      SELECT consultation_date
      FROM consultations
      WHERE baby_id = ?
      ORDER BY consultation_date DESC
      LIMIT 1
    `)
    .get(babyId) as { consultation_date: string } | undefined;

  return {
    babyId,
    consultationsCount: consultationsCount.count,
    vaccinesCount: vaccinesCount.count,
    pendingVaccinesCount: pendingVaccinesCount.count,
    totalCosts: totalCosts.total,
    nextVaccineName: nextVaccine?.name ?? null,
    nextVaccineDate: nextVaccine?.next_dose_date ?? null,
    lastConsultationDate: lastConsultation?.consultation_date ?? null,
  };
}
