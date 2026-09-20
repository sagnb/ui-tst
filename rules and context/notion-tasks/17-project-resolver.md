# 17 — Implement project database resolver

## Source and usage

- Source: [Implement project database resolver](https://app.notion.com/p/Implement-project-database-resolver-3b44993602938053a925e177bce47124).
- Notion ID: `3b44993602938053a925e177bce47124`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Resolve a verified, ready project's Prisma client on the server.

## Proposed prerequisites

- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Locate the existing database/platform package and the Control DB project registry.
2. Implement resolveProjectDatabaseClient using only an internal, previously authorized projectId.
3. Verify readiness and compatibility before accessing the Project DB.
4. Implement getProjectWorkspaceStatus and invalidateProjectClientCache.
5. Define client lifecycle/cache behavior and return safe unavailability when the workspace is not ready.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] A client-supplied database name or URL cannot determine the connection.
- [ ] A non-ready project exposes no database and returns safe status.
- [ ] Clients for different projects do not share data.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Data model, permissions, and acceptance criteria are empty in the source. The exact cache strategy is a technical decision; the checks below are proposed.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
