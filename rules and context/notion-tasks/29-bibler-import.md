# 29 — Implement BibTeX and EndNote Import Parsers

## Source and usage

- Source: [Implement BibTeX and EndNote Import Parsers](https://app.notion.com/p/Implement-BibTeX-and-EndNote-Import-Parsers-3b349936029380eda9f8df8b2e109280).
- Notion ID: `3b349936029380eda9f8df8b2e109280`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Import BibTeX/EndNote through the private BiBler service using the legacy-compatible contract.

## Proposed prerequisites

- [06 — Complete job queue and progress platform](06-job-platform.md)
- [24 — Implement Project Paper List](24-paper-list.md)
- [27 — Implement Secure Import Storage and Project Job Progress](27-import-intake.md)
- [28 — Provide one CSV Import page organised into progressive sections.](28-csv-import.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Confirm BiBler access, documentation, fixtures, and legacy contract; do not replace it with a native parser.
2. The worker reads a Queued batch's temporary file and sends it to the internal service with timeouts, response limits, and bounded retries.
3. Validate responses against a fixed normalized-reference contract; preserve ordered authors, venue, year, DOI, abstract, URL, and citation key.
4. Persist ordered candidates and safe warnings/errors on the existing batch without creating Papers yet.
5. Create a preview and Source/Strategy selection before subsequent review when configured; no strategy executes an external search.
6. Integrate user-approved asynchronous commit through the shared workflow; delete the file after success/cancellation/terminal failure.
7. Do not persist raw responses/parser logs or intermediate debugging artifacts.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Approved fixtures preserve expected counts and metadata.
- [ ] Invalid records produce warnings without blocking independent valid records.
- [ ] Parser inputs/responses cannot execute code or leak internals.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The API excludes duplicate detection/resolution/rollback implementation, but acceptance criteria require sharing those flows with CSV. Record the missing dependency without implementing a parallel path or marking the gap complete.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
