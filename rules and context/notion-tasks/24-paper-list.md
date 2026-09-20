# 24 — Implement Project Paper List

## Source and usage

- Source: [Implement Project Paper List](https://app.notion.com/p/Implement-Project-Paper-List-3c149936029380ad8415e359d144b867).
- Notion ID: `3c149936029380ad8415e359d144b867`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create the current project's Paper list and read-only details.

## Proposed prerequisites

- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [17 — Implement project database resolver](17-project-resolver.md)
- [20 — Implement Project Workspace Navigation and Home Dashboard](20-project-workspace.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Implement queries against the authorized Project DB, with pagination and search by key, title, author, DOI, URL, and Source.
2. Filter by Pending (default), Included, or Excluded decisions and return pagination metadata.
3. Expose only id/key/title/URL/Source/decision and allowed actions in the list.
4. Create the Paper key | Title | URL | Source | Decision | Actions table; titles open details.
5. Show ordered authors, DOI, URL, Source, Strategy, Venue, year, and abstract in details.
6. Expose Import/Edit/Delete only to Owner/Manager when their respective flows exist.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] List/details reject Papers from other projects.
- [ ] Search, filters, and pagination work; details preserve author order.
- [ ] Unauthorized users are not offered mutation actions.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Data model and acceptance criteria are empty; checks are proposed. The source presents Edit/Delete but specifies only read APIs. No separate Paper editing/deletion task exists among the 42 pages: record this gap before implementing destructive endpoints.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
