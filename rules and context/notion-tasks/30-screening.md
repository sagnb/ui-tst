# 30 — Implement Screening Assignment and Reviewer Decision Flow

## Source and usage

- Source: [Implement Screening Assignment and Reviewer Decision Flow](https://app.notion.com/p/Implement-Screening-Assignment-and-Reviewer-Decision-Flow-3b349936029380d8bb08efcfde18e9a5).
- Notion ID: `3b349936029380d8bb08efcfde18e9a5`.
- Source domain: Screening.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Implement a phase-scoped Screening workspace, assignments, and users' own decisions.

## Proposed prerequisites

- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [22 — Implement audit and undo UI](22-audit-undo.md)
- [24 — Implement Project Paper List](24-paper-list.md)
- [28 — Provide one CSV Import page organised into progressive sections.](28-csv-import.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Resolve effective configuration and Open/Closed state on the server; list phases and return null myCompletion/overallCompletion at this stage.
2. Create Dashboard/Papers/Screen/Assignments/Screening decisions navigation and tables with search, filters, sorting, and pagination.
3. List Papers as All/Included/Excluded/Pending/Under review/In conflict; reuse Paper Library details.
4. Owner/Manager/Admin previews and assigns to non-Guest members with reviewers per Paper and all/count; snapshot the count, Automatic/Manual mode, Normal type, and Paper/phase/assignee uniqueness.
5. Use active Papers in the first phase and permitted previous-phase output thereafter; changing reviewer count must not change existing assignments.
6. Create Screen next pending, configured fields, Source query highlighting, note, and Save and next. Validate None/One/Any/All inclusion and exclusion criteria when configured.
7. Only the assignee edits their own decision in an open phase; update assignment, outcome, and history. Cancellation/closure preserves data.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Users cannot decide for another user or an unassigned Paper.
- [ ] Closing blocks changes while preserving history.
- [ ] Configuration determines fields/input and decisions recalculate outcomes/conflicts.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Users and permissions prohibits Guests in the workspace; UI/API allow read access. Resolve this before releasing access. Project Settings supports other phase source-status options, while bulk assignment here restricts input to Included: reconcile eligibility. Paper editing is a dependency without a complete ticket in the inventory.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
