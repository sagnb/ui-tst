# 38 — Implement Reporting Authors and Venues

## Source and usage

- Source: [Implement Reporting Authors and Venues](https://app.notion.com/p/Implement-Reporting-Authors-and-Venues-3d0499360293805ab652df6cf7e6c32b).
- Notion ID: `3d0499360293805ab652df6cf7e6c32b`.
- Source domain: Reporting & Export.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Report authors and venues exclusively from reportable Papers.

## Proposed prerequisites

- [25 — Implement Authors and Affiliations Directory](25-authors-affiliations.md)
- [26 — Implement Venue Directory](26-venues.md)
- [34 — Implement QA Results, Low-quality Exclusion, and Progress](34-qa-results.md)
- [35 — Implement Classification Assignment and Classification Workspace](35-classification.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define reportable: active, non-excluded, completed saved classification/extraction; enabled QA requires a final Included outcome.
2. Create authorized, project-scoped, read-only queries with server-side search, sorting, and pagination.
3. Authors: include only reportable links and distinguish Included Papers from First-author Papers using author order.
4. Venues: group reportable Papers by venue and year.
5. Create tables without Add/Edit/Delete; reuse Author/PaperAuthor/Venue/Paper/classification/QA outcome without dedicated reporting tables.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Pending/excluded/incomplete Papers are not included.
- [ ] First-author and venue/year counts are correct.
- [ ] Guests can read but receive no editing actions.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

No specific contradiction is highlighted in this summary. Cross-cutting decisions in the pending-decisions register still apply. Empty source fields do not authorize expanding scope.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
