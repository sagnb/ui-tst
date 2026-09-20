# 31 — Implement Screening Conflict Resolution and Validation Workspaces

## Source and usage

- Source: [Implement Screening Conflict Resolution and Validation Workspaces](https://app.notion.com/p/Implement-Screening-Conflict-Resolution-and-Validation-Workspaces-3b34993602938049bbc5ff5867cd9e82).
- Notion ID: `3b34993602938049bbc5ff5867cd9e82`.
- Source domain: Screening.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Resolve conflicts and perform optional Screening validation while preserving history.

## Proposed prerequisites

- [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Resolve phase overrides or project defaults; reject mutations while the phase is closed.
2. Add results/assignments/history to conflicting Paper details; Owner/Manager/Admin can edit authorized conflicting decisions, while assignees edit only their own.
3. Allow manual Add reviewer for non-Guests with Normal/Veto/Info and a note; recalculate outcomes after decisions.
4. Implement Decision/Criteria and Unanimity/Majority rules; ties remain conflicts, and an Exclude majority with different criteria remains conflicted when conflict type is Criteria.
5. Create Validation only when enabled: Assign validation, Validate, assignments, and results, with member read access according to the resolved policy.
6. Preview uses final Excluded Papers, all_excluded or excluded_by_criteria scope, percentage, and uniform sampling; distribute among Owner/Manager/Validator, excluding Reviewer/Guest and enforcing independence.
7. Keep the validated preview set fixed; return an updated preview if eligibility changes. The run's percentage does not change phase configuration.
8. Reuse Screen for the caller's validation decision with server-resolved Info/Normal/Veto type; cancelling an existing decision requires confirmation and audited revocation.
9. Persist run/configuration snapshot/idempotency, assignments, decisions, and history; conflicts are derived outcomes, not a separate table.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Editing and assignment permissions are enforced.
- [ ] Sampling and confirmation use the validated set.
- [ ] Validation/revocation recalculates outcomes without erasing history.
- [ ] Guests never mutate data and Reviewers cannot receive validation assignments.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The wizard offers Included/Excluded/both, but this task limits validation to final Excluded Papers. Multiple Veto/Info/Normal semantics must be specified if the existing code/contract does not define them.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
