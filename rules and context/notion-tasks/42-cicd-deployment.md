# 42 — Complete CI/CD and production deployment specification

## Source and usage

- Source: [Complete CI/CD and production deployment specification](https://app.notion.com/p/Complete-CI-CD-and-production-deployment-specification-3b4499360293806a917ff0c8526bd3d6).
- Notion ID: `3b4499360293806a917ff0c8526bd3d6`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Document repeatable deployment and configure quality and recovery gates.

## Proposed prerequisites

- [02 — Add Docker Compose local stack](02-docker-compose.md)
- [03 — Create control Prisma schema](03-control-prisma.md)
- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)
- [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md)
- [22 — Implement audit and undo UI](22-audit-undo.md)
- [41 — Implement backup/restore and hardening](41-backup-hardening.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create baseline CI early using actual scripts: lint, typecheck, tests, Prisma migration checks, parity, and container smoke tests.
2. Document web/API/worker, Control/Project PostgreSQL, object storage, proxy, mail, and backups.
3. Externalize secrets and document rotation without leakage into logs/artifacts.
4. Define a release runbook with Control/Project migrations, template publication, compatibility, job draining, and health/readiness.
5. Document backup, rollback, incident recovery, and isolation verification without exposing data.
6. Rehearse the runbook in a test environment and record results; actual deployment is separate from writing this guide.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Gates prevent release without required checks.
- [ ] Release verifies compatibility for each workspace.
- [ ] Runbooks cover failure/migration/rollback and external secrets.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Basic CI should start early; this position represents operational completion. Updating templates/migrating databases is a release process, never part of end-user project creation.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
