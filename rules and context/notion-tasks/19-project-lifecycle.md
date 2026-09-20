# 19 — Implement Project Lifecycle, Project Cards, and Metadata Overview

## Source and usage

- Source: [Implement Project Lifecycle, Project Cards, and Metadata Overview](https://app.notion.com/p/Implement-Project-Lifecycle-Project-Cards-and-Metadata-Overview-3ad499360293801eb322ddc6aae3f36c).
- Notion ID: `3ad499360293801eb322ddc6aae3f36c`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Implement project lists, metadata, and lifecycle with server-verified creator authority.

## Proposed prerequisites

- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create /projects with My projects (including drafts), My participating projects, and Public projects without duplicates.
2. Implement title/owner search, Draft/Provisioning/Active/Published/Archived filters, and creation/modification sorting; share the dataset between cards and table.
3. Return title, short name, owner, user profile, status, dates, and allowed actions; drafts have Resume and do not query the Project DB.
4. Implement details and editing for title, description, and research questions; short name and creator identity are immutable.
5. Implement publish/unpublish and archive/restore with valid transitions, confirmation, and audit; archived projects block writes.
6. Return safe provisioning failures and public access only according to publication policy.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Cards and table display the same filtered and sorted results.
- [ ] Archival is reversible and blocks writes.
- [ ] Client input is never accepted as authority for owner identity.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The source alternates creator plus Application Administrator access with owner-only editing; membership-only visibility criteria conflict with Public projects. Any user may create drafts here, while the wizard restricts creation. Define policy before enabling public access or privileges.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
