# 06 — Complete job queue and progress platform

## Source and usage

- Source: [Complete job queue and progress platform](https://app.notion.com/p/Complete-job-queue-and-progress-platform-3b449936029380bcb3fff8a281966d35).
- Notion ID: `3b449936029380bcb3fff8a281966d35`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Complete the shared job platform with pg-boss, progress, retry, cancellation, and idempotency.

## Proposed prerequisites

- [02 — Add Docker Compose local stack](02-docker-compose.md)
- [03 — Create control Prisma schema](03-control-prisma.md)
- [05 — Implement API app shell](05-api-shell.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Verify apps/worker and the pg-boss dependency mentioned in Notion.
2. Implement enqueueJob, getJobStatus, listJobs, retryJob, cancelJob, and handler registration.
3. Keep pg-boss tables in the Control DB and metadata for actor, project, progress, safe error, correlation ID, results, and idempotency key.
4. Carry opaque IDs and references in payloads; resolve credentials on the server.
5. Create the Jobs page and queued/running/completed/failed/cancelled status component; restrict visibility by role and scope.
6. Validate retry/cancel and worker failures without duplicating effects in consuming tasks.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Modules enqueue idempotent jobs through one shared API.
- [ ] Global administrators, project administrators, and other users see only authorized jobs.
- [ ] Retries and cancellations do not duplicate provisioning, imports, or exports.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

stack.yml leaves pg-boss/BullMQ undecided, but Notion selects pg-boss. Record the decision before implementation. Direct CSV/BibTeX/Python/R exports have their own requirements prohibiting jobs.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
