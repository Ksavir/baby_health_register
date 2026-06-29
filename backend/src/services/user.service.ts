import bcrypt from 'bcryptjs';
import { db } from '../db/connection';
import { validateEmail, validateRequired } from '../utils/validation';
import type { User } from './types';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string | null;
  updated_at: string | null;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function registerUser(input: { email: string; password: string }) {
  validateRequired(input.email, 'Email');
  validateRequired(input.password, 'Password');

  const email = input.email.trim().toLowerCase();

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (input.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new Error('Email already exists');
  }

  const passwordHash = bcrypt.hashSync(input.password, 10);
  const result = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(email, passwordHash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as UserRow;
  return mapUser(user);
}

export function login(input: { email: string; password: string }) {
  validateRequired(input.email, 'Email');
  validateRequired(input.password, 'Password');

  const email = input.email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;

  if (!user || !bcrypt.compareSync(input.password, user.password_hash)) {
    throw new Error('Invalid email or password');
  }

  return mapUser(user);
}

export function getUsers() {
  const rows = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as UserRow[];
  return rows.map(mapUser);
}
