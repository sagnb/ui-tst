# 22 — Implement audit and undo UI

## Source and usage

- Source: [Implement audit and undo UI](https://app.notion.com/p/Implement-audit-and-undo-UI-3b449936029380e38ea4d724f7f70e22).
- Notion ID: `3b449936029380e38ea4d724f7f70e22`.
- Source domain: Administration & Configuration.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Provide append-only auditing and safe compensation for registered operations.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [20 — Implement Project Workspace Navigation and Home Dashboard](20-project-workspace.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define a shared envelope: actor, scope, project, action, target, outcome, correlation ID, timestamp, schema version, and redacted metadata.
2. Integrate recordAuditEvent into sensitive Control/Project DB mutations; do not store credentials or raw requests.
3. Implement searchAuditEvents, getAuditEventDetail, and exportAuditEvents with filters and audited global or project-restricted access.
4. Create OperationBatch/CompensatingAction and explicitly registered handlers; listUndoableOperations explains eligibility and dependencies.
5. Implement previewCompensatingAction/executeCompensatingAction with a reason, revalidation, and a transaction or idempotent job.
6. Create Audit log and Undo centre; imports and unstarted batches can be compensated only when protected downstream work will not be destroyed.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Sensitive events are structured and immutable.
- [ ] Compensation preserves history and creates auditable links.
- [ ] No UI/API reproduces legacy clear logs behavior.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The audit foundation is required from the earliest mutations; this guide's position refers to the complete UI and compensation functionality. Project Admin and Owner require an approved mapping; Managers do not implicitly receive audit/undo access.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
