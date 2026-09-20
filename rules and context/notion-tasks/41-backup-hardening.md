# 41 — Implement backup/restore and hardening

## Source and usage

- Source: [Implement backup/restore and hardening](https://app.notion.com/p/Implement-backup-restore-and-hardening-3b449936029380848969ecf4a33f30f9).
- Notion ID: `3b449936029380848969ecf4a33f30f9`.
- Source domain: Administration & Configuration.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Implement single-project backup/restore with encryption, verification, confirmation, and retention policy.

## Proposed prerequisites

- [06 — Complete job queue and progress platform](06-job-platform.md)
- [07 — Implement upload/storage service](07-storage.md)
- [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md)
- [17 — Implement project database resolver](17-project-resolver.md)
- [22 — Implement audit and undo UI](22-audit-undo.md)
- [23 — Implement system settings and custom labels](23-system-settings.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define the Control DB catalog, encrypted-object metadata/checksum/key version/expiry, restore plans/runs, retention, holds, and audit.
2. Implement requestProjectBackup, getBackupStatus, listProjectBackups, and downloadBackupArtifact using jobs and controlled storage without mixing projects.
3. Implement validateRestorePlan, requestProjectRestore, and verifyRestoredProject: target environment, compatibility, single-use actor/backup/target/expiry-bound token, and typed confirmation.
4. In production, create a safety backup and perform post-restore verification; never silently overwrite a live project.
5. Create Backups, a restore wizard, and reusable high-impact confirmation; only Application Administrators manage them unless backup requests are explicitly delegated to the project's administrator.
6. Implement configureRetentionPolicy, previewRetentionAction, and executeRetentionAction with versioned policies, jobs, and respect for holds/exceptions.
7. Send optional localized notifications without secrets or artifact access links; provide no runSql API or generic SQL console.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Asynchronous backups are isolated, encrypted, and checksum-verified.
- [ ] Downloads require authorization; restores require a plan, confirmation, and verification.
- [ ] Retention and sensitive actions are audited and respect holds.
- [ ] No predictable path/arbitrary SQL grants access.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Concrete retention/anonymization policies and backup delegation require product decisions; this guide does not invent legal retention periods.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
