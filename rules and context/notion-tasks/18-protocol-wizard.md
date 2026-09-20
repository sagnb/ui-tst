# 18 — Build the Native Project Protocol Wizard

## Source and usage

- Source: [Build the Native Project Protocol Wizard](https://app.notion.com/p/Build-the-Native-Project-Protocol-Wizard-3ad4993602938018a7e5d9d1f1da71c4).
- Notion ID: `3ad4993602938018a7e5d9d1f1da71c4`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: Prepare and Provision an Isolated Project Database Template.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create a native React wizard with autosave, JSON import, and idempotent creation of the initial v1 protocol.

## Proposed prerequisites

- [06 — Complete job queue and progress platform](06-job-platform.md)
- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md)
- [17 — Implement project database resolver](17-project-resolver.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define a versioned Zod contract shared by Control DB JSONB drafts, JSON import, step validation, and final submission; drafts belong to their creator.
2. Implement an empty start or validated JSON that only prefills the wizard; importing creates no project, membership, job, or database.
3. Build identity fields: title, unique short name, description, and ordered questions. Build modules and optional sources/strategies with method, description, and an informational-only query.
4. Build Screening: reviewer count, decision/criteria conflicts, unanimity/majority, criteria, None/One/Any/All mode, and phases/fields; validation includes percentage, Info/Normal/Veto type, and independence.
5. Build QA with ordered questions, shared response scale, scores, and threshold; record the QA-validation conflict before implementing it.
6. Build Simple (boolean/integer/real/date/string/text), List (at least two options), DynamicList, and dependent categories, limits, defaults, regex, and subcategories. Use portable dependency keys.
7. Build Simple/Compare reports referencing valid categories and chart types; validate Screening Validation → Screening and Custom Charts → Data Extraction.
8. Implement autosave/resume/discard, final review, field errors, and confirmation. Enforce a unique short-name constraint; an optional Paper prefix is v1 configuration and its atomic counter is backend-managed.
9. In a Control DB transaction, reserve a PROVISIONING project, createdByUserId, a protected pending PROJECT_OWNER membership, and an outbox/job with an idempotency key.
10. Orchestrate template cloning, normalized v1 protocol CRUD, and activation only after success. Resume stages without duplicates; do not simulate a distributed transaction.
11. Export portable configuration without internal IDs/runtime data/secrets. Expose validating/provisioning/ready/failed and safe retry.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Drafts survive refresh and are accessible only to their owner or an authorized administrator.
- [ ] Invalid JSON produces no provisioning effects.
- [ ] Repeated confirmation creates one database, one project, and one v1.
- [ ] No category generates a table/column/migration; failure leaves no active incomplete project.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

There is a provisioning cycle; creator roles and creation permissions differ across tasks. UI options for QA validation and Screening validation scope conflict with runtime tickets; Bubble charts also conflict with Reporting. Do not invent resolutions. Editing an active protocol is outside this wizard's scope.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
