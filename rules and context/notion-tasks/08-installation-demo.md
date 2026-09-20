# 08 — Seed installation and demo data

## Source and usage

- Source: [Seed installation and demo data](https://app.notion.com/p/Seed-installation-and-demo-data-3b44993602938006837fc7cf286a2bf5).
- Notion ID: `3b44993602938006837fc7cf286a2bf5`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Install the Control DB and first administrator idempotently, with optional non-production demo data.

## Proposed prerequisites

- [01 — Implement runtime config validation](01-runtime-config.md)
- [02 — Add Docker Compose local stack](02-docker-compose.md)
- [03 — Create control Prisma schema](03-control-prisma.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Implement getInstallationStatus, validateInstallationEnvironment, and initializeControlPlane with guards against concurrent or repeated initialization.
2. Apply the Control DB schema and create the first Application Administrator, required settings, and installation state/version.
3. Create a protected first-run screen with validation, administrator creation, progress, and one-time completion; disable public setup afterward.
4. Integrate seedOptionalDemoData only after the normal creation/provisioning flow in guides 16 and 18 is ready.
5. Create demo data in a separate Project DB, clearly marked as non-production, and audit setup; do not depend on an external editor, DSL, or Tomcat.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] A clean environment finishes with a first administrator account.
- [ ] Re-execution/concurrency does not duplicate installation.
- [ ] Demo data is optional and uses normal isolated provisioning.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Run bootstrap after the Control schema and before validating login end to end; complete demo seeding after the wizard. This two-stage split is a planning proposal to avoid an artificial dependency cycle.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
