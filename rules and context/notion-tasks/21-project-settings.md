# 21 — Implement Direct Project Settings Management

## Source and usage

- Source: [Implement Direct Project Settings Management](https://app.notion.com/p/Implement-Direct-Project-Settings-Management-3b8499360293808f93eed7d8bda08f06).
- Notion ID: `3b8499360293808f93eed7d8bda08f06`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Directly edit active settings while preserving the integrity of existing work.

## Proposed prerequisites

- [18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md)
- [20 — Implement Project Workspace Navigation and Home Dashboard](20-project-workspace.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Reuse wizard contracts/controls and organize General, Screening, QA, Data extraction, and Reporting.
2. Apply the detailed UI/API matrix: General for Owner/Admin; other tabs for Owner/Manager/Admin, after resolving the permissions-summary conflict.
3. Implement inline Add/Edit/Save/Cancel/confirmed Delete; only phase configuration uses a popup. Short name is read-only; question/phase reordering is backend-managed.
4. Manage questions, sources/strategies, and JSON export. Used sources/strategies are frozen and may only be archived where permitted.
5. Manage screening defaults, criteria, and phases; allow one final phase, transactional ordering, and a consistent Previous phase flow. Custom copies defaults; switching back removes the override.
6. Allow rule changes after work starts with an impact warning and confirmation, preserving decisions/assignments without automatically reinterpreting previous work.
7. Manage QA, categories/subcategories/lists/dependencies, and charts through fixed-schema CRUD. Block deletion/structural changes of used items and module disabling that invalidates data.
8. Keep createdBy/createdAt/modifiedBy backend-managed; hidden audit columns are Owner/Admin-only and must not leak to Managers.
9. Audit mutations and return field errors; do not generate schemas or implement a revision workflow without resolving the source contradiction.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Saving persists changes and refresh shows the current configuration.
- [ ] Used references and started work are preserved.
- [ ] Reordering and the final phase maintain invariants.
- [ ] Phase configuration changes require impact confirmation when applicable.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Explicit conflicts: Owner-only versus Manager tab access; inline versus dialogs in acceptance criteria; no revisions versus revision/activation jobs; Owner-only export versus Admin access and an incorrect reference to all configuration residing in the Control DB. QA validation and Bubble depend on global decisions.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
