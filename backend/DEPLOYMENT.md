# Backend Deployment

This backend runs with Bun, GraphQL Yoga and SQLite. Because SQLite is a file database,
production deployment needs persistent disk storage. Do not deploy this to a purely
ephemeral filesystem unless you are fine losing data on restarts/redeploys.

## Recommended Option: Fly.io

Fly.io is a good fit for this MVP because it supports Docker and persistent volumes.

### 1. Install and login

```bash
brew install flyctl
fly auth login
```

### 2. Create the app

From the `backend` folder:

```bash
cd backend
fly apps create your-child-health-backend-name
```

Edit `fly.toml` and replace:

```toml
app = "child-health-record-backend"
```

with your real Fly app name.

### 3. Create a persistent SQLite volume

```bash
fly volumes create child_health_data --region mad --size 1
```

The `fly.toml` file mounts that volume at `/data`, and the backend uses:

```env
DATA_DIR=/data
```

so the SQLite file is stored at:

```txt
/data/child-health.sqlite
```

### 4. Configure CORS

Replace the URL with your frontend production URL:

```bash
fly secrets set CORS_ORIGIN=https://your-frontend-domain.com
```

For local frontend plus production frontend, use comma-separated origins:

```bash
fly secrets set CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:3000
```

### 5. Deploy

```bash
fly deploy
```

The app starts with:

```bash
bun run start
```

which runs the database schema initialization and then starts the GraphQL server.

### 6. Test production

```bash
curl https://your-child-health-backend-name.fly.dev/health
```

Then open:

```txt
https://your-child-health-backend-name.fly.dev/graphql
```

Your frontend environment should use:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-child-health-backend-name.fly.dev/graphql
```

## Alternative: Railway

Railway also supports Docker and volumes. The important settings are:

```env
DATA_DIR=/data
CORS_ORIGIN=https://your-frontend-domain.com
PORT=4000
```

Mount a persistent volume at:

```txt
/data
```

Use the backend folder as the service root and Dockerfile as the builder.

## Alternative: Render

Render can also work if you use a persistent disk. The important settings are:

```env
DATA_DIR=/data
CORS_ORIGIN=https://your-frontend-domain.com
PORT=4000
```

Mount the persistent disk at:

```txt
/data
```

## Production Notes

This is still an MVP backend. Before handling real user medical data, add:

- JWT or secure-cookie authentication.
- Authorization checks on every baby/consultation/vaccine/cost query.
- Stronger password and security policies.
- Backups for the SQLite volume.
- HTTPS-only production frontend.
- Logging and monitoring.
