# PLANNING_BACK.md

# Child Health Record — Backend MVP funcional conectado al frontend

## Objetivo

Construir un backend simple, funcional y demostrable para **Child Health Record** usando:

```txt
Bun
TypeScript
GraphQL
SQLite
SQL directo
Docker
```

Este backend debe servir datos reales al frontend. No debe depender de datos falsos ni usuarios hardcodeados.

Debe permitir:

- Registrar usuarios.
- Validar login contra base de datos.
- Evitar emails duplicados.
- Crear varios bebés por usuario.
- Listar bebés de un usuario.
- Consultar bebé por ID.
- Editar información del bebé.
- Eliminar bebé.
- Crear, listar, editar y eliminar consultas médicas.
- Crear, listar, editar y eliminar vacunas.
- Crear, listar, editar y eliminar costos médicos.
- Calcular resumen real para dashboard.

El objetivo es que puedas demostrar en entrevista:

```txt
Frontend → GraphQL API → SQLite → respuesta real al frontend
```

---

## Enfoque realista para entrevista

Este backend será un **modular monolith simple**.

No usar microservicios reales todavía. No usar RabbitMQ real todavía. El proyecto debe ser funcional para mañana.

Explicación para entrevista:

```txt
For this MVP I built a modular monolith using Bun, TypeScript, GraphQL and SQLite. I kept the architecture simple because the app is small, but I separated the logic by domain: users, babies, consultations, vaccines and costs.
```

---

## Importante sobre producción

Este backend es funcional, pero para producción real faltan mejoras de seguridad.

Para entrevista, decir:

```txt
The backend is functional and persists real data. For a production version I would improve authentication using JWT or secure cookies, add stronger password hashing, authorization middleware, tests and deployment security.
```

Para el MVP sí se debe implementar al menos:

```txt
- Registro real de usuarios.
- Login real contra SQLite.
- Validación de email duplicado.
- Password guardada con hash simple.
```

---

## Endpoint principal

```txt
http://localhost:4000/graphql
```

---

## Dependencias recomendadas

```bash
bun add graphql graphql-yoga better-sqlite3 cors bcryptjs
bun add -d typescript @types/better-sqlite3 @types/bcryptjs
```

Motivo:

- `graphql-yoga`: servidor GraphQL sencillo.
- `better-sqlite3`: SQLite simple y rápido.
- `cors`: permitir conexión desde Next.js.
- `bcryptjs`: hash básico de passwords.
- `typescript`: tipado.

---

## Scripts recomendados

`package.json`:

```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "db:init": "bun src/db/init.ts",
    "db:seed": "bun src/db/seed.ts"
  }
}
```

---

## Estructura de carpetas

```txt
backend/
│
├── src/
│   ├── db/
│   │   ├── connection.ts
│   │   ├── schema.sql
│   │   ├── init.ts
│   │   └── seed.ts
│   │
│   ├── graphql/
│   │   ├── typeDefs.ts
│   │   └── resolvers.ts
│   │
│   ├── services/
│   │   ├── user.service.ts
│   │   ├── baby.service.ts
│   │   ├── consultation.service.ts
│   │   ├── vaccine.service.ts
│   │   └── cost.service.ts
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   └── date.ts
│   │
│   └── index.ts
│
├── data/
│   └── child-health.sqlite
│
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

---

# Base de datos SQLite

## `src/db/schema.sql`

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS babies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  gender TEXT,
  blood_type TEXT,
  allergies TEXT,
  pediatrician_name TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  baby_id INTEGER NOT NULL,
  consultation_date TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialist_type TEXT,
  weight REAL,
  height REAL,
  diagnosis TEXT,
  notes TEXT,
  medicine_prescribed TEXT,
  next_appointment_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vaccines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  baby_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  recommended_age TEXT,
  applied_date TEXT,
  next_dose_date TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS costs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  baby_id INTEGER NOT NULL,
  cost_date TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);
```

Reglas:

```txt
- Un usuario puede tener muchos bebés.
- Un bebé pertenece a un usuario.
- Un bebé puede tener muchas consultas, vacunas y costos.
- Si se elimina un bebé, se eliminan sus registros asociados.
- Las fechas se guardan como TEXT en formato YYYY-MM-DD.
```

---

# Conexión a SQLite

## `src/db/connection.ts`

```ts
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'child-health.sqlite');

export const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
```

---

# Inicialización de base de datos

## `src/db/init.ts`

```ts
import { mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { db } from './connection';

const dataDir = path.resolve(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

const schemaPath = path.resolve(process.cwd(), 'src', 'db', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

db.exec(schema);

console.log('Database initialized successfully');
```

---

# GraphQL Schema

## `src/graphql/typeDefs.ts`

```ts
export const typeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type Baby {
    id: Int!
    userId: Int!
    name: String!
    birthDate: String!
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
    createdAt: String
    updatedAt: String
  }

  type Consultation {
    id: Int!
    babyId: Int!
    consultationDate: String!
    doctorName: String!
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
    createdAt: String
    updatedAt: String
  }

  type Vaccine {
    id: Int!
    babyId: Int!
    name: String!
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String!
    notes: String
    createdAt: String
    updatedAt: String
  }

  type Cost {
    id: Int!
    babyId: Int!
    costDate: String!
    category: String!
    description: String
    amount: Float!
    createdAt: String
    updatedAt: String
  }

  type DashboardSummary {
    babyId: Int!
    consultationsCount: Int!
    vaccinesCount: Int!
    pendingVaccinesCount: Int!
    totalCosts: Float!
    nextVaccineName: String
    nextVaccineDate: String
    lastConsultationDate: String
  }

  input RegisterUserInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateBabyInput {
    userId: Int!
    name: String!
    birthDate: String!
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
  }

  input UpdateBabyInput {
    name: String
    birthDate: String
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
  }

  input CreateConsultationInput {
    babyId: Int!
    consultationDate: String!
    doctorName: String!
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
  }

  input UpdateConsultationInput {
    consultationDate: String
    doctorName: String
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
  }

  input CreateVaccineInput {
    babyId: Int!
    name: String!
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String
    notes: String
  }

  input UpdateVaccineInput {
    name: String
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String
    notes: String
  }

  input CreateCostInput {
    babyId: Int!
    costDate: String!
    category: String!
    description: String
    amount: Float!
  }

  input UpdateCostInput {
    costDate: String
    category: String
    description: String
    amount: Float
  }

  type Query {
    users: [User!]!
    babies(userId: Int!): [Baby!]!
    baby(id: Int!): Baby
    consultations(babyId: Int!): [Consultation!]!
    vaccines(babyId: Int!): [Vaccine!]!
    costs(babyId: Int!): [Cost!]!
    dashboardSummary(babyId: Int!): DashboardSummary!
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User!
    login(input: LoginInput!): User!

    createBaby(input: CreateBabyInput!): Baby!
    updateBaby(id: Int!, input: UpdateBabyInput!): Baby!
    deleteBaby(id: Int!): Boolean!

    createConsultation(input: CreateConsultationInput!): Consultation!
    updateConsultation(id: Int!, input: UpdateConsultationInput!): Consultation!
    deleteConsultation(id: Int!): Boolean!

    createVaccine(input: CreateVaccineInput!): Vaccine!
    updateVaccine(id: Int!, input: UpdateVaccineInput!): Vaccine!
    deleteVaccine(id: Int!): Boolean!

    createCost(input: CreateCostInput!): Cost!
    updateCost(id: Int!, input: UpdateCostInput!): Cost!
    deleteCost(id: Int!): Boolean!
  }
`;
```

---

# Validaciones mínimas

## `src/utils/validation.ts`

```ts
export function validateEmail(email: string) {
  return email.includes('@') && email.includes('.');
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
```

---

# User service

## `src/services/user.service.ts`

```ts
import bcrypt from 'bcryptjs';
import { db } from '../db/connection';
import { validateEmail, validateRequired } from '../utils/validation';

function mapUser(row: any) {
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

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  return mapUser(user);
}

export function login(input: { email: string; password: string }) {
  validateRequired(input.email, 'Email');
  validateRequired(input.password, 'Password');

  const email = input.email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = bcrypt.compareSync(input.password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  return mapUser(user);
}

export function getUsers() {
  const rows = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  return rows.map(mapUser);
}
```

---

# Baby service

## `src/services/baby.service.ts`

```ts
import { db } from '../db/connection';
import { validateRequired } from '../utils/validation';

function mapBaby(row: any) {
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
  const rows = db.prepare('SELECT * FROM babies WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  return rows.map(mapBaby);
}

export function getBaby(id: number) {
  const row = db.prepare('SELECT * FROM babies WHERE id = ?').get(id);
  return row ? mapBaby(row) : null;
}

export function createBaby(input: any) {
  validateRequired(input.userId, 'User ID');
  validateRequired(input.name, 'Baby name');
  validateRequired(input.birthDate, 'Birth date');

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(input.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = db.prepare(`
    INSERT INTO babies (
      user_id, name, birth_date, gender, blood_type, allergies, pediatrician_name, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.userId,
    input.name,
    input.birthDate,
    input.gender ?? null,
    input.bloodType ?? null,
    input.allergies ?? null,
    input.pediatricianName ?? null,
    input.notes ?? null
  );

  return getBaby(Number(result.lastInsertRowid));
}

export function updateBaby(id: number, input: any) {
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

  db.prepare(`
    UPDATE babies
    SET name = ?, birth_date = ?, gender = ?, blood_type = ?, allergies = ?,
        pediatrician_name = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.name,
    updated.birthDate,
    updated.gender,
    updated.bloodType,
    updated.allergies,
    updated.pediatricianName,
    updated.notes,
    id
  );

  return getBaby(id);
}

export function deleteBaby(id: number) {
  const result = db.prepare('DELETE FROM babies WHERE id = ?').run(id);
  return result.changes > 0;
}
```

---

# Consultation service

## `src/services/consultation.service.ts`

```ts
import { db } from '../db/connection';
import { validatePositiveNumber, validateRequired } from '../utils/validation';

function mapConsultation(row: any) {
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
  const rows = db.prepare(`
    SELECT * FROM consultations
    WHERE baby_id = ?
    ORDER BY consultation_date DESC
  `).all(babyId);

  return rows.map(mapConsultation);
}

export function createConsultation(input: any) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.consultationDate, 'Consultation date');
  validateRequired(input.doctorName, 'Doctor name');
  validatePositiveNumber(input.weight, 'Weight');
  validatePositiveNumber(input.height, 'Height');

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  const result = db.prepare(`
    INSERT INTO consultations (
      baby_id, consultation_date, doctor_name, specialist_type, weight, height,
      diagnosis, notes, medicine_prescribed, next_appointment_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.babyId,
    input.consultationDate,
    input.doctorName,
    input.specialistType ?? null,
    input.weight ?? null,
    input.height ?? null,
    input.diagnosis ?? null,
    input.notes ?? null,
    input.medicinePrescribed ?? null,
    input.nextAppointmentDate ?? null
  );

  return db.prepare('SELECT * FROM consultations WHERE id = ?').get(result.lastInsertRowid);
}

export function updateConsultation(id: number, input: any) {
  const existing = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as any;
  if (!existing) throw new Error('Consultation not found');

  const updated = {
    consultationDate: input.consultationDate ?? existing.consultation_date,
    doctorName: input.doctorName ?? existing.doctor_name,
    specialistType: input.specialistType ?? existing.specialist_type,
    weight: input.weight ?? existing.weight,
    height: input.height ?? existing.height,
    diagnosis: input.diagnosis ?? existing.diagnosis,
    notes: input.notes ?? existing.notes,
    medicinePrescribed: input.medicinePrescribed ?? existing.medicine_prescribed,
    nextAppointmentDate: input.nextAppointmentDate ?? existing.next_appointment_date,
  };

  validateRequired(updated.consultationDate, 'Consultation date');
  validateRequired(updated.doctorName, 'Doctor name');
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
    updated.doctorName,
    updated.specialistType,
    updated.weight,
    updated.height,
    updated.diagnosis,
    updated.notes,
    updated.medicinePrescribed,
    updated.nextAppointmentDate,
    id
  );

  const row = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id);
  return mapConsultation(row);
}

export function deleteConsultation(id: number) {
  const result = db.prepare('DELETE FROM consultations WHERE id = ?').run(id);
  return result.changes > 0;
}
```

Importante: si copias este servicio, en `createConsultation` puedes mapear el resultado antes de retornarlo:

```ts
const row = db.prepare('SELECT * FROM consultations WHERE id = ?').get(result.lastInsertRowid);
return mapConsultation(row);
```

---

# Vaccine service

## `src/services/vaccine.service.ts`

```ts
import { db } from '../db/connection';
import { validateRequired, validateVaccineStatus } from '../utils/validation';

function mapVaccine(row: any) {
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
  const rows = db.prepare(`
    SELECT * FROM vaccines
    WHERE baby_id = ?
    ORDER BY COALESCE(next_dose_date, applied_date, created_at) ASC
  `).all(babyId);

  return rows.map(mapVaccine);
}

export function createVaccine(input: any) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.name, 'Vaccine name');
  validateVaccineStatus(input.status);

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) throw new Error('Baby not found');

  const result = db.prepare(`
    INSERT INTO vaccines (
      baby_id, name, recommended_age, applied_date, next_dose_date, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.babyId,
    input.name,
    input.recommendedAge ?? null,
    input.appliedDate ?? null,
    input.nextDoseDate ?? null,
    input.status ?? 'Pending',
    input.notes ?? null
  );

  const row = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(result.lastInsertRowid);
  return mapVaccine(row);
}

export function updateVaccine(id: number, input: any) {
  const existing = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(id) as any;
  if (!existing) throw new Error('Vaccine not found');

  const updated = {
    name: input.name ?? existing.name,
    recommendedAge: input.recommendedAge ?? existing.recommended_age,
    appliedDate: input.appliedDate ?? existing.applied_date,
    nextDoseDate: input.nextDoseDate ?? existing.next_dose_date,
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
  };

  validateRequired(updated.name, 'Vaccine name');
  validateVaccineStatus(updated.status);

  db.prepare(`
    UPDATE vaccines
    SET name = ?, recommended_age = ?, applied_date = ?, next_dose_date = ?,
        status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.name,
    updated.recommendedAge,
    updated.appliedDate,
    updated.nextDoseDate,
    updated.status,
    updated.notes,
    id
  );

  const row = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(id);
  return mapVaccine(row);
}

export function deleteVaccine(id: number) {
  const result = db.prepare('DELETE FROM vaccines WHERE id = ?').run(id);
  return result.changes > 0;
}
```

---

# Cost service

## `src/services/cost.service.ts`

```ts
import { db } from '../db/connection';
import { validateCostCategory, validatePositiveNumber, validateRequired } from '../utils/validation';

function mapCost(row: any) {
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
  const rows = db.prepare(`
    SELECT * FROM costs
    WHERE baby_id = ?
    ORDER BY cost_date DESC
  `).all(babyId);

  return rows.map(mapCost);
}

export function createCost(input: any) {
  validateRequired(input.babyId, 'Baby ID');
  validateRequired(input.costDate, 'Cost date');
  validateRequired(input.category, 'Category');
  validateRequired(input.amount, 'Amount');
  validateCostCategory(input.category);
  validatePositiveNumber(input.amount, 'Amount');

  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(input.babyId);
  if (!baby) throw new Error('Baby not found');

  const result = db.prepare(`
    INSERT INTO costs (baby_id, cost_date, category, description, amount)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    input.babyId,
    input.costDate,
    input.category,
    input.description ?? null,
    input.amount
  );

  const row = db.prepare('SELECT * FROM costs WHERE id = ?').get(result.lastInsertRowid);
  return mapCost(row);
}

export function updateCost(id: number, input: any) {
  const existing = db.prepare('SELECT * FROM costs WHERE id = ?').get(id) as any;
  if (!existing) throw new Error('Cost not found');

  const updated = {
    costDate: input.costDate ?? existing.cost_date,
    category: input.category ?? existing.category,
    description: input.description ?? existing.description,
    amount: input.amount ?? existing.amount,
  };

  validateRequired(updated.costDate, 'Cost date');
  validateRequired(updated.category, 'Category');
  validateRequired(updated.amount, 'Amount');
  validateCostCategory(updated.category);
  validatePositiveNumber(updated.amount, 'Amount');

  db.prepare(`
    UPDATE costs
    SET cost_date = ?, category = ?, description = ?, amount = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updated.costDate,
    updated.category,
    updated.description,
    updated.amount,
    id
  );

  const row = db.prepare('SELECT * FROM costs WHERE id = ?').get(id);
  return mapCost(row);
}

export function deleteCost(id: number) {
  const result = db.prepare('DELETE FROM costs WHERE id = ?').run(id);
  return result.changes > 0;
}
```

---

# Dashboard summary

Puedes implementarlo dentro de `baby.service.ts` o un servicio separado.

```ts
export function getDashboardSummary(babyId: number) {
  const baby = db.prepare('SELECT id FROM babies WHERE id = ?').get(babyId);
  if (!baby) throw new Error('Baby not found');

  const consultationsCount = db
    .prepare('SELECT COUNT(*) as count FROM consultations WHERE baby_id = ?')
    .get(babyId) as { count: number };

  const vaccinesCount = db
    .prepare('SELECT COUNT(*) as count FROM vaccines WHERE baby_id = ?')
    .get(babyId) as { count: number };

  const pendingVaccinesCount = db
    .prepare(`
      SELECT COUNT(*) as count
      FROM vaccines
      WHERE baby_id = ? AND status IN ('Pending', 'Overdue')
    `)
    .get(babyId) as { count: number };

  const totalCosts = db
    .prepare('SELECT COALESCE(SUM(amount), 0) as total FROM costs WHERE baby_id = ?')
    .get(babyId) as { total: number };

  const nextVaccine = db
    .prepare(`
      SELECT name, next_dose_date
      FROM vaccines
      WHERE baby_id = ? AND next_dose_date IS NOT NULL AND status != 'Applied'
      ORDER BY next_dose_date ASC
      LIMIT 1
    `)
    .get(babyId) as any;

  const lastConsultation = db
    .prepare(`
      SELECT consultation_date
      FROM consultations
      WHERE baby_id = ?
      ORDER BY consultation_date DESC
      LIMIT 1
    `)
    .get(babyId) as any;

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
```

---

# Resolvers

## `src/graphql/resolvers.ts`

```ts
import * as UserService from '../services/user.service';
import * as BabyService from '../services/baby.service';
import * as ConsultationService from '../services/consultation.service';
import * as VaccineService from '../services/vaccine.service';
import * as CostService from '../services/cost.service';

export const resolvers = {
  Query: {
    users: () => UserService.getUsers(),
    babies: (_: unknown, args: { userId: number }) => BabyService.getBabies(args.userId),
    baby: (_: unknown, args: { id: number }) => BabyService.getBaby(args.id),
    consultations: (_: unknown, args: { babyId: number }) => ConsultationService.getConsultations(args.babyId),
    vaccines: (_: unknown, args: { babyId: number }) => VaccineService.getVaccines(args.babyId),
    costs: (_: unknown, args: { babyId: number }) => CostService.getCosts(args.babyId),
    dashboardSummary: (_: unknown, args: { babyId: number }) => BabyService.getDashboardSummary(args.babyId),
  },

  Mutation: {
    registerUser: (_: unknown, args: { input: { email: string; password: string } }) =>
      UserService.registerUser(args.input),

    login: (_: unknown, args: { input: { email: string; password: string } }) =>
      UserService.login(args.input),

    createBaby: (_: unknown, args: { input: any }) => BabyService.createBaby(args.input),
    updateBaby: (_: unknown, args: { id: number; input: any }) => BabyService.updateBaby(args.id, args.input),
    deleteBaby: (_: unknown, args: { id: number }) => BabyService.deleteBaby(args.id),

    createConsultation: (_: unknown, args: { input: any }) => ConsultationService.createConsultation(args.input),
    updateConsultation: (_: unknown, args: { id: number; input: any }) => ConsultationService.updateConsultation(args.id, args.input),
    deleteConsultation: (_: unknown, args: { id: number }) => ConsultationService.deleteConsultation(args.id),

    createVaccine: (_: unknown, args: { input: any }) => VaccineService.createVaccine(args.input),
    updateVaccine: (_: unknown, args: { id: number; input: any }) => VaccineService.updateVaccine(args.id, args.input),
    deleteVaccine: (_: unknown, args: { id: number }) => VaccineService.deleteVaccine(args.id),

    createCost: (_: unknown, args: { input: any }) => CostService.createCost(args.input),
    updateCost: (_: unknown, args: { id: number; input: any }) => CostService.updateCost(args.id, args.input),
    deleteCost: (_: unknown, args: { id: number }) => CostService.deleteCost(args.id),
  },
};
```

---

# Servidor Bun + GraphQL Yoga

## `src/index.ts`

```ts
import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import './db/connection';

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  cors: {
    origin: ['http://localhost:3000'],
    credentials: false,
  },
});

const server = Bun.serve({
  port: 4000,
  fetch: yoga,
});

console.log(`GraphQL server running at http://localhost:${server.port}/graphql`);
```

---

# Seed opcional

## `src/db/seed.ts`

Usar solo para tener datos iniciales si quieres mostrar rápido.

```ts
import { registerUser } from '../services/user.service';
import { createBaby } from '../services/baby.service';
import { createConsultation } from '../services/consultation.service';
import { createVaccine } from '../services/vaccine.service';
import { createCost } from '../services/cost.service';

try {
  const user = registerUser({ email: 'parent@test.com', password: 'password123' });

  const baby = createBaby({
    userId: user.id,
    name: 'Emma',
    birthDate: '2026-01-15',
    gender: 'Female',
    bloodType: 'Unknown',
    allergies: 'None',
    pediatricianName: 'Dr. Smith',
    notes: 'Healthy baby',
  });

  createConsultation({
    babyId: baby.id,
    consultationDate: '2026-06-20',
    doctorName: 'Dr. Smith',
    specialistType: 'Pediatrician',
    weight: 7.2,
    height: 64,
    diagnosis: 'Normal development',
    notes: 'Routine check-up',
  });

  createVaccine({
    babyId: baby.id,
    name: 'Hexavalent',
    recommendedAge: '6 months',
    nextDoseDate: '2026-07-15',
    status: 'Pending',
  });

  createCost({
    babyId: baby.id,
    costDate: '2026-06-20',
    category: 'Consultation',
    description: 'Pediatric consultation',
    amount: 45,
  });

  console.log('Seed completed successfully');
} catch (error) {
  console.log('Seed skipped or failed:', error instanceof Error ? error.message : error);
}
```

---

# Queries y mutations para probar

## Registrar usuario

```graphql
mutation {
  registerUser(input: {
    email: "kevin@test.com",
    password: "password123"
  }) {
    id
    email
    createdAt
  }
}
```

## Login

```graphql
mutation {
  login(input: {
    email: "kevin@test.com",
    password: "password123"
  }) {
    id
    email
  }
}
```

## Crear bebé

```graphql
mutation {
  createBaby(input: {
    userId: 1,
    name: "Emma",
    birthDate: "2026-01-15",
    gender: "Female",
    bloodType: "Unknown",
    allergies: "None",
    pediatricianName: "Dr. Smith"
  }) {
    id
    name
    birthDate
  }
}
```

## Listar bebés del usuario

```graphql
query {
  babies(userId: 1) {
    id
    name
    birthDate
    pediatricianName
  }
}
```

## Editar bebé

```graphql
mutation {
  updateBaby(id: 1, input: {
    weight: "not-used"
  }) {
    id
    name
  }
}
```

Nota: el ejemplo correcto debe usar campos existentes:

```graphql
mutation {
  updateBaby(id: 1, input: {
    name: "Emma Rivas",
    pediatricianName: "Dr. Robert Cassar",
    allergies: "No known allergies"
  }) {
    id
    name
    pediatricianName
    allergies
  }
}
```

## Crear consulta

```graphql
mutation {
  createConsultation(input: {
    babyId: 1,
    consultationDate: "2026-06-29",
    doctorName: "Dr. Robert Cassar",
    specialistType: "Pediatrician",
    weight: 7.5,
    height: 65,
    diagnosis: "Routine check-up",
    notes: "Baby is developing well"
  }) {
    id
    doctorName
    consultationDate
  }
}
```

## Crear vacuna

```graphql
mutation {
  createVaccine(input: {
    babyId: 1,
    name: "Rotavirus",
    recommendedAge: "6 months",
    nextDoseDate: "2026-07-15",
    status: "Pending"
  }) {
    id
    name
    status
  }
}
```

## Crear costo

```graphql
mutation {
  createCost(input: {
    babyId: 1,
    costDate: "2026-06-29",
    category: "Consultation",
    description: "Pediatric visit",
    amount: 45.00
  }) {
    id
    category
    amount
  }
}
```

## Dashboard summary

```graphql
query {
  dashboardSummary(babyId: 1) {
    babyId
    consultationsCount
    vaccinesCount
    pendingVaccinesCount
    totalCosts
    nextVaccineName
    nextVaccineDate
    lastConsultationDate
  }
}
```

---

# Dockerfile backend

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

RUN mkdir -p data

EXPOSE 4000

CMD ["bun", "run", "start"]
```

---

# docker-compose.yml recomendado para el proyecto completo

Colocar en raíz del proyecto:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    volumes:
      - ./backend/data:/app/data
    environment:
      - NODE_ENV=development

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
    depends_on:
      - backend
```

---

# Prioridad para terminar mañana

## Obligatorio

```txt
[ ] db:init funciona
[ ] registerUser funciona
[ ] login funciona
[ ] createBaby funciona
[ ] updateBaby funciona
[ ] babies(userId) funciona
[ ] baby(id) funciona
[ ] createConsultation funciona
[ ] consultations(babyId) funciona
[ ] dashboardSummary funciona
```

## Muy importante

```txt
[ ] createVaccine funciona
[ ] vaccines(babyId) funciona
[ ] createCost funciona
[ ] costs(babyId) funciona
[ ] totalCosts se calcula correctamente
```

## Si sobra tiempo

```txt
[ ] updateConsultation
[ ] deleteConsultation
[ ] updateVaccine
[ ] deleteVaccine
[ ] updateCost
[ ] deleteCost
[ ] Docker completo
```

---

# Checklist de integración con frontend

```txt
[ ] Backend corre en http://localhost:4000/graphql
[ ] CORS permite http://localhost:3000
[ ] registerUser devuelve id y email
[ ] login devuelve id y email
[ ] babies(userId) devuelve solo bebés de ese usuario
[ ] createBaby requiere userId real
[ ] updateBaby modifica datos persistidos
[ ] consultations usa babyId real
[ ] vaccines usa babyId real
[ ] costs usa babyId real
[ ] dashboardSummary se actualiza cuando se agregan registros
```

---

# Cómo explicarlo en entrevista

```txt
I implemented a functional backend using Bun, TypeScript, GraphQL and SQLite. The app supports real user registration and login, multiple baby profiles, and health records such as consultations, vaccines and medical costs. The frontend consumes the GraphQL API directly, so the data is persisted and not mocked.
```

También puedes decir:

```txt
I kept the authentication simple for the MVP, but I added real backend validation and password hashing. In a production version, I would add JWT or secure cookies, authorization middleware, tests and stronger deployment security.
```

---

# Importante para no bloquearte

No intentes hacerlo perfecto. Para mañana, lo más importante es que puedas demostrar este flujo:

```txt
Register user
Login
Create baby
Edit baby
Add consultation
Add vaccine
Add cost
See dashboard updated
```

Ese flujo demuestra que el proyecto es full-stack y funcional.
