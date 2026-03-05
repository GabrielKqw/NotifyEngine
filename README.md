# Notify Engine

Notify is an open-source, self-hosted notification automation engine.

Current stack:
- NestJS monorepo (`api` + `worker`)
- Prisma + PostgreSQL
- Redis + BullMQ
- Docker Compose for one-command local deployment

## 1. Project Structure

- `apps/api`: HTTP API for management and manual triggering.
- `apps/worker`: background processor for automation executions.
- `prisma`: domain schema and SQL migrations.
- `docker-compose.yml`: local deployment for Postgres, Redis, API, and Worker.

## 2. Domain (Prisma)

Core entities:
- `Workspace`
- `User`
- `Group` / `GroupMember`
- `Template`
- `Automation`
- `Trigger`
- `Condition`
- `Action`
- `Execution`
- `ExecutionActionAttempt`
- `Log`

Key behavior modeled:
- Trigger -> Condition -> Action -> Log
- Idempotency by unique key on execution and action attempt
- Retry metadata on execution (`retryCount`, `nextRetryAt`, `maxRetries`)

## 3. Local Run (without Docker)

1. Copy environment:
```bash
cp .env.example .env
```

Set `APP_ENCRYPTION_KEY` in `.env` with a strong secret. SMTP passwords are stored encrypted using this key.

2. Start infra:
```bash
docker compose up -d postgres redis
```

3. Install deps and generate Prisma client:
```bash
npm install
npm run prisma:generate
```

4. Apply migrations:
```bash
npm run prisma:migrate:deploy
```

5. Run API and worker:
```bash
npm run start:api:dev
npm run start:worker:dev
```

## 4. Full Docker Compose Run

```bash
docker compose up --build
```

Services:
- API: `http://localhost:3000`
- Health endpoint: `GET /health`

## 5. Initial API Endpoints

- `GET /health`
- `GET /automations?workspaceId=<id>`
- `POST /automations`
- `POST /automations/:id/trigger/manual`
- `GET /executions/:id?workspaceId=<id>`
- `GET /smtp-config?workspaceId=<id>`
- `PUT /smtp-config`
- `POST /smtp-config/test`

Gmail setup (`PUT /smtp-config`):

```json
{
  "workspaceId": "ws_123",
  "provider": "GMAIL",
  "username": "seuemail@gmail.com",
  "password": "app-password-do-google",
  "fromEmail": "seuemail@gmail.com",
  "fromName": "Notify",
  "isActive": true
}
```

## 6. Action Config Examples

`EMAIL_SMTP`:

```json
{
  "type": "EMAIL_SMTP",
  "config": {
    "to": "user@example.com",
    "subject": "Hello {{customer.name}}",
    "bodyHtml": "<p>Order {{order.id}} confirmed</p>",
    "bodyText": "Order {{order.id}} confirmed"
  }
}
```

`OUTBOUND_WEBHOOK`:

```json
{
  "type": "OUTBOUND_WEBHOOK",
  "config": {
    "url": "https://example.com/hook",
    "method": "POST",
    "headers": {
      "x-api-key": "secret"
    },
    "body": {
      "event": "notify.execution"
    }
  }
}
```

## 7. Next Implementation Steps

1. Add auth + workspace RBAC.
2. Add trigger schedulers (cron, relative date, ICS sync).
3. Add template rendering from `Template` entity (today uses action-level content).
4. Add frontend management panel.
# NotifyEngine
