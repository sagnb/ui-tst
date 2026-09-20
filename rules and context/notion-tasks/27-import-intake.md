# 27 — Implement Secure Import Storage and Project Job Progress

## Source and usage

- Source: [Implement Secure Import Storage and Project Job Progress](https://app.notion.com/p/Implement-Secure-Import-Storage-and-Project-Job-Progress-3b34993602938099afb4c759dd6a3e14).
- Notion ID: `3b34993602938099afb4c759dd6a3e14`.
- Source domain: Paper Library & Import.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Receive CSV/BibTeX/EndNote files and create a tracked ImportBatch before parsing or committing records.

## Proposed prerequisites

- [06 — Complete job queue and progress platform](06-job-platform.md)
- [07 — Implement upload/storage service](07-storage.md)
- [15 — Implement Project Context, Roles, and Membership](15-membership.md)
- [17 — Implement project database resolver](17-project-resolver.md)
- [20 — Implement Project Workspace Navigation and Home Dashboard](20-project-workspace.md)
- [24 — Implement Project Paper List](24-paper-list.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create Start a new import, Import history, and project-scoped details with CSV/.bib/.enw selection, picker/drop area, and safe filenames.
2. Validate extension/format, size, MIME, and basic content; create idempotent batch/job/storage records.
3. Store originals in private temporary storage using opaque references; workers perform technical validation/storage.
4. Implement only Uploading/Queued/Failed/Cancelled; Queued means ready for a parser, not a completed import.
5. Return progress, safe failure, retry eligibility/expiry, and allowed actions. Retry uses the same batch and available file.
6. Allow cancellation only before parsing/commit. Delete originals on cancellation, later final success, or non-retryable failure; remove the reference and record deletedAt.
7. Apply an initial 24-hour storage TTL to protect against interrupted workers, without a dedicated cleanup job. Require a new upload if the file is gone.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] No cross-project leakage, paths, credentials, or raw files are exposed by the API.
- [ ] Repeated confirmed uploads do not duplicate batches/jobs/objects.
- [ ] Refresh retrieves server state; expired retries are rejected.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria mention imported/duplicate counts and commits, but UI/API exclude parsing, deduplication, review, and rollback. Keep intake separate and connect results through later tickets; clarify the TTL policy for active batches.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
