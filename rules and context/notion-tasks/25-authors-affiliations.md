# 25 — Implement Authors and Affiliations Directory

## Source and usage

- Source: [Implement Authors and Affiliations Directory](https://app.notion.com/p/Implement-Authors-and-Affiliations-Directory-3c64993602938073a428fd6b23b5fb48).
- Notion ID: `3c64993602938073a428fd6b23b5fb48`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create author and affiliation directories with counts derived from active Papers.

## Proposed prerequisites

- [24 — Implement Project Paper List](24-paper-list.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Model/reuse Author, Affiliation, and ordered PaperAuthor records in the Project DB.
2. Implement scope=all and scope=first lists; derive counts from active links to active Papers and author position 1.
3. Create Authors with All authors/First authors, search/pagination/sorting, and Affiliation; manually created authors with no Papers appear in All.
4. Create Affiliations with required Institute and optional Description.
5. Allow inline editing/addition/deletion only for Owner/Manager/Admin, with Zod, auditing, and confirmation.
6. Block deletion of authors linked to Papers and affiliations linked to authors; do not change Paper authorship/order here.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Counts are neither editable nor stored as mutable fields.
- [ ] First authors have positive counts derived from position 1.
- [ ] Editing updates shared references and deletion of referenced records is blocked.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria are empty in the source; the checklist is proposed from UI/API requirements. Editorial questions about authors without Papers and affiliations are explicitly resolved by the API field, which includes these cases.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
