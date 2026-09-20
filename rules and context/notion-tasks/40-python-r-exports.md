# 40 — Implement Python and R Statistical Analysis Exports

## Source and usage

- Source: [Implement Python and R Statistical Analysis Exports](https://app.notion.com/p/Implement-Python-and-R-Statistical-Analysis-Exports-3d04993602938067bb0fddbe3c03e9b9).
- Notion ID: `3d04993602938067bb0fddbe3c03e9b9`.
- Source domain: Reporting & Export.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Download Python/R analysis environments with a reportable snapshot without running either language on the server.

## Proposed prerequisites

- [35 — Implement Classification Assignment and Classification Workspace](35-classification.md)
- [38 — Implement Reporting Authors and Venues](38-reporting-authors-venues.md)
- [39 — Implement CSV and BibTeX Reporting Exports](39-csv-bibtex-exports.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Restrict generation to Owner/Manager/Admin and validate categories against the active project configuration.
2. Allow Nominal/Continuous/Text per category; retain Text in CSV but exclude it from statistical calls.
3. Build a reportable snapshot with key/title/authors/year/venue/Source/Strategy and categories; separate multi-values with | and use unambiguous parent-child subcategory labels.
4. Python ZIP: CSV, relis_statistics_kernel.py, relis_statistics_playground.py, and requirements.txt. R ZIP: CSV, library, and playground/configuration.
5. Generate appropriate analysis families: frequency/bar, descriptive/box/violin, evolution, and comparative/chi-squared/correlation where applicable; R scripts include calls ready to uncomment.
6. Stream the ZIP directly and record ReportingExportAudit with actor/language/type configuration/count/timestamp/result.
7. Treat labels and values as data when generating code; do not execute Python/R or persist ZIP/CSV on the server.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] ZIP contents and dataset match the selected scope/types.
- [ ] Multi-values/subcategories are consistent.
- [ ] Generation is authorized/auditable without retention or remote execution.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The source provides no templates or detailed statistical-test applicability rules. Retrieve legacy fixtures/templates and validate generated files in a test environment before claiming parity.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
