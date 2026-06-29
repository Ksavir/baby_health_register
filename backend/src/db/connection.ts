import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { Database } from 'bun:sqlite';

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

const dbPath = path.resolve(dataDir, 'child-health.sqlite');

export const db = new Database(dbPath);
db.exec('PRAGMA foreign_keys = ON');
