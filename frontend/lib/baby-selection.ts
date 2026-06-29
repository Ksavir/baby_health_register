const BABY_KEY = 'child-health-selected-baby-id';

export function saveSelectedBabyId(babyId: number) {
  localStorage.setItem(BABY_KEY, String(babyId));
}

export function getSelectedBabyId(): number | null {
  if (typeof window === 'undefined') return null;

  const value = localStorage.getItem(BABY_KEY);
  if (!value) return null;

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

export function clearSelectedBabyId() {
  localStorage.removeItem(BABY_KEY);
}
