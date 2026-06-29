# PLANNING_FRONT.md

# Child Health Record — Frontend MVP conectado al backend

## Objetivo

Construir el frontend funcional para **Child Health Record**, una aplicación sencilla para registrar la salud de uno o varios bebés.

Este frontend NO debe ser solo visual. Debe conectarse al backend GraphQL real y permitir:

- Registrar un nuevo usuario.
- Validar login contra backend.
- Guardar sesión básica en `localStorage`.
- Crear bebés asociados al usuario autenticado.
- Ver lista de bebés del usuario.
- Seleccionar un bebé activo.
- Editar información del bebé.
- Registrar consultas médicas.
- Registrar vacunas.
- Registrar costos médicos.
- Ver dashboard con datos reales calculados desde backend.

El objetivo es tener un MVP listo para entrevista, funcional y fácil de explicar como desarrollador junior.

---

## Stack frontend

```txt
Next.js App Router
TypeScript
Tailwind CSS
Fetch API
GraphQL
LocalStorage para sesión básica
```

No usar Apollo Client, Redux, Zustand ni librerías complejas. Para este MVP, `fetch` es suficiente.

---

## Backend esperado

El frontend debe consumir el backend GraphQL en:

```txt
http://localhost:4000/graphql
```

Variable de entorno:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

---

## Flujo principal de usuario

```txt
1. Usuario entra a /register.
2. Crea cuenta con email y password.
3. Backend valida si el email ya existe.
4. Usuario entra a /login.
5. Backend valida credenciales y devuelve user.
6. Frontend guarda user en localStorage.
7. Usuario entra a /dashboard.
8. Frontend consulta babies(userId).
9. Si no hay bebés, muestra formulario para crear uno.
10. Si hay bebés, permite seleccionar bebé activo.
11. Todas las consultas, vacunas y costos usan el babyId seleccionado.
```

---

## Páginas necesarias

### Públicas

```txt
/register
/login
```

### Privadas

```txt
/dashboard
/babies
/consultations
/vaccines
/costs
```

Para ahorrar tiempo, `/babies` puede ser una página simple para crear, editar y seleccionar bebés. El dashboard también puede mostrar un selector de bebé.

---

## Reglas importantes para el MVP

- El usuario debe ser real en base de datos, no hardcoded.
- El login debe llamar al backend.
- El registro debe llamar al backend.
- Si el email ya existe, mostrar error.
- Si la contraseña es incorrecta, mostrar error.
- No implementar JWT todavía.
- Guardar el usuario autenticado en `localStorage`.
- Guardar el `selectedBabyId` en `localStorage`.
- Todas las páginas privadas deben redirigir a `/login` si no hay usuario.
- Todas las páginas que dependen de bebé deben pedir seleccionar o crear bebé si no hay `selectedBabyId`.

Explicación para entrevista:

```txt
For this MVP I implemented a simple authentication flow using the backend and localStorage. I did not add JWT yet because I wanted to focus on building a functional full-stack MVP. In a production version, I would replace this with JWT, secure cookies or NextAuth.
```

---

## Instalación inicial

Crear frontend:

```bash
npx create-next-app@latest frontend
```

Opciones recomendadas:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: No
Import alias: Yes
```

Entrar al frontend:

```bash
cd frontend
npm run dev
```

---

## Estructura de carpetas recomendada

```txt
frontend/
│
├── app/
│   ├── register/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── babies/
│   │   └── page.tsx
│   ├── consultations/
│   │   └── page.tsx
│   ├── vaccines/
│   │   └── page.tsx
│   ├── costs/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SummaryCard.tsx
│   │   └── StatusBadge.tsx
│   ├── babies/
│   │   ├── BabyForm.tsx
│   │   └── BabySelector.tsx
│   ├── consultations/
│   │   ├── ConsultationForm.tsx
│   │   └── ConsultationTable.tsx
│   ├── vaccines/
│   │   ├── VaccineForm.tsx
│   │   └── VaccineTable.tsx
│   └── costs/
│       ├── CostForm.tsx
│       └── CostTable.tsx
│
├── lib/
│   ├── graphql.ts
│   ├── auth.ts
│   ├── baby-selection.ts
│   └── utils.ts
│
├── graphql/
│   ├── auth.ts
│   ├── babies.ts
│   ├── consultations.ts
│   ├── vaccines.ts
│   └── costs.ts
│
├── types/
│   └── index.ts
│
└── Dockerfile
```

---

## Variables de entorno

Crear archivo:

```bash
.env.local
```

Contenido:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

---

# Tipos TypeScript

Crear `types/index.ts`:

```ts
export type User = {
  id: number;
  email: string;
  createdAt?: string;
};

export type Baby = {
  id: number;
  userId: number;
  name: string;
  birthDate: string;
  gender?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  pediatricianName?: string | null;
  notes?: string | null;
};

export type Consultation = {
  id: number;
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
};

export type Vaccine = {
  id: number;
  babyId: number;
  name: string;
  recommendedAge?: string | null;
  appliedDate?: string | null;
  nextDoseDate?: string | null;
  status: 'Pending' | 'Applied' | 'Overdue';
  notes?: string | null;
};

export type Cost = {
  id: number;
  babyId: number;
  costDate: string;
  category: 'Consultation' | 'Medicine' | 'Vaccine' | 'Test' | 'Other';
  description?: string | null;
  amount: number;
};

export type DashboardSummary = {
  babyId: number;
  consultationsCount: number;
  vaccinesCount: number;
  pendingVaccinesCount: number;
  totalCosts: number;
  nextVaccineName?: string | null;
  nextVaccineDate?: string | null;
  lastConsultationDate?: string | null;
};
```

---

# Cliente GraphQL

Crear `lib/graphql.ts`:

```ts
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const result = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok) {
    throw new Error('Network error while calling GraphQL API');
  }

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL API');
  }

  return result.data;
}
```

---

# Sesión básica del usuario

Crear `lib/auth.ts`:

```ts
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

export function requireUser(): User {
  const user = getUser();
  if (!user) {
    throw new Error('User is not authenticated');
  }
  return user;
}
```

---

# Selección de bebé activo

Crear `lib/baby-selection.ts`:

```ts
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
```

---

# GraphQL operations

## Auth operations

Crear `graphql/auth.ts`:

```ts
import { graphqlRequest } from '@/lib/graphql';
import type { User } from '@/types';

export async function registerUser(email: string, password: string) {
  const mutation = `
    mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) {
        id
        email
        createdAt
      }
    }
  `;

  const data = await graphqlRequest<{ registerUser: User }>(mutation, {
    input: { email, password },
  });

  return data.registerUser;
}

export async function loginUser(email: string, password: string) {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        id
        email
        createdAt
      }
    }
  `;

  const data = await graphqlRequest<{ login: User }>(mutation, {
    input: { email, password },
  });

  return data.login;
}
```

---

## Baby operations

Crear `graphql/babies.ts`:

```ts
import { graphqlRequest } from '@/lib/graphql';
import type { Baby, DashboardSummary } from '@/types';

export async function getBabies(userId: number) {
  const query = `
    query Babies($userId: Int!) {
      babies(userId: $userId) {
        id
        userId
        name
        birthDate
        gender
        bloodType
        allergies
        pediatricianName
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ babies: Baby[] }>(query, { userId });
  return data.babies;
}

export async function getBaby(id: number) {
  const query = `
    query Baby($id: Int!) {
      baby(id: $id) {
        id
        userId
        name
        birthDate
        gender
        bloodType
        allergies
        pediatricianName
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ baby: Baby }>(query, { id });
  return data.baby;
}

export async function createBaby(input: Omit<Baby, 'id'>) {
  const mutation = `
    mutation CreateBaby($input: CreateBabyInput!) {
      createBaby(input: $input) {
        id
        userId
        name
        birthDate
        gender
        bloodType
        allergies
        pediatricianName
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ createBaby: Baby }>(mutation, { input });
  return data.createBaby;
}

export async function updateBaby(id: number, input: Partial<Omit<Baby, 'id' | 'userId'>>) {
  const mutation = `
    mutation UpdateBaby($id: Int!, $input: UpdateBabyInput!) {
      updateBaby(id: $id, input: $input) {
        id
        userId
        name
        birthDate
        gender
        bloodType
        allergies
        pediatricianName
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ updateBaby: Baby }>(mutation, { id, input });
  return data.updateBaby;
}

export async function getDashboardSummary(babyId: number) {
  const query = `
    query DashboardSummary($babyId: Int!) {
      dashboardSummary(babyId: $babyId) {
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
  `;

  const data = await graphqlRequest<{ dashboardSummary: DashboardSummary }>(query, { babyId });
  return data.dashboardSummary;
}
```

---

## Consultation operations

Crear `graphql/consultations.ts`:

```ts
import { graphqlRequest } from '@/lib/graphql';
import type { Consultation } from '@/types';

export async function getConsultations(babyId: number) {
  const query = `
    query Consultations($babyId: Int!) {
      consultations(babyId: $babyId) {
        id
        babyId
        consultationDate
        doctorName
        specialistType
        weight
        height
        diagnosis
        notes
        medicinePrescribed
        nextAppointmentDate
      }
    }
  `;

  const data = await graphqlRequest<{ consultations: Consultation[] }>(query, { babyId });
  return data.consultations;
}

export async function createConsultation(input: Omit<Consultation, 'id'>) {
  const mutation = `
    mutation CreateConsultation($input: CreateConsultationInput!) {
      createConsultation(input: $input) {
        id
        babyId
        consultationDate
        doctorName
        specialistType
        weight
        height
        diagnosis
        notes
        medicinePrescribed
        nextAppointmentDate
      }
    }
  `;

  const data = await graphqlRequest<{ createConsultation: Consultation }>(mutation, { input });
  return data.createConsultation;
}
```

Para terminar rápido, implementar primero crear y listar. Editar/eliminar puede quedar para después si sobra tiempo.

---

## Vaccine operations

Crear `graphql/vaccines.ts`:

```ts
import { graphqlRequest } from '@/lib/graphql';
import type { Vaccine } from '@/types';

export async function getVaccines(babyId: number) {
  const query = `
    query Vaccines($babyId: Int!) {
      vaccines(babyId: $babyId) {
        id
        babyId
        name
        recommendedAge
        appliedDate
        nextDoseDate
        status
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ vaccines: Vaccine[] }>(query, { babyId });
  return data.vaccines;
}

export async function createVaccine(input: Omit<Vaccine, 'id'>) {
  const mutation = `
    mutation CreateVaccine($input: CreateVaccineInput!) {
      createVaccine(input: $input) {
        id
        babyId
        name
        recommendedAge
        appliedDate
        nextDoseDate
        status
        notes
      }
    }
  `;

  const data = await graphqlRequest<{ createVaccine: Vaccine }>(mutation, { input });
  return data.createVaccine;
}
```

---

## Cost operations

Crear `graphql/costs.ts`:

```ts
import { graphqlRequest } from '@/lib/graphql';
import type { Cost } from '@/types';

export async function getCosts(babyId: number) {
  const query = `
    query Costs($babyId: Int!) {
      costs(babyId: $babyId) {
        id
        babyId
        costDate
        category
        description
        amount
      }
    }
  `;

  const data = await graphqlRequest<{ costs: Cost[] }>(query, { babyId });
  return data.costs;
}

export async function createCost(input: Omit<Cost, 'id'>) {
  const mutation = `
    mutation CreateCost($input: CreateCostInput!) {
      createCost(input: $input) {
        id
        babyId
        costDate
        category
        description
        amount
      }
    }
  `;

  const data = await graphqlRequest<{ createCost: Cost }>(mutation, { input });
  return data.createCost;
}
```

---

# Página `/register`

Objetivo:

- Crear usuario real en backend.
- Validar campos.
- Mostrar errores.
- Redirigir a login o dashboard.

Campos:

```txt
Email
Password
Confirm password
```

Validaciones frontend:

```txt
- Email requerido.
- Email debe contener @.
- Password mínimo 6 caracteres.
- Confirm password debe coincidir.
```

Comportamiento:

```txt
1. Usuario completa formulario.
2. Front llama registerUser.
3. Si el backend responde error “Email already exists”, mostrar mensaje.
4. Si todo está bien, guardar usuario en localStorage.
5. Redirigir a /dashboard.
```

Código base:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/graphql/auth';
import { saveUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser(email, password);
      saveUser(user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="text-sm text-slate-500">Start tracking your baby's health records.</p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input className="w-full border rounded-lg p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded-lg p-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="w-full border rounded-lg p-3" placeholder="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button disabled={loading} className="w-full bg-violet-600 text-white rounded-lg p-3 font-medium">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </main>
  );
}
```

---

# Página `/login`

Objetivo:

- Validar usuario contra backend.
- Guardar sesión básica.
- Redirigir a dashboard.

Comportamiento:

```txt
1. Usuario ingresa email/password.
2. Front llama loginUser.
3. Backend valida credenciales.
4. Si son correctas, guardar user en localStorage.
5. Redirigir a /dashboard.
```

Debe incluir link a `/register`.

---

# Layout privado

Crear `components/layout/AppLayout.tsx`:

Responsabilidades:

- Mostrar sidebar.
- Mostrar botón logout.
- Verificar si existe usuario.
- Redirigir a `/login` si no existe.

Regla:

```txt
Todas las páginas privadas deben envolver su contenido con AppLayout.
```

---

# Página `/babies`

Objetivo:

- Mostrar bebés del usuario.
- Crear nuevo bebé.
- Editar bebé existente.
- Seleccionar bebé activo.

Funciones necesarias:

```txt
getBabies(userId)
createBaby(input)
updateBaby(id, input)
saveSelectedBabyId(id)
```

Campos del formulario:

```txt
Name
Birth date
Gender
Blood type
Allergies
Pediatrician name
Notes
```

Validaciones:

```txt
- Name requerido.
- Birth date requerida.
```

Comportamiento recomendado:

```txt
1. Al cargar, obtener user desde localStorage.
2. Consultar babies(userId).
3. Mostrar cards con cada bebé.
4. Botón “Select” guarda selectedBabyId.
5. Botón “Edit” carga datos en formulario.
6. Botón “Create Baby” crea bebé en backend.
7. Si es el primer bebé creado, seleccionarlo automáticamente.
```

---

# Página `/dashboard`

Objetivo:

- Mostrar resumen real del bebé seleccionado.
- Si no hay bebé seleccionado, pedir crear o seleccionar bebé.

Datos a consumir:

```txt
getBaby(selectedBabyId)
getDashboardSummary(selectedBabyId)
```

Mostrar cards:

```txt
Baby name
Age
Blood type
Pediatrician
Total consultations
Pending vaccines
Total costs
Next vaccine
Last consultation
```

Si no hay bebés:

```txt
You do not have any baby profile yet. Create one to start tracking health records.
```

Botón:

```txt
Go to Babies
```

---

# Página `/consultations`

Objetivo:

- Listar consultas del bebé seleccionado.
- Agregar una nueva consulta.

Requiere:

```txt
selectedBabyId
getConsultations(selectedBabyId)
createConsultation(input)
```

Campos:

```txt
Consultation date
Doctor name
Specialist type
Weight
Height
Diagnosis
Notes
Medicine prescribed
Next appointment date
```

Validaciones:

```txt
- Consultation date requerida.
- Doctor name requerido.
- Weight y height opcionales, pero si existen deben ser números positivos.
```

Después de crear:

```txt
- Limpiar formulario.
- Recargar lista.
```

---

# Página `/vaccines`

Objetivo:

- Listar vacunas del bebé seleccionado.
- Agregar vacuna.

Campos:

```txt
Name
Recommended age
Applied date
Next dose date
Status
Notes
```

Estados:

```txt
Pending
Applied
Overdue
```

Validaciones:

```txt
- Name requerido.
- Status requerido.
```

Regla simple:

```txt
Si nextDoseDate es menor que hoy y status no es Applied, mostrar badge Overdue visualmente.
```

---

# Página `/costs`

Objetivo:

- Listar costos del bebé seleccionado.
- Agregar costo médico.
- Mostrar total.

Campos:

```txt
Cost date
Category
Description
Amount
```

Categorías:

```txt
Consultation
Medicine
Vaccine
Test
Other
```

Validaciones:

```txt
- Cost date requerida.
- Category requerida.
- Amount requerido y mayor que 0.
```

Calcular en frontend:

```ts
const total = costs.reduce((sum, cost) => sum + cost.amount, 0);
```

---

# Componentes UI mínimos

Para terminar rápido, crear solo estos componentes:

```txt
AppLayout
Sidebar
Card
Button
Input
Select
Textarea
StatusBadge
SummaryCard
```

No perder tiempo creando una librería UI perfecta.

---

# Manejo de errores

Todas las páginas que llaman backend deben tener:

```txt
loading
error
empty state
```

Ejemplo:

```tsx
if (loading) return <p>Loading...</p>;
if (error) return <p className="text-red-600">{error}</p>;
```

---

# Protección básica de rutas

En cada página privada:

```tsx
useEffect(() => {
  const currentUser = getUser();
  if (!currentUser) {
    router.push('/login');
    return;
  }
  setUser(currentUser);
}, [router]);
```

En páginas que necesitan bebé:

```tsx
const babyId = getSelectedBabyId();
if (!babyId) {
  router.push('/babies');
}
```

---

# Prioridad para terminar mañana

## Prioridad 1 — Obligatorio

```txt
/register conectado a registerUser
/login conectado a login
/babies con crear, listar, seleccionar y editar bebé
/dashboard con resumen real
/consultations con crear y listar
```

## Prioridad 2 — Muy importante

```txt
/vaccines con crear y listar
/costs con crear, listar y total
Dockerfile frontend
```

## Prioridad 3 — Solo si sobra tiempo

```txt
Editar consultas
Eliminar consultas
Editar vacunas
Eliminar vacunas
Editar costos
Eliminar costos
Mejoras visuales
```

---

# Qué debes poder demostrar en entrevista

Demo recomendada:

```txt
1. Crear usuario nuevo.
2. Hacer login.
3. Crear bebé.
4. Editar información del bebé.
5. Agregar consulta médica.
6. Agregar vacuna.
7. Agregar costo.
8. Volver al dashboard y mostrar resumen actualizado.
```

Frase para explicar:

```txt
This is a functional MVP. The frontend is not using mock data. It communicates with a Bun GraphQL backend and stores the information in SQLite. I kept the authentication simple for the MVP, but the user registration, login and health records are persisted in the database.
```

---

# Comandos útiles

Frontend local:

```bash
npm run dev
```

Backend local:

```bash
bun run dev
```

Docker:

```bash
docker compose up --build
```

---

# Checklist final frontend

```txt
[ ] /register funciona con backend
[ ] /login funciona con backend
[ ] Usuario se guarda en localStorage
[ ] Logout limpia user y selectedBabyId
[ ] /babies lista bebés reales
[ ] /babies crea bebé real
[ ] /babies edita bebé real
[ ] Se puede seleccionar bebé activo
[ ] /dashboard usa babyId real
[ ] /consultations crea registros reales
[ ] /vaccines crea registros reales
[ ] /costs crea registros reales
[ ] No hay mock data en páginas principales
[ ] README explica flujo y limitaciones
```

---

# Limitaciones aceptables para explicar

```txt
- Authentication is basic and uses localStorage for the MVP.
- Password hashing should be improved before real production.
- JWT or secure cookies should be added in the next version.
- Frontend validation is basic but clear.
- The project uses SQLite because it is simple and portable for demo purposes.
```

Importante: no digas que está listo para producción real si no agregas seguridad real. Mejor decir:

```txt
It is a functional MVP with real persistence, but before production I would improve authentication, password hashing, authorization, tests and deployment security.
```
