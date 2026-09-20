# 20 — Implement Project Workspace Navigation and Home Dashboard

## Source and usage

- Source: [Implement Project Workspace Navigation and Home Dashboard](https://app.notion.com/p/Implement-Project-Workspace-Navigation-and-Home-Dashboard-3ad49936029380119f60ce93f1f5d75f).
- Notion ID: `3ad49936029380119f60ce93f1f5d75f`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create a persistent shell, navigation by role/module/state, and Project Home.

## Proposed prerequisites

- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [17 — Implement project database resolver](17-project-resolver.md)
- [18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md)
- [19 — Implement Project Lifecycle, Project Cards, and Metadata Overview](19-project-lifecycle.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Integrate the authenticated global/project shell with branding, collapsible navigation, URL-based switcher, language, and user menu.
2. Provide a shell endpoint with identity, lifecycle, membership, isProjectOwner, global authority, modules, actions, and owner summary.
3. Create global Dashboard/Projects navigation and project Home, Papers/Imports/Authors/Venues, Screening, QA, Data Extraction, Reporting, Team, and authorized administration.
4. Create Home with breadcrumb, title/description/state, owner card with avatar/name/email, and participants without duplicating the owner.
5. Display the configured Review workflow phases, QA, and Classification; this delivery uses — for status/completion and restricts Open phase as specified in the source.
6. Switching projects invalidates visual/data context and navigates by URL; unavailable projects must not query incomplete databases.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] The shell persists across routes and menus reflect permissions/modules.
- [ ] Reviewers/Validators/Guests cannot access Import/Team; the backend also enforces this.
- [ ] Home does not mix projects or assignment types.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria mention metrics, but the UI requires placeholders in this task. Integrate metrics only with their own tickets. Administrator editing exceptions must be reconciled with lifecycle rules.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
