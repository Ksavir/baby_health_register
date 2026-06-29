import type { User } from '@/types';

const USER_KEY = 'child-health-user';

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('child-health-selected-baby-id');
}
