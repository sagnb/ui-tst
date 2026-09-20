# @relis/config

Single, typed, Zod-validated environment configuration contract shared by
`apps/web`, `apps/api`, `apps/worker`, `packages/database` (migrations),
and `tooling` (deployment). Each consumer imports only the loader for its
own process, so it never requires or receives configuration it doesn't
need.

## Variables

| Variable | Category | Secret | Required by | Validation |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | `core` | no | api, worker, web (server) | one of `development`, `test`, `production`; defaults to `development` |
| `PORT` | `network` | no | web server (default `3000`) | digits only, coerced to an integer in `1..65535`. `PORT=0` ("let the OS pick a free port") is intentionally rejected — the contract requires an explicit port. |
| `API_PORT` | `network` | no | api (default `3001`) | same validation as `PORT`. A **distinct** variable from `PORT`, not shared with the web server — see "API and web ports" below. |
| `DATABASE_URL` | `database` | **yes** | api, worker, migration | structurally validated with the WHATWG `URL` parser (not a prefix regex): scheme must be `postgres:` or `postgresql:`, and there must be a host — either a normal network host, or a non-empty Unix-socket `?host=/path` query parameter (Prisma's documented form for that case). An out-of-range port (e.g. `:99999`), an empty host (e.g. `postgresql://user:pass@`), an empty `host=` value, or a malformed opaque-path string (e.g. `postgresql:garbage`, which is not `scheme://...` at all) is rejected. |
| `NEXT_PUBLIC_API_URL` | `web-public` | no | web (browser) | absolute **http(s)** URL with a real host and **no embedded credentials**; inlined into the client bundle by Next.js at build time. `javascript:`, `file:`, and `user:pass@host` URLs are rejected. |

Every variable is declared once in `src/variables.ts`, including its
category and secrecy flag; process schemas in `src/processes/*.ts` compose
the subset each process actually needs.

## Process-specific contracts

| Process | Schema | Notes |
| --- | --- | --- |
| `api` | `apiSchema` (`src/processes/api.ts`) | `NODE_ENV` + `API_PORT` + `DATABASE_URL`. |
| `worker` | `workerSchema` (`src/processes/worker.ts`) | `NODE_ENV` + `DATABASE_URL`. No port at all — the worker has no HTTP surface. No queue/broker variable yet: `background_jobs` is still `undecided` (pg-boss vs. BullMQ) in `stack.yml`. |
| `web` (browser) | `webPublicSchema` (`src/processes/web.ts`) | Only `NEXT_PUBLIC_API_URL`. Never includes `DATABASE_URL` or any other secret. Import via `@relis/config/web-public`, not `@relis/config`. |
| `web` (server) | `webServerSchema` | `NODE_ENV` + `PORT`. Still no secrets — the Next.js server in this repository does not talk to the database directly. |
| `migration` | `migrationSchema` (`src/processes/migration.ts`) | `DATABASE_URL` only. Called for real by `packages/database`'s `pnpm run migrate` — see that package's README. |

`loadAllConfigs()` (`src/load-all.ts`) validates every process above
against the same environment and aggregates every failing variable across
every process into one `ConfigValidationError` (`process: "deploy"`),
instead of stopping at the first failure — used by the deployment gate in
`tooling/scripts/deploy.ts`, which needs to report everything wrong before
doing anything.

## API and web ports

The api and web server each have their **own** port variable (`API_PORT`,
`PORT`) rather than sharing one `PORT` between them. Originally both read
`PORT`, which meant that when a deployment runs both processes in the same
environment (as `tooling`'s deploy gate does) and something explicitly set
`PORT`, both processes resolved the *same* value and tried to bind the
same port. Distinct variable names make that structurally impossible.

`loadAllConfigs()` still additionally rejects the (now much narrower) case
where `API_PORT` and `PORT` are independently set to the same number —
a `CONFIG_CONFLICT` issue on both variables, since a plain
missing/invalid check on either schema in isolation can't see this; it
only becomes visible once every process's config is resolved together
(see `src/load-all.test.ts`).

`tooling/scripts/run-deploy.ts` also passes each service its own
already-resolved `API_PORT`/`PORT` value explicitly in that child's `env`,
rather than only relying on each process independently re-reading the
same ambient `process.env` — see that file and `tooling/README.md`.

## Build-time vs. runtime configuration (apps/web)

`NEXT_PUBLIC_API_URL` and `PORT`/`NODE_ENV` are validated at **different
times**, because they matter at different times:

- **`NEXT_PUBLIC_API_URL` is a build-time value.** Next.js inlines it
  literally into the compiled client JavaScript when you run `next build`
  (or on every recompile in `next dev`). Once built, that value is baked
  into the shipped bundle — changing the environment variable afterward,
  including at `next start` time, does **not** change what's already in
  the browser's JavaScript. So `apps/web/scripts/preflight.ts` validates it
  at `build` and at `dev`, but deliberately **not** at `start`.
- **`PORT`/`NODE_ENV` are runtime values.** They matter only to the
  running Next.js server process, so they're validated at `dev` and
  `start` (whenever a listener is about to open), not at `build`.

This distinction is enforced by `apps/web/scripts/preflight.ts` — see that
file and `relis/README.md` for how it gates `next dev`/`next build`/`next
start`, including why validating from inside the Next.js process
(`apps/web/src/instrumentation.ts`) alone is not sufficient (`PORT=0`
gets silently rewritten by Next before an in-process check can see the
original value).

`preflight.ts` also normalizes a repeated `--port`/`-p` CLI flag before
validating: Next itself keeps the *last* occurrence, so that's the value
validated, and every occurrence is then stripped from the arguments Next
actually receives, replaced with exactly one `--port <value>` — the exact
value that was validated, not whichever one Next's own duplicate-flag
resolution would otherwise pick. `start --port 41244 --port 0` is
therefore rejected outright (the effective value is `0`), not silently
started on whatever random port the OS happened to hand out.

## Usage

```ts
// apps/api/src/main.ts
import { loadApiConfig, ConfigValidationError } from "@relis/config";

try {
  const config = loadApiConfig(); // reads process.env
  // ... start the server with config.API_PORT / config.DATABASE_URL
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error(JSON.stringify(error.toSafeDiagnostics()));
    process.exit(1);
  }
  throw error;
}
```

```ts
// a client component in apps/web
import { loadWebPublicConfig } from "@relis/config/web-public";

const { NEXT_PUBLIC_API_URL } = loadWebPublicConfig();
```

Note: `loadWebPublicConfig()`'s default argument reads
`process.env.NEXT_PUBLIC_API_URL` as a **static member expression** — that
exact pattern is what Next.js's compiler recognizes and replaces with a
literal value for the client bundle. Don't refactor a caller to pass the
whole `process.env` object (or destructure it) instead of calling
`loadWebPublicConfig()` bare — that pattern is not something Next.js can
statically inline, and `process.env` isn't even defined in the browser at
runtime. `apps/web/src/shared/lib/public-config.build.test.ts` is a real
`next build` + bundle-content assertion (not just a schema-parsing test)
that guards against this regressing silently.

## Errors and diagnostics

A failed `load*Config()` call throws `ConfigValidationError`. Its `message`,
`issues`, and `toSafeDiagnostics()` only ever contain:

- the **variable name** (e.g. `DATABASE_URL`),
- its **category** (`core` | `network` | `database` | `web-public`), and
- a **stable code**: `CONFIG_MISSING`, `CONFIG_INVALID`, or `CONFIG_CONFLICT`
  (two otherwise-valid variables resolving to a conflicting combination —
  currently only `API_PORT`/`PORT` colliding on the same number; see
  "API and web ports" above).

The raw value is never read into any of these — safe to log or return from
an HTTP diagnostics endpoint as-is. This is verified against real rejected
values (including ones containing credentials) in `src/primitives.test.ts`
and `src/load-all.test.ts`, not just asserted in a comment.

## Deployment / CI validation

`src/cli.ts` is a standalone validation entry point:

```sh
pnpm --filter @relis/config check:env -- api
pnpm --filter @relis/config check:env -- worker
pnpm --filter @relis/config check:env -- web-public
pnpm --filter @relis/config check:env -- web-server
pnpm --filter @relis/config check:env -- migration
# from the repo root:
pnpm check:env -- api
```

Exits `0` with `{"status":"valid"}` or `1` with safe diagnostics. Targets
are looked up in a `Map`, not a plain object, so a prototype-derived name
(`toString`, `constructor`, `__proto__`, `hasOwnProperty`, ...) cannot be
silently "found" and treated as a validated process — it's rejected the
same as any other unknown target (see `src/cli.test.ts`).

This CLI alone is **not** the deployment integration for this repository —
it's a building block. The actual gate that gates build/migrate/start
behind validation is `tooling/scripts/deploy.ts`; see `relis/README.md`
and `tooling/README.md`.

## Example values

See `relis/.env.example` at the workspace root for safe, non-real sample
values for every variable above.
