# 07 — Implement upload/storage service

## Source and usage

- Source: [Implement upload/storage service](https://app.notion.com/p/Implement-upload-storage-service-3b44993602938082a1b9c5d59ce6abc2).
- Notion ID: `3b44993602938082a1b9c5d59ce6abc2`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create a storage abstraction with validation, quarantine, authorization, and upload/artifact lifecycle management.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [04 — Implement reusable project Prisma schema](04-project-prisma.md)
- [05 — Implement API app shell](05-api-shell.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define ownership by user/project and policies supplied by each feature.
2. Implement createUploadIntent, completeUpload, scanAndValidateUpload, getArtifact, downloadArtifact, revokeArtifact, and deleteExpiredArtifact.
3. Validate type, size, checksum, and malware policy before making an object available.
4. Persist lifecycle references in the Control DB and feature ownership in the Project DB as appropriate; use opaque object-storage keys.
5. Create reusable upload states and artifact cards with expiry and authorized downloads.
6. Integrate isolation, revocation, and safe failure handling.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Filesystem paths and credentials are not exposed by the API.
- [ ] Downloads and mutations verify ownership and scope.
- [ ] Rejected/quarantined uploads are unavailable.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

This task anticipates persisted export artifacts, but later specific tasks require streaming without persistence. Do not impose storage on those exports. Imports require storage-level expiry without an application cleanup job.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
