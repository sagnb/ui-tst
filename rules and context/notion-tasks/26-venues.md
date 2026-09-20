# 26 — Implement Venue Directory

## Source and usage

- Source: [Implement Venue Directory](https://app.notion.com/p/Implement-Venue-Directory-3c6499360293809087fff284e927dd22).
- Notion ID: `3c6499360293809087fff284e927dd22`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Manage project-scoped venues with a full name and optional year.

## Proposed prerequisites

- [24 — Implement Project Paper List](24-paper-list.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Reuse Venue and the optional Paper reference in the fixed schema.
2. Implement list/create/update/delete for unreferenced venues, verifying project and role.
3. Create the Full venue name | Publication year | Actions table with search, pagination, and sorting.
4. Allow Edit mode and new rows for Owner/Manager/Admin; validate the required name and submitted fields.
5. Block deletion when a Paper references the venue; audit creation/updates and preserve shared references.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Read access is project-isolated.
- [ ] Inline edits persist and appear on linked Papers.
- [ ] Reviewers/Validators/Guests cannot modify venues; referenced venues cannot be deleted.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

No specific contradiction is highlighted in this summary. Cross-cutting decisions in the pending-decisions register still apply. Empty source fields do not authorize expanding scope.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
