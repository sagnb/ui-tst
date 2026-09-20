# 36 — Implement the data extraction dashbord and progess

## Source and usage

- Source: [Implement the data extraction dashbord and progess](https://app.notion.com/p/Implement-the-data-extraction-dashbord-and-progess-3b349936029380fe8313d1b51f856f4c).
- Notion ID: `3b349936029380fe8313d1b51f856f4c`.
- Source domain: Data Extraction.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Display personal/global classification dashboards and progress.

## Proposed prerequisites

- [35 — Implement Classification Assignment and Classification Workspace](35-classification.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create Hono dashboard/progress reads calculated on the server per project.
2. Personal: active, non-excluded assignments, completed and pending; remove cancelled/reassigned work from the former assignee.
3. Global: active eligible non-excluded Papers, classified Papers with active records, and pending Papers; eligibility considers QA, Screening, or library.
4. Create All/Classified/Pending/gauge cards and Completed/Assigned bars by member, plus Total Classified/Eligible.
5. Reassigned work remains pending for the new assignee until saved/confirmed, according to this task's API rule.
6. Create Assign/Classify/Progress actions and Results Coming soon until Reporting integration; show empty states and Guest read-only access.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Excluded Papers do not count in totals.
- [ ] Reassigned/cancelled assignments leave the former assignee's workload.
- [ ] The global total matches the global card and does not use the personal denominator.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The reassignment rule conflicts with the classification workspace's lists. Personal assignment-based progress and global Paper-based progress intentionally differ; define confirmation of existing classifications before integration.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
