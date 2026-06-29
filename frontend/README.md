# Child Health Record Frontend

Functional MVP built with Next.js App Router, TypeScript, Tailwind CSS, Fetch API and GraphQL.

## Run locally

```bash
npm install
npm run dev
```

The app expects the backend at:

```txt
http://localhost:4000/graphql
```

Set `NEXT_PUBLIC_GRAPHQL_URL` in `.env.local` if the backend runs elsewhere.

## Demo flow

1. Register a user.
2. Log in.
3. Create and select a baby profile.
4. Add consultations, vaccines and medical costs.
5. Return to the dashboard to see real summary data from the backend.

Authentication is intentionally basic for the MVP and stores the user in `localStorage`. A production version should use JWT or secure cookies, stronger authorization, tests and deployment hardening.
