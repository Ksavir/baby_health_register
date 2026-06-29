import { readFileSync } from 'node:fs';
import path from 'node:path';
import { db } from './connection';

const schemaPath = path.resolve(process.cwd(), 'src', 'db', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

db.exec(schema);

console.log('Database initialized successfully');
