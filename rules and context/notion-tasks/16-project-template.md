# 16 — Prepare and Provision an Isolated Project Database Template

## Source and usage

- Source: [Prepare and Provision an Isolated Project Database Template](https://app.notion.com/p/Prepare-and-Provision-an-Isolated-Project-Database-Template-3bc49936029380bfa661f166af65c367).
- Notion ID: `3bc49936029380bfa661f166af65c367`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: Build the Native Project Protocol Wizard.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Provision exactly one isolated PostgreSQL database per project by cloning a fixed template.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Prepare relis_project_template outside the creation flow, with a complete schema and no project data, credentials, or users.
2. Implement idempotent requests and status in the Control DB; derive the database identifier from the internal UUID.
3. In the worker, clone or reuse the database already created for the same project and verify connectivity/Prisma compatibility.
4. Do not run migrate deploy, db push, or schema changes during creation; categories and protocols create records only.
5. Record template release, job, safe failures, timestamps, and audit events; retries must not duplicate databases/projects/memberships.
6. Keep the project in provisioning until the wizard persists v1 and activates the membership/project; the API returns safe status only.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Two creations remain isolated and repeated requests reuse the same database.
- [ ] Creation runs no migrations or protocol-derived DDL.
- [ ] Partial failures can resume without premature activation.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

There is an explicit circular dependency with the wizard. Proposal: define a shared contract, implement the clone service, then orchestration. The source uses a pending Project Manager membership, conflicting with the wizard's protected PROJECT_OWNER.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
