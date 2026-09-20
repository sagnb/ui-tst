# 34 — Implement QA Results, Low-quality Exclusion, and Progress

## Source and usage

- Source: [Implement QA Results, Low-quality Exclusion, and Progress](https://app.notion.com/p/Implement-QA-Results-Low-quality-Exclusion-and-Progress-3b3499360293807cb062eb1fa66195b3).
- Notion ID: `3b3499360293807cb062eb1fa66195b3`.
- Source domain: Quality Assessment.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Display QA progress/results and bulk-exclude assessed Papers below the cut-off after confirmation.

## Proposed prerequisites

- [33 — Implement Quality Assessment Assignment and Assessment Flow](33-qa-assessment.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Reuse assignments/responses/outcomes; calculate score, cut-off status, and personal/global progress on the server.
2. Create cards and member/Total bars, a Paper key | Title | Score | Assessed table, search/filter/sorting/pagination, and a visible cut-off.
3. Titles open existing assessments, read-only where required; incomplete scores are — and the indicator appears only for completed assessments.
4. Implement a preview of completed, non-excluded Papers below the current cut-off; show impact and the exact set.
5. Owner/Manager/Admin confirms that same validated set; preserve Screening outcomes and record run/item/cut-off snapshot/actor/timestamp.
6. Do not automatically exclude by score; document the pending decision before implementing individual exclusion/restoration.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] A low score does not automatically exclude a Paper.
- [ ] Confirmation affects only previewed Papers.
- [ ] Counts and read models are isolated and exclusions are audited.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Direct conflict: description/UI require individual exclusion and restoration; the final Acceptance criteria prohibit both and QA validation. UI contains an additional conflicting Data model/Acceptance criteria block. This guide's checklist covers only the uncontested core; full acceptance requires a decision.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
