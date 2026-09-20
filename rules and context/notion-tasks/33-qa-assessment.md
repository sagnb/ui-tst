# 33 — Implement Quality Assessment Assignment and Assessment Flow

## Source and usage

- Source: [Implement Quality Assessment Assignment and Assessment Flow](https://app.notion.com/p/Implement-Quality-Assessment-Assignment-and-Assessment-Flow-3b3499360293801b86c4fd3011316bb5).
- Notion ID: `3b3499360293801b86c4fd3011316bb5`.
- Source domain: Quality Assessment.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Assign QA and record shared-scale responses, with one active assignment per Paper.

## Proposed prerequisites

- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [24 — Implement Project Paper List](24-paper-list.md)
- [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Resolve the existing QA configuration; this task does not edit questions/scales/thresholds.
2. Create an Open/Closed workspace with Dashboard/Papers/Assess/Assignments/Assessed/Results; Guests have read-only access.
3. Owner/Manager/Admin opens/closes and creates/cancels assignments; preview includes final Screening-included Papers, or active non-excluded Papers without Screening, not already assessed/assigned.
4. Distribute evenly among non-Guest members and persist the run/assignments.
5. Implement the caller's next Paper, preview, ordered questions, and Save and next; require a valid response to every active question.
6. Calculate the score sum on the server and mark completion/outcome; only the assignee edits while QA is open.
7. Display searchable/sortable/paginated tables; incomplete scores are —. Closing preserves everything and blocks mutations.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Assessors cannot complete another user's assignment.
- [ ] Completion requires every response and a correct score sum.
- [ ] Closing blocks assignments/edits without deleting responses.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The description mentions optional QA-validation settings, but another ticket excludes validation runtime from scope. Do not add that workflow to this task.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
