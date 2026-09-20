# 37 — Implement Classification Results and Reporting Charts

## Source and usage

- Source: [Implement Classification Results and Reporting Charts](https://app.notion.com/p/Implement-Classification-Results-and-Reporting-Charts-3b349936029380e7b9eceeaec3bd7a1a).
- Notion ID: `3b349936029380e7b9eceeaec3bd7a1a`.
- Source domain: Reporting & Export.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Display project-scoped classification results and configured charts in read-only mode.

## Proposed prerequisites

- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [35 — Implement Classification Assignment and Classification Workspace](35-classification.md)
- [36 — Implement the data extraction dashbord and progess](36-classification-progress.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create an active-classification list with key/title and server-derived category/subcategory columns.
2. Implement key/title search, value filters, allowed sorting, and pagination; titles reuse details.
3. Load only active chart definitions from Settings: Simple by one category and Comparative by two, with selected Pie/Bar/Line types.
4. Calculate from active classifications and provide an accessible table using the same data.
5. Multi-value charts count each selected value and may exceed total/100%; do not offer per-value click-through in this case.
6. Single-value charts open filtered results; invalid categories produce warnings and Settings links for authorized users.
7. Reuse existing definitions/data without snapshots, files, jobs, publication, or chart history.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Data and charts are project-isolated.
- [ ] Tables and charts use the same dataset and server-side definitions.
- [ ] Invalid configuration does not produce misleading charts.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria require All/Processed/Pending/Assigned to me/Excluded dashboard counts, but the API prohibits them. Settings/Wizard allow Bubble while this page allows only Pie/Bar/Line. Do not mark full acceptance without resolving both.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
