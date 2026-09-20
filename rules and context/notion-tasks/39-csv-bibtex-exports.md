# 39 — Implement CSV and BibTeX Reporting Exports

## Source and usage

- Source: [Implement CSV and BibTeX Reporting Exports](https://app.notion.com/p/Implement-CSV-and-BibTeX-Reporting-Exports-3b349936029380cd93b2d6447bdbbce0).
- Notion ID: `3b349936029380cd93b2d6447bdbbce0`.
- Source domain: Reporting & Export.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Generate and stream CSV/BibTeX directly without storing exported files.

## Proposed prerequisites

- [24 — Implement Project Paper List](24-paper-list.md)
- [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md)
- [35 — Implement Classification Assignment and Classification Workspace](35-classification.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define operations by export type, authorized within the current project; reject client-supplied paths or filenames.
2. Create cards for Papers CSV; Screening exclusions CSV; Classification exclusions CSV; Classification/Data Extraction results CSV; and All/Included/Excluded BibTeX.
3. Resolve scope on the server: active Papers; final Screening exclusions; Classification exclusions; active saved classifications; stored BibTeX and current outcomes.
4. CSV includes the specified fixed fields: key/title/DOI/URL/preview/abstract/year and, depending on the export, exclusion actor/criterion/note or extracted values.
5. Generate UTF-8 with separator/quote/newline escaping; stream directly and display generation status/safe errors on the client.
6. Audit type, actor, timestamp, and count; create no job, artifact history, expiry/revoke flow, or persisted URL.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Each scope exports only the correct project dataset.
- [ ] Files download immediately and are not retained.
- [ ] No predictable-path download or export job exists.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Users and permissions says every application user, but the API requires project/export permission. Define whether this includes members/Guests or public projects. This task conflicts with generic jobs/storage expectations; follow its specific contract after recording the decision.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
