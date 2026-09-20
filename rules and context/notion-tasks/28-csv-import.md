# 28 — Provide one CSV Import page organised into progressive sections.

## Source and usage

- Source: [Provide one CSV Import page organised into progressive sections.](https://app.notion.com/p/Provide-one-CSV-Import-page-organised-into-progressive-sections-3b3499360293805c916ac3d84dc191ec).
- Notion ID: `3b3499360293805c916ac3d84dc191ec`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Configure, validate, and asynchronously import CSV from an existing uploaded ImportBatch.

## Proposed prerequisites

- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [24 — Implement Project Paper List](24-paper-list.md)
- [27 — Implement Secure Import Storage and Project Job Progress](27-import-intake.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Open a Queued batch and inspect its existing temporary file; detect separator, encoding, and headers and allow adjustments/first data row selection.
2. Create a limited preview and mapping: Title required; optional key, DOI, URL, year, abstract, BibTeX, keywords, authors, and venue.
3. Offer independent optional active Source and Strategy selectors; apply them to the entire batch.
4. Validate rows and display numbered errors. Allow mapping corrections, cancellation/file replacement, or explicitly confirmed ignoring of invalid rows.
5. Save persists option/mapping/metadata/choice snapshots and creates one idempotent job.
6. The worker reparses/revalidates, generates missing keys using a prefix/atomic counter, and atomically creates valid Papers plus the final batch result in the Project DB.
7. Persist total/valid/invalid/created/ignored counts and ImportBatchIgnoredRow only for invalid rows actually ignored.
8. Allow cancellation before commit; delete originals after success/cancellation/non-retryable failure and respect TTL. Display re-queryable states/results.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] No Paper exists before confirmation and validation.
- [ ] Repeated Save does not duplicate batches/jobs/Papers.
- [ ] Ignoring invalid rows requires explicit choice; metadata and keys are consistent.
- [ ] Leaving/refreshing does not cancel work; files are not retained after completion.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Permissions mention rollback, but this flow provides no rollback contract. Duplicate detection/resolution is also unspecified on this page; do not invent these features.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
