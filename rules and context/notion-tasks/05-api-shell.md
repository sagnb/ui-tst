# 05 — Implement API app shell

## Source and usage

- Source: [Implement API app shell](https://app.notion.com/p/Implement-API-app-shell-3b449936029380fa908becac920f75cf).
- Notion ID: `3b449936029380fa908becac920f75cf`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Complete the Hono server with routes, typed contracts, validation, stable errors, readiness, and observability.

## Proposed prerequisites

- [01 — Implement runtime config validation](01-runtime-config.md)
- [03 — Create control Prisma schema](03-control-prisma.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Verify the stated baseline: Hono, CORS, GET /, and GET /health.
2. Organize route registration/versioning, contracts, and input validation.
3. Add request IDs, structured logs, and error mapping for validation, authentication, authorization, not found, conflict, and internal errors.
4. Define authentication, policy, and project-context integration points; integrate real implementations in their respective tasks.
5. Separate health from readiness; include OpenAPI/contract generation only if selected for the project.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Errors have stable codes and messages suitable for localization.
- [ ] Readiness reflects dependencies and errors do not leak internal details.
- [ ] Protected routes do not become public because an integration is temporarily missing.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Data model and acceptance criteria are empty. Users and permissions repeats UI-related text and therefore does not provide a permission matrix.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
