# Child Health Record Backend

Backend MVP for Child Health Record using Bun, TypeScript, GraphQL Yoga and SQLite.

## Requirements

- Bun 1.x

## Setup

```bash
cd backend
bun install
bun run db:init
bun run db:seed
bun run dev
```

This project uses Bun's built-in `bun:sqlite` driver. It does not use `better-sqlite3`
because that package is not compatible with Bun runtime execution.

GraphQL runs at:

```txt
http://localhost:4000/graphql
```

Frontend environment:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Verification

```bash
bun run typecheck
```

You can also run the backend with Docker from the project root:

```bash
docker compose up --build backend
```

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Useful Flow

1. Register a user with `registerUser`.
2. Login with `login`.
3. Create a baby with `createBaby`.
4. Add consultations, vaccines and costs using the selected `babyId`.
5. Read `dashboardSummary(babyId)` to see real calculated data.

## Example Query

```graphql
query {
  dashboardSummary(babyId: 1) {
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

## Production Notes

This MVP persists real data and hashes passwords. For production, add JWT or secure-cookie auth,
authorization middleware, stronger security hardening, tests and deployment-specific controls.
