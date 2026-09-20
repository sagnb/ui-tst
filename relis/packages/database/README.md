# @relis/database

Minimal, real migration entry point for the **control** PostgreSQL
database (`stack.yml`: PostgreSQL + Prisma). This package intentionally
contains no domain models, business tables, or seed data — it exists to
satisfy "runtime config validation must gate migrations", not to implement
the control database's actual schema (a separate backlog task).

## What's here

- `prisma/control/schema.prisma` — a Prisma schema with a `datasource` and
  `generator` block and **zero models**. Enough for the Prisma CLI to be
  invoked against; not a data model.
- `src/migrate.ts` — `runMigration(deps?)`. Validates configuration via
  `loadMigrationConfig()` from `@relis/config` **before** creating any
  database client, opening a connection, or invoking Prisma. If validation
  fails, `runPrisma` is never called — no database activity happens at
  all. Dependencies (`loadConfig`, `runPrisma`) are injectable so this can
  be tested for ordering with spies, without a real Postgres instance.
- `src/run-migrate.ts` — the real CLI entry point: `process.exit(runMigration())`.
- `src/index.ts` — re-exports `runMigration`/`defaultRunPrisma` for
  programmatic use (the deployment gate in `tooling/` imports this
  directly rather than shelling out).

## Running it

```sh
# from this package:
pnpm run migrate
# from the repo root:
pnpm run migrate
```

Requires `DATABASE_URL` (control database). On success, runs
`prisma migrate deploy --schema prisma/control/schema.prisma`
non-interactively, using the already-validated connection string. On
missing/invalid configuration, exits non-zero with safe diagnostics
(variable name + category + code — never the value) and never reaches
Prisma at all.

## What this does NOT do

- No `project` schema (per-project databases, `stack.yml`'s
  `schema_strategy: [control, project]`) — that's the project-database
  resolver task, out of scope here.
- No domain tables/migrations were written; `prisma migrate deploy`
  against the current empty schema has nothing to apply.
- Ordering (validate-before-Prisma) is tested with a spied-out `runPrisma`,
  no real database involved. Separately, the real `prisma migrate deploy`
  command *was* invoked (via `pnpm deploy`, see `tooling/README.md`)
  against a deliberately unreachable local address, producing Prisma's own
  connection-refused error (`P1001`) — confirming the real CLI is wired up
  correctly, without touching any actual reachable database. Running it
  against a real, reachable database requires separate authorization.
