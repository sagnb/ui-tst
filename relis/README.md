# relis

pnpm workspace monorepo for the ReLiS application, following
[`../rules and context/project-structure.md`](../rules%20and%20context/project-structure.md)
and [`../rules and context/stack.yml`](../rules%20and%20context/stack.yml).

This is a minimal foundation created to support runtime configuration
validation (see `packages/config`), plus the smallest real migration and
deployment entry points needed to gate them on that validation. It
intentionally does not yet include a real database schema, job queue,
storage, auth, or CI/CD pipeline — those are separate backlog items and
out of scope here.

## Layout

```
relis/
├─ apps/
│  ├─ web/       Next.js App Router frontend. Shared layout + home page only,
│  │             adapted from v1/. dev/build/start all run through
│  │             scripts/preflight.ts (see below), not `next` directly.
│  ├─ api/       Hono API. Entry point + health/readiness routes only — no
│  │             business modules yet.
│  └─ worker/    Minimal worker process shell — no job/queue processing yet.
├─ packages/
│  ├─ config/    Shared, Zod-validated environment configuration contract
│  │             used by web, api, worker, migration, and deployment.
│  │             See packages/config/README.md.
│  └─ database/  Minimal, real Prisma migration entry point for the control
│                database (no domain models). See packages/database/README.md.
├─ tooling/
│  └─ scripts/   deploy.ts — the local deployment orchestration gate.
│                See tooling/README.md.
├─ .env.example
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

## Scripts (run from `relis/`)

```sh
pnpm install
pnpm typecheck   # tsc --noEmit in every package/app
pnpm test        # vitest run in every package/app
pnpm build       # build every package/app (apps/web's build validates NEXT_PUBLIC_*)
pnpm dev         # run web/api/worker dev servers in parallel
pnpm check:env -- <process>   # validate one process's env without starting it
pnpm migrate     # validate migration config, then run control-DB migrations
pnpm deploy      # validate everything, then build web -> migrate -> start services
```

Or scope any of the above to one project: `pnpm --filter @relis/api run test`.

## Environment configuration

Every process validates its own required environment variables before doing
any operational work (accepting HTTP traffic, processing jobs, running
migrations, or starting a deployment), through the shared contract in
`packages/config`. See:

- `packages/config/README.md` — variables, categories, per-process
  requirements, error codes, and the build-time-vs-runtime distinction for
  `apps/web`.
- `.env.example` — safe example values (no real credentials).

## apps/web: why `dev`/`build`/`start` go through `scripts/preflight.ts`

`apps/web/package.json`'s `dev`/`build`/`start` scripts run
`tsx scripts/preflight.ts <mode>`, not `next <mode>` directly.
`preflight.ts` validates configuration and only then spawns `next` as a
child process — validation happens **before** Next.js is even started, not
from inside it. This matters for two concrete bugs that validating only
from `apps/web/src/instrumentation.ts` (which still runs too, as a
secondary safety net) could not catch:

- **`PORT=0`.** Node/Next treat `PORT=0` as "ask the OS for any free port"
  and overwrite `process.env.PORT` with whatever they got — *before*
  `instrumentation.ts` (which runs inside the already-started Next process)
  gets a chance to see the original `"0"` and reject it per the contract's
  minimum-port rule. `preflight.ts` validates the raw/effective `PORT`
  (env var or a `-p`/`--port` CLI override — same precedence Next itself
  uses) strictly before Next is spawned at all, so the original invalid
  value is what actually gets checked.
- **A listener opening before rejection.** Refusing to spawn `next` at all
  on invalid configuration means no TCP listener ever opens, full stop —
  there's no window where Next has already started accepting connections
  before an in-process check can reject and exit.

`preflight.ts` also applies the build-time-vs-runtime distinction
documented in `packages/config/README.md`: `build` validates only
`NEXT_PUBLIC_API_URL` (it never opens a listener), `dev` validates both
public and server config (it does both on every run), and `start`
validates only server config (`PORT`/`NODE_ENV`) — **not**
`NEXT_PUBLIC_API_URL`, because by `start` time that value is already
embedded in the built client bundle and re-checking it at runtime would
incorrectly imply that changing it now could change already-shipped
browser JavaScript.

`preflight.ts` also normalizes a repeated `--port`/`-p` flag: it validates
the *last* occurrence (matching Next's own precedence) and strips every
occurrence from what's actually passed to `next`, replacing it with
exactly the one validated value — so `next start --port 41244 --port 0`
can't validate one value and let Next itself resolve to another.

## apps/api and apps/web: separate ports

The api and web server each read their own port variable — `API_PORT` for
the api, `PORT` for the web server — instead of sharing one `PORT`. They
used to share it, which meant that when both ran in the same environment
(as a local deploy does) and `PORT` was set explicitly, both processes
resolved to the identical value and tried to bind the same port.
`loadAllConfigs()` (used by the deploy gate) still separately rejects the
narrower case where `API_PORT` and `PORT` are independently set to the
*same* number, as a `CONFIG_CONFLICT`. See `packages/config/README.md`.

## Migration and deployment entry points

- **Migration**: `packages/database`'s `pnpm run migrate` (also `pnpm
  migrate` from the root) validates `DATABASE_URL` via
  `loadMigrationConfig()` before creating any database client or invoking
  Prisma, then runs `prisma migrate deploy` against a minimal, model-free
  control schema. See `packages/database/README.md`.
- **Deployment**: `tooling`'s `pnpm run deploy` (also `pnpm deploy` from
  the root) is the local deployment orchestration gate: validate every
  process at once (including the `API_PORT`/`PORT` conflict check) → build
  the web app (embeds `NEXT_PUBLIC_*`) → run migrations (the first
  data-writing action) → start api/worker/web, each with its own
  explicitly-passed, already-resolved config (not a blind copy of the
  parent's ambient environment). Once services are up, the deploy process
  monitors them: if any one fails to start or exits unexpectedly, every
  other service is stopped and the deploy exits nonzero; if the deploy
  process itself is interrupted (SIGINT/SIGTERM), every service is stopped
  and it exits `0`. See `tooling/README.md`.

Neither was run against a real, reachable database or deployment target as
part of this change. What *was* run for real: the full `pnpm deploy`
pipeline with valid, non-conflicting configuration pointed at a
deliberately unreachable local address — confirming the build step really
runs `next build`, and that the resulting Prisma connection failure
(`P1001`) correctly stops the deploy before any service starts. The
service-monitoring logic (`runServiceGroup`) is also tested with small
real child processes, not mocked away — see `tooling/README.md`. Running
either against a real, reachable database/deployment target needs
separate authorization.

## Why api/worker run via `tsx`, not compiled `dist/`

`@relis/config` ships as TypeScript source (consumed directly by `tsx` in
apps/api and apps/worker, and by Next.js in apps/web via
`transpilePackages`). No bundler is mandated for the backend in
`stack.yml`, so `apps/api`/`apps/worker`'s `build` script only type-checks
(`tsc --noEmit`) and `start` runs the TypeScript source directly through
`tsx` — the same way `dev` does. A plain `tsc`-to-`dist/` + `node dist/main.js`
pipeline was tried first and does not work as-is: Node's ESM loader cannot
resolve the extensionless relative imports inside `@relis/config`'s
TypeScript source, so `node dist/main.js` fails with `ERR_MODULE_NOT_FOUND`
unless `@relis/config` is also compiled to a separate `dist/`. Using `tsx`
for both dev and start avoids that extra build target.

## Known gaps

- **Migration**: only the control database has a (model-free) schema and a
  migration entry point. The `project` schema (`stack.yml`'s
  `schema_strategy: [control, project]`, per-project databases) is a
  separate, unimplemented task (the project-database resolver).
- **Deployment**: no CI/CD platform, cloud provider, or Docker/container
  architecture exists — `tooling/scripts/deploy.ts` is a local
  orchestration script, not a pipeline. It was authorized and built as
  exactly that ("a minimal local deployment orchestration command"), not
  as a substitute for a future CI/CD task.
- **apps/web**: only the shared layout and home/dashboard page were ported
  from `v1/`; all other v1 pages (login, screening, quality assessment,
  data extraction, reports) were intentionally not migrated. The home page
  renders mock data (`mock-dashboard-data.ts`) — there is no real
  auth/session or papers API to source it from yet.
