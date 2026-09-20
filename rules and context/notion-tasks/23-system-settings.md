# 23 — Implement system settings and custom labels

## Source and usage

- Source: [Implement system settings and custom labels](https://app.notion.com/p/Implement-system-settings-and-custom-labels-3b44993602938052b4b5e9ed90017e43).
- Notion ID: `3b44993602938052b4b5e9ed90017e43`.
- Source domain: Administration & Configuration.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Manage validated global settings, English/French labels, and safe localized help.

## Proposed prerequisites

- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [22 — Implement audit and undo UI](22-audit-undo.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define a settings registry with type, scope, default, validation, sensitivity, restart requirement, and safe rollback strategy.
2. Implement getSystemSettings, validateSystemSettingsDraft, updateSystemSettings, and getProjectEffectiveSettings; reject unknown keys, secrets, and unauthorized scopes.
3. Separate global settings/revisions in the Control DB from protocol settings/labels in the Project DB.
4. Implement listCustomLabels, updateCustomLabelDraft, and publishCustomLabelRevision using stable IDs and project → global → static translation fallback.
5. Implement getHelpContent, saveHelpContentDraft, publishHelpContent, and restoreSettingsOrContentRevision with drafts, preview, sanitization, and history.
6. Create settings, labels, and help screens by role; project-configuration links reuse the dedicated module.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Overrides do not cross project boundaries and labels support en/fr.
- [ ] Help cannot execute HTML/JavaScript and publishing is administrator-only.
- [ ] Disabled modules are rejected through direct URLs/API calls too.
- [ ] No ReLiS Editor/Tomcat/DSL setting is migrated.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The labels/global-settings revision model must not reintroduce protocol revisions prohibited in Direct Settings. Project Admin versus Owner/Manager permissions must be reconciled.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
