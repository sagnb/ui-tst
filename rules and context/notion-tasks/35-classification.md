# 35 — Implement Classification Assignment and Classification Workspace

## Source and usage

- Source: [Implement Classification Assignment and Classification Workspace](https://app.notion.com/p/Implement-Classification-Assignment-and-Classification-Workspace-3b3499360293808c9848e3c2ef6b084b).
- Notion ID: `3b3499360293808c9848e3c2ef6b084b`.
- Source domain: Data Extraction.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Assign eligible Papers and record classification using generic categories, dynamic references, and reassignment.

## Proposed prerequisites

- [21 — Implement Direct Project Settings Management](21-project-settings.md)
- [24 — Implement Project Paper List](24-paper-list.md)
- [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md)
- [33 — Implement Quality Assessment Assignment and Assessment Flow](33-qa-assessment.md)
- [34 — Implement QA Results, Low-quality Exclusion, and Progress](34-qa-results.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Resolve module/configuration/permissions and eligibility: active, non-excluded, and Included after QA when enabled; otherwise Included in final Screening; otherwise available in the library.
2. Create All/Classified/Excluded/Pending Papers and My/My pending/My classified/All assignments with search, filters, sorting, and pagination.
3. Owner/Manager/Admin previews and distributes evenly among non-Guests; an eligible Paper without active classification/assignment receives one assignment, idempotently.
4. Create Reference lists by configured name or label; avoid duplicate tabs, require unique nonempty values, and block deletion of used values. Eligible non-Guest members manage values according to the API.
5. Create next Paper, details, and authorized Add/Edit/Delete Classification; assignees modify only their own work unless explicit management exceptions apply.
6. Render Simple, List, DynamicList, dependent fields, and subcategories on the first save; validate required/default/regex/max length/selections/dependencies on the server.
7. Persist Classification/ClassificationValue/Assignment/ReferenceList/Value in the fixed schema without generating category-specific structures.
8. Allow reassignment by assignee/Owner/Manager/Admin to another eligible member: close the current assignment as Reassigned, create a pending manual assignment, and preserve classification/history for the new assignee.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Normal assignments neither duplicate nor include already classified Papers.
- [ ] Subcategories can be saved during creation.
- [ ] Dependent DynamicList accepts only values valid for the selected source.
- [ ] Reassignment preserves data/history without keeping the former workload active.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

UI eligibility omits QA, but the API requires it; the guide flags this rule for reconciliation. Pending lists based on the absence of Classification conflict with the progress ticket, which requires confirmation by the new assignee even when a classification exists. Define reassignment completion semantics.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
