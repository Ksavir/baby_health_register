export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

export function validatePositiveNumber(value: number | null | undefined, fieldName: string) {
  if (value !== undefined && value !== null && value <= 0) {
    throw new Error(`${fieldName} must be greater than 0`);
  }
}

export function validateDate(value: string | null | undefined, fieldName: string) {
  if (!value) return;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${fieldName} must use YYYY-MM-DD format`);
  }
}

export function validateVaccineStatus(status?: string | null) {
  if (!status) return;

  const allowed = ['Pending', 'Applied', 'Overdue'];
  if (!allowed.includes(status)) {
    throw new Error('Invalid vaccine status');
  }
}

export function validateCostCategory(category: string) {
  const allowed = ['Consultation', 'Medicine', 'Vaccine', 'Test', 'Other'];
  if (!allowed.includes(category)) {
    throw new Error('Invalid cost category');
  }
}
