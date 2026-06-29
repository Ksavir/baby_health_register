import { db } from '../db/connection';
import { validateCostCategory, validateDate, validatePositiveNumber, validateRequired } from '../utils/validation';
import type { Cost } from './types';

type CostRow = {
  id: number;
  baby_id: number;
  cost_date: string;
  category: string;
  description: string | null;
  amount: number;
  created_at: string | null;
  updated_at: string | null;
};

function mapCost(row: CostRow): Cost {
  return {
    id: row.id,
    babyId: row.baby_id,
    costDate: row.cost_date,
    category: row.category,
    description: row.description,
    amount: row.amount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getCosts(babyId: number) {
  const rows = db
    .prepare(`
      SELECT * FROM costs
      WHERE baby_id = ?
      ORDER BY cost_date DESC, created_at DESC
    `)
    .all(babyId) as CostRow[];
  return rows.map(mapCost);
}

export function getCost(id: number) {
  const row = db.prepare('SELECT * FROM costs WHERE id = ?').get(id) as CostRow | undefined;
  return row ? mapCost(row) : null;
}

export function createCost(input: {
  babyId: number;
  costDate: string;
  category: string;
  description?: string | null;
  amount: number;
}) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.costDate, 'Cost date');
  validateRequired(input.category, 'Category');
  validateRequired(input.amount, 'Amount');
  validateDate(input.costDate, 'Cost date');
  validateCostCategory(input.category);
  validatePositiveNumber(input.amount, 'Amount');

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  const result = db
    .prepare('INSERT INTO costs (baby_id, cost_date, category, description, amount) VALUES (?, ?, ?, ?, ?)')
    .run(input.babyId, input.costDate, input.category, input.description ?? null, input.amount);

  return getCost(Number(result.lastInsertRowid));
}

export function updateCost(
  id: number,
  input: {
    costDate?: string | null;
    category?: string | null;
    description?: string | null;
    amount?: number | null;
  },
) {
  const existing = getCost(id);
  if (!existing) {
    throw new Error('Cost not found');
  }

  const updated = {
    costDate: input.costDate ?? existing.costDate,
    category: input.category ?? existing.category,
    description: input.description ?? existing.description,
    amount: input.amount ?? existing.amount,
  };

  validateRequired(updated.costDate, 'Cost date');
  validateRequired(updated.category, 'Category');
  validateRequired(updated.amount, 'Amount');
  validateDate(updated.costDate, 'Cost date');
  validateCostCategory(updated.category);
  validatePositiveNumber(updated.amount, 'Amount');

  db.prepare(`
    UPDATE costs
    SET cost_date = ?, category = ?, description = ?, amount = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(updated.costDate, updated.category, updated.description, updated.amount, id);

  return getCost(id);
}

export function deleteCost(id: number) {
  const result = db.prepare('DELETE FROM costs WHERE id = ?').run(id);
  return result.changes > 0;
}
