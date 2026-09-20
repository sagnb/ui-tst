# 03 — Create control Prisma schema

## Source and usage

- Source: [Create control Prisma schema](https://app.notion.com/p/Create-control-Prisma-schema-3b4499360293800a83d1cb4880f40e10).
- Notion ID: `3b4499360293800a83d1cb4880f40e10`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Implement the versioned Control DB schema in the existing database package, exposing repository and use-case interfaces.

## Proposed prerequisites

- [01 — Implement runtime config validation](01-runtime-config.md)
- [02 — Add Docker Compose local stack](02-docker-compose.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Locate @relis/database in the target repository; Notion states it already exists, but this must be verified.
2. Consolidate identity, session, project, membership, invitation, draft, job, and audit contracts from the consuming tasks.
3. Resolve the PROJECT_OWNER/PROJECT_ADMIN discrepancy before finalizing identity and membership enums and constraints.
4. Create the PostgreSQL schema, static migrations, and Control DB Prisma client.
5. Expose typed repositories; do not publish generic CRUD or raw database access.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Migrations apply to an empty database and the Prisma client is generated.
- [ ] Uniqueness constraints required by consuming tasks are verified.
- [ ] Review runtime data remains separated by Project DB.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The source does not specify entities in Data model or provide acceptance criteria. The entity list and checks synthesize consuming tasks; they are not an approved schema.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
