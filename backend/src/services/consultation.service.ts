import { db } from '../db/connection';
import { validateDate, validatePositiveNumber, validateRequired } from '../utils/validation';
import type { Consultation } from './types';

type ConsultationRow = {
  id: number;
  baby_id: number;
  consultation_date: string;
  doctor_name: string;
  specialist_type: string | null;
  weight: number | null;
  height: number | null;
  diagnosis: string | null;
  notes: string | null;
  medicine_prescribed: string | null;
  next_appointment_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function mapConsultation(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    babyId: row.baby_id,
    consultationDate: row.consultation_date,
    doctorName: row.doctor_name,
    specialistType: row.specialist_type,
    weight: row.weight,
    height: row.height,
    diagnosis: row.diagnosis,
    notes: row.notes,
    medicinePrescribed: row.medicine_prescribed,
    nextAppointmentDate: row.next_appointment_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getConsultations(babyId: number) {
  const rows = db
    .prepare(`
      SELECT * FROM consultations
      WHERE baby_id = ?
      ORDER BY consultation_date DESC, created_at DESC
    `)
    .all(babyId) as ConsultationRow[];
  return rows.map(mapConsultation);
}

export function getConsultation(id: number) {
  const row = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as ConsultationRow | undefined;
  return row ? mapConsultation(row) : null;
}

export function createConsultation(input: {
  babyId: number;
  consultationDate: string;
  doctorName: string;
  specialistType?: string | null;
  weight?: number | null;
  height?: number | null;
  diagnosis?: string | null;
  notes?: string | null;
  medicinePrescribed?: string | null;
  nextAppointmentDate?: string | null;
}) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.consultationDate, 'Consultation date');
  validateRequired(input.doctorName, 'Doctor name');
  validateDate(input.consultationDate, 'Consultation date');
  validateDate(input.nextAppointmentDate, 'Next appointment date');
  validatePositiveNumber(input.weight, 'Weight');
  validatePositiveNumber(input.height, 'Height');

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  const result = db
    .prepare(`
      INSERT INTO consultations (
        baby_id, consultation_date, doctor_name, specialist_type, weight, height,
        diagnosis, notes, medicine_prescribed, next_appointment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      input.babyId,
      input.consultationDate,
      input.doctorName.trim(),
      input.specialistType ?? null,
      input.weight ?? null,
      input.height ?? null,
      input.diagnosis ?? null,
      input.notes ?? null,
      input.medicinePrescribed ?? null,
      input.nextAppointmentDate ?? null,
    );

  return getConsultation(Number(result.lastInsertRowid));
}

export function updateConsultation(
  id: number,
  input: {
    consultationDate?: string | null;
    doctorName?: string | null;
    specialistType?: string | null;
    weight?: number | null;
    height?: number | null;
    diagnosis?: string | null;
    notes?: string | null;
    medicinePrescribed?: string | null;
    nextAppointmentDate?: string | null;
  },
) {
  const existing = getConsultation(id);
  if (!existing) {
    throw new Error('Consultation not found');
  }

  const updated = {
    consultationDate: input.consultationDate ?? existing.consultationDate,
    doctorName: input.doctorName ?? existing.doctorName,
    specialistType: input.specialistType ?? existing.specialistType,
    weight: input.weight ?? existing.weight,
    height: input.height ?? existing.height,
    diagnosis: input.diagnosis ?? existing.diagnosis,
    notes: input.notes ?? existing.notes,
    medicinePrescribed: input.medicinePrescribed ?? existing.medicinePrescribed,
    nextAppointmentDate: input.nextAppointmentDate ?? existing.nextAppointmentDate,
  };

  validateRequired(updated.consultationDate, 'Consultation date');
  validateRequired(updated.doctorName, 'Doctor name');
  validateDate(updated.consultationDate, 'Consultation date');
  validateDate(updated.nextAppointmentDate, 'Next appointment date');
  validatePositiveNumber(updated.weight, 'Weight');
  validatePositiveNumber(updated.height, 'Height');

  db.prepare(`
    UPDATE consultations
    SET consultation_date = ?, doctor_name = ?, specialist_type = ?, weight = ?, height = ?,
        diagnosis = ?, notes = ?, medicine_prescribed = ?, next_appointment_date = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.consultationDate,
    updated.doctorName.trim(),
    updated.specialistType,
    updated.weight,
    updated.height,
    updated.diagnosis,
    updated.notes,
    updated.medicinePrescribed,
    updated.nextAppointmentDate,
    id,
  );

  return getConsultation(id);
}

export function deleteConsultation(id: number) {
  const result = db.prepare('DELETE FROM consultations WHERE id = ?').run(id);
  return result.changes > 0;
}
