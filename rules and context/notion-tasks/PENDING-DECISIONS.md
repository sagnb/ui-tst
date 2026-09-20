# Pending decisions and source discrepancies

The observations below come from reading the Notion pages on 2026-09-20. They are not product decisions. Resolve only the issue needed for the task in progress; independent work can continue. Do not use reading order or guide numbers to automatically choose one version of the requirements.

## 1. Reference repository and stack

Notion describes `relis-next`; the current checkout documents `v1` and `v2`. Confirm where the proposed monorepo will be implemented. The Hono/worker/Prisma package mentioned in the source must be verified in the target repository.

[06 — Complete job queue and progress platform](06-job-platform.md) selects pg-boss in the Control DB, while [stack.yml](../stack.yml) leaves pg-boss/BullMQ undecided. That local file was not changed by this conversion.

## 2. Roles and creator protection

[15 — Implement Project Context, Roles, and Membership](15-membership.md) defines PROJECT_ADMIN/PROJECT_MANAGER/REVIEWER/VALIDATOR/GUEST, but [18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md) requires a protected PROJECT_OWNER linked to createdByUserId. [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md) mentions a pending Project Manager membership for the creator.

The membership task alternates between protecting the last Project Manager and the last Project Admin, and prohibits Managers from removing Admins. Define the canonical model, Owner/Admin equivalence or distinction, and invariants before schema design, invitations, and authorization. Do not silently rename roles.

## 3. Invitations: 7 days or 48 hours

In [15 — Implement Project Context, Roles, and Membership](15-membership.md), UI/API use configurable validity with a 7-day default; Jobs behavior requires expiry after 48 hours. Choose one policy applied to tokens, email, UI, and cleanup.

## 4. Login ↔ profile cycle

[09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md) has Blocked by = profile, and [12 — Implement Self-Service Profile and Account Preferences](12-profile.md) has Blocked by = login. The index proposes separating minimal sessions and the identity interface from complete profile management. This addresses implementation order without erasing the original relations.

## 5. Wizard ↔ provisioning cycle

[18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md) and [16 — Prepare and Provision an Isolated Project Database Template](16-project-template.md) have reciprocal Blocked by relations. Separate the contract, template/cloning, and orchestration. Template preparation/migration belongs to the release process; project creation only clones a ready schema and writes v1. Do not run migrations in the end-user flow.

## 6. Who may create and administer projects

[19 — Implement Project Lifecycle, Project Cards, and Metadata Overview](19-project-lifecycle.md) allows any authenticated user to start a draft; [18 — Build the Native Project Protocol Wizard](18-protocol-wizard.md) requires creation permission and excludes Reviewer/Validator/Guest.

Lifecycle alternates between creator plus Application Administrator access and owner-only editing. [21 — Implement Direct Project Settings Management](21-project-settings.md) alternates between Owner-only access and Manager access to operational tabs; JSON export is sometimes Owner-only and sometimes implies administrator access. Define a per-action/tab matrix rather than inferring permissions from menu visibility.

## 7. Public visibility

Lifecycle describes Public projects accessible without membership, but its acceptance criteria restrict visibility to membership/global access. Determine authentication requirements, published content, and visible personal fields. Do not expose the owner's email or review data to non-members merely because those fields appear in the authenticated shell.

## 8. Guests in Screening

In [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md), Users and permissions denies Guests access while UI/API allow reads. [31 — Implement Screening Conflict Resolution and Validation Workspaces](31-screening-conflicts-validation.md) and [32 — Implement Screening Progress Dashboard and Agreement Statistics](32-screening-metrics.md) allow Guest reads. A consistent backend/frontend rule is required.

## 9. Phase configuration and Screening validation

[21 — Implement Direct Project Settings Management](21-project-settings.md) allows All/Included/Excluded as phase input; the assignment flow in [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md) describes Included Papers from the previous phase. Define effective eligibility.

The wizard offers Included/Excluded/both validation; runtime in [31 — Implement Screening Conflict Resolution and Validation Workspaces](31-screening-conflicts-validation.md) limits it to final Excluded Papers, optionally by criterion. Do not offer options without implemented behavior.

Changing phase rules in Settings preserves previous work without automatic reinterpretation, while subsequent decisions recalculate outcomes using effective configuration. Specify the snapshots/versioning needed for consistency after changes.

## 10. QA: individual exclusion, restoration, and validation

[34 — Implement QA Results, Low-quality Exclusion, and Progress](34-qa-results.md) contains internal conflicts: description/UI and a second criteria block inside UI permit individual exclusion/restoration; the final Acceptance criteria property prohibits both and QA validation. The API describes a single bulk-exclusion mutation.

Wizard/Settings offer QA-validation configuration, but results tasks exclude that workflow. Determine whether controls are removed, deferred, or accompanied by a new task. Do not claim compliance with both versions.

## 11. Direct Settings or revisions

[21 — Implement Direct Project Settings Management](21-project-settings.md) prohibits revision drafts, comparison, activation, and rollback; Jobs behavior still describes revision jobs and activation. UI requires inline editing, but acceptance criteria mention dialogs and a different navigation layout. The guide proposes implementing the direct-editing core only after resolving affected issues.

Configuration export requires combining Control DB metadata with the Project DB protocol; the statement that data is available in the Control DB must not cause inadvertent protocol duplication.

## 12. Classification and reassignment

In [35 — Implement Classification Assignment and Classification Workspace](35-classification.md), UI simplifies eligibility without QA, while the API requires Included after QA when enabled. [36 — Implement the data extraction dashbord and progess](36-classification-progress.md) repeats QA → Screening → library precedence.

Workspace pending lists use the absence of Classification, but progress requires the new assignee to save/confirm even when Classification already exists after reassignment. Define assignment state and completion without confusing record existence with completion of new work.

## 13. Reporting: counts and chart types

[37 — Implement Classification Results and Reporting Charts](37-reporting-charts.md) prohibits dashboard counts in API behavior but requires them in acceptance criteria. Wizard/Settings allow Bubble for Compare, while Reporting lists Pie/Bar/Line. Define supported types and which task owns counts.

Do not incorrectly standardize all datasets: results/charts use active saved classifications; [38 — Implement Reporting Authors and Venues](38-reporting-authors-venues.md) requires active, non-excluded, completed reportable Papers included after QA where applicable. Exports have their own scopes.

## 14. Direct exports versus the jobs/storage platform

[39 — Implement CSV and BibTeX Reporting Exports](39-csv-bibtex-exports.md) requires immediate streaming without persistence, jobs, retry, expiry, or artifact revocation. [40 — Implement Python and R Statistical Analysis Exports](40-python-r-exports.md) also streams ZIPs without retention and does not execute Python/R on the server.

Generic jobs/storage tasks mention persisted exports. The plan keeps the specific contracts visible; record the integration decision without forcing jobs/storage into these endpoints.

CSV/BibTeX permissions say every application user, but the API requires project/export authorization. Define whether this covers members, Guests, or an authorized public audience.

## 15. Imports: intake, parsing, duplicates, and rollback

[27 — Implement Secure Import Storage and Project Job Progress](27-import-intake.md) excludes parsing/mapping/metadata/deduplication/commit/rollback and limits states, but its acceptance criteria mention complete results/duplicates. The guide preserves the intake boundary.

[29 — Implement BibTeX and EndNote Import Parsers](29-bibler-import.md) excludes deduplication/rollback implementation, but acceptance criteria require sharing those workflows with CSV. [28 — Provide one CSV Import page organised into progressive sections.](28-csv-import.md) also mentions rollback in permissions without defining execution. No complete standalone tickets for these features exist in the consulted inventory.

Temporary files start with a 24-hour storage TTL; define behavior for active batches that exceed it. Safety cleanup is storage-level, with no dedicated application job in this task.

## 16. Statistics and legacy parity

[32 — Implement Screening Progress Dashboard and Agreement Statistics](32-screening-metrics.md) does not specify the Kappa variant, missing-data handling, or criteria denominators. Define formulas and edge cases before treating statistics as validated.

[40 — Implement Python and R Statistical Analysis Exports](40-python-r-exports.md) requires legacy analysis families but provides no templates. [29 — Implement BibTeX and EndNote Import Parsers](29-bibler-import.md) requires approved fixtures and the private BiBler contract. Locate those materials; do not invent parity from the description.

## 17. Dependencies without complete tickets

[24 — Implement Project Paper List](24-paper-list.md) shows Edit/Delete but specifies only reads. Authorship/order editing belongs to Paper editing and is referenced elsewhere, without its own record among the 42 tasks.

Shared email, anti-abuse protection, frontend scaffolding, deduplication, and rollback also require an existing implementation or defined additional scope. A missing ticket does not authorize ignoring a dependency or marking features complete.

## 18. Empty fields and proposed checks

The source lacks Acceptance criteria for runtime config, Docker Compose, Control Prisma, Project Prisma, API shell, project resolver, profile, Authors/Affiliations, and Paper List. Each guide flags this absence and offers proposed checks.

Empty Jobs behavior/Audit fields do not remove job/audit requirements stated elsewhere. Each page's status is only a snapshot from the consultation, not a verification of the code.
