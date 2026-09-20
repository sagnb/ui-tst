# @relis/tooling

`scripts/deploy.ts` — the minimal, **local** deployment orchestration
entry point for this repository. No CI/CD platform, cloud provider, or
container/Docker architecture exists here yet (see the root README's
"Known gaps"), so this Node script is the deployment integration for now,
per the task's "a minimal local deployment orchestration command is
acceptable if no deployment infrastructure exists."

## What it does, in order

1. **Validate.** `loadAllConfigs()` (from `@relis/config`) validates every
   process involved — api, worker, web server, web public, migration — as
   one aggregated pass, and reports every failing variable at once,
   including a cross-process conflict if `API_PORT` and `PORT` resolve to
   the same number. This runs before anything else; on failure, safe
   diagnostics go to stderr and the process exits non-zero without
   touching the filesystem, a database, or a port. The resolved configs
   are threaded through every step below — nothing downstream re-derives
   its own config independently from scratch.
2. **Build the web app.** Runs `apps/web`'s own preflight-gated `build`
   (`tsx apps/web/scripts/preflight.ts build`), passing the already-
   validated `NEXT_PUBLIC_API_URL` explicitly — this is where it gets
   embedded into the client bundle. Stops here (propagating the exit code)
   if it fails.
3. **Migrate.** Calls `runMigration()` from `@relis/database` in-process —
   the control database's only side effect that writes anything. Stops
   here if it fails.
4. **Start services, then monitor them.** Spawns `apps/api`,
   `apps/worker`, and `apps/web` (through its own preflight, `start` mode
   — not `next start` directly, so it still re-validates server config
   before opening a listener). Each child gets its **own** explicit env
   (`API_PORT`/`PORT`/`DATABASE_URL`/`NODE_ENV` set from the already-
   resolved config for that process specifically), not a blind copy of
   the parent's ambient environment. This step does not return once
   services are up — it stays running and:
   - if any service's process fails to even spawn, or exits unexpectedly,
     every other service is stopped immediately and the deploy exits with
     a nonzero code (the failing service's own exit code, when there is
     one);
   - if the deploy process itself receives SIGINT/SIGTERM, every service
     is stopped and the deploy exits `0` — a clean, requested shutdown,
     not a failure.

Steps 1–3 are injectable (`DeployDeps` in `scripts/run-deploy.ts`), so
ordering and short-circuit-on-failure is tested with spies
(`scripts/run-deploy.test.ts`) — no real build, database, or running
service required for that. The monitoring logic in step 4
(`runServiceGroup`, also exported from `run-deploy.ts`) is tested for
real, with small real child processes standing in for api/worker/web (not
mocked away) — a service exiting nonzero, a service failing to spawn at
all, and a synthetic SIGINT are each verified to actually terminate the
other running processes (checked by PID liveness, not just the return
code) and resolve with the right exit code.
`scripts/deploy.startup.test.ts` separately runs the **real** `deploy.ts`
command end-to-end with missing/invalid/conflicting configuration and
asserts it exits non-zero before any build/migrate/start side effect
(checked by asserting none of their telltale output ever appears).

## Running it

```sh
# from this package:
pnpm run deploy
# from the repo root:
pnpm run deploy
```

## What this does NOT do

- Does not introduce a cloud provider, CI/CD platform, or Docker/container
  architecture — none is prescribed, and the task explicitly says not to
  add one unless necessary.
- Was never run against a real, reachable database, and no service was
  left actually accepting real traffic during this change. What *was*
  run for real: a full `pnpm deploy` with a valid, distinct-port
  configuration against a deliberately unreachable local address —
  confirming the build step actually runs `next build` for real, and that
  a migration connection failure (Prisma's own `P1001`) correctly stops
  the deploy before any service starts. Running it against a real,
  reachable database/deployment target needs separate authorization.
