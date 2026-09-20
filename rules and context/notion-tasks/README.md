# ReLiS2.0 — task sequence for an LLM

## Source and coverage

Source: [ReLis2.0 Migration in Notion](https://app.notion.com/p/8f44993602938223af6b01b1da29bcc2?v=8dc49936029382eb918f88ca2f92f6e8).

Consulted on 2026-09-20: 42 records in the All Features view, 42 distinct pages opened, and 15 properties per page consulted, including initially hidden properties. This directory contains one Markdown guide per record and this index. Statuses reflect that consultation; no Notion records were modified.

The guides are English adaptations with summarized requirements, inferred dependencies, and proposed steps. They are not verbatim exports or copies of every administrative field. Titles, IDs, links, statuses, and populated Blocked by relations provide traceability. Consult the original page for literal specifications or subsequent changes.

## Context the LLM must read

1. [Stack](../stack.yml).
2. [Proposed structure](../project-structure.md).
3. [Pending decisions](PENDING-DECISIONS.md).
4. The selected guide and its prerequisites.

Notion mentions a `relis-next` repository with Hono, `@relis/database`, and `apps/worker`. This checkout's README describes two projects, `v1` and `v2`; the tree in `project-structure.md` is a proposal. Before implementation, identify the target repository and verify its baseline. Do not assume that Notion's description of existing infrastructure proves it exists here.

## Execution workflow

1. Choose a task whose core can be implemented with the available dependencies.
2. Inspect the code and identify already-satisfied requirements with evidence, without recreating existing scaffolds.
3. Read the task's pending decisions. Implement independent parts; request a decision only for contradictory behavior affecting that implementation.
4. Follow the steps and verify domain, authorization, isolation, and idempotency criteria where applicable.
5. Report changes, checks actually performed, and limitations before moving to another task.
6. Do not treat Backlog/Not Started as proof that no code exists. Following this index alone does not authorize changing Notion, publishing, or deploying.

Numbers represent a proposed technical order, not a priority approved in Notion. Source-declared dependencies are separated from inferred ones. Explicit login/profile and wizard/provisioning cycles are preserved and analyzed in PENDING-DECISIONS.md.

## Proposed phases

| Phase | Guides | Outcome |
| --- | --- | --- |
| Technical foundation | 01–07 | Configuration, environment, databases, API, jobs, and storage |
| Initialization and identity | 08–14 | First administrator, login, verification, passwords, profile, directory, and optional Google sign-in |
| Projects and administration | 15–23 | Membership, template, resolver, wizard, lifecycle, shell, settings, audit/undo, and labels |
| Library and imports | 24–29 | Papers, authors, venues, intake, and parsers |
| Screening | 30–32 | Assignments, decisions, conflicts, validation, and statistics |
| QA and classification | 33–36 | Assessment, results, extraction/classification, and progress |
| Reporting and exports | 37–40 | Charts, reportable authors/venues, and downloads |
| Operations | 41–42 | Backup/restore, hardening, and CI/CD completion |

### Work that must be split into stages

- **Storage (07):** implement the abstraction and validation; integrate real authorization after identity and membership. Do not release APIs without a policy.
- **Installation (08):** bootstrap the first administrator before validating login. If credentials are needed, share the hashing primitive from guide 09; do not depend on an already-authenticated session. Complete demo seeding only after template/wizard work (16/18).
- **Login/profile (09/12):** implement the session/current-identity core, then profile management. Notion records reciprocal dependencies.
- **Membership (15):** establish authorization before project modules; invitations depend on email/identity and a resolved role policy.
- **Template/wizard (16/18):** define a shared contract, prepare the template and clone service, then integrate v1 persistence and activation. Notion's reciprocal dependency prevents a literal topological ordering.
- **Audit (22):** the event envelope and recording must accompany the earliest mutations; the complete UI and compensations arrive in this phase. Do not defer audit logging for earlier features.
- **CI/CD (42):** start basic gates as soon as executable scripts exist; complete release/recovery after databases, jobs, and backups are available.

End-to-end integrations must wait for real dependencies. An interface or mock permits partial development but does not prove task completion.

## Inventory and suggested order

| Order | Guide | Domain | Source status |
| --- | --- | --- | --- |
| 01 | [Implement runtime config validation](01-runtime-config.md) | Infrastructure | Backlog |
| 02 | [Add Docker Compose local stack](02-docker-compose.md) | Infrastructure | Backlog |
| 03 | [Create control Prisma schema](03-control-prisma.md) | Infrastructure | Backlog |
| 04 | [Implement reusable project Prisma schema](04-project-prisma.md) | Infrastructure | Backlog |
| 05 | [Implement API app shell](05-api-shell.md) | Infrastructure | Backlog |
| 06 | [Complete job queue and progress platform](06-job-platform.md) | Infrastructure | Backlog |
| 07 | [Implement upload/storage service](07-storage.md) | Infrastructure | Backlog |
| 08 | [Seed installation and demo data](08-installation-demo.md) | Infrastructure | Backlog |
| 09 | [Implement Secure Login, Logout, and Session Management](09-login-sessions.md) | Authentication & User Management | Not Started |
| 10 | [Implement Registration and Email Verification](10-registration.md) | Authentication & User Management | Not Started |
| 11 | [Implement Password Change, Recovery, and Administrator Force Reset](11-password-reset.md) | Authentication & User Management | Not Started |
| 12 | [Implement Self-Service Profile and Account Preferences](12-profile.md) | Authentication & User Management | Not Started |
| 13 | [Implement Administrator User Directory and Account Lifecycle Management](13-admin-users.md) | Authentication & User Management | Not Started |
| 14 | [Implement Google OpenID Connect Sign-In](14-google-oidc.md) | Authentication & User Management | Not Started |
| 15 | [Implement Project Context, Roles, and Membership](15-membership.md) | Project & Protocol Management | Not Started |
| 16 | [Prepare and Provision an Isolated Project Database Template](16-project-template.md) | Project & Protocol Management | Not Started |
| 17 | [Implement project database resolver](17-project-resolver.md) | Infrastructure | Backlog |
| 18 | [Build the Native Project Protocol Wizard](18-protocol-wizard.md) | Project & Protocol Management | Not Started |
| 19 | [Implement Project Lifecycle, Project Cards, and Metadata Overview](19-project-lifecycle.md) | Project & Protocol Management | Not Started |
| 20 | [Implement Project Workspace Navigation and Home Dashboard](20-project-workspace.md) | Project & Protocol Management | Not Started |
| 21 | [Implement Direct Project Settings Management](21-project-settings.md) | Project & Protocol Management | Not Started |
| 22 | [Implement audit and undo UI](22-audit-undo.md) | Administration & Configuration | Backlog |
| 23 | [Implement system settings and custom labels](23-system-settings.md) | Administration & Configuration | Backlog |
| 24 | [Implement Project Paper List](24-paper-list.md) | Paper Library & Import | Not Started |
| 25 | [Implement Authors and Affiliations Directory](25-authors-affiliations.md) | Paper Library & Import | Not Started |
| 26 | [Implement Venue Directory](26-venues.md) | Paper Library & Import | Not Started |
| 27 | [Implement Secure Import Storage and Project Job Progress](27-import-intake.md) | Paper Library & Import | Not Started |
| 28 | [Provide one CSV Import page organised into progressive sections.](28-csv-import.md) | Paper Library & Import | Backlog |
| 29 | [Implement BibTeX and EndNote Import Parsers](29-bibler-import.md) | Paper Library & Import | Backlog |
| 30 | [Implement Screening Assignment and Reviewer Decision Flow](30-screening.md) | Screening | Backlog |
| 31 | [Implement Screening Conflict Resolution and Validation Workspaces](31-screening-conflicts-validation.md) | Screening | Backlog |
| 32 | [Implement Screening Progress Dashboard and Agreement Statistics](32-screening-metrics.md) | Screening | Backlog |
| 33 | [Implement Quality Assessment Assignment and Assessment Flow](33-qa-assessment.md) | Quality Assessment | Backlog |
| 34 | [Implement QA Results, Low-quality Exclusion, and Progress](34-qa-results.md) | Quality Assessment | Backlog |
| 35 | [Implement Classification Assignment and Classification Workspace](35-classification.md) | Data Extraction | Backlog |
| 36 | [Implement the data extraction dashbord and progess](36-classification-progress.md) | Data Extraction | Backlog |
| 37 | [Implement Classification Results and Reporting Charts](37-reporting-charts.md) | Reporting & Export | Backlog |
| 38 | [Implement Reporting Authors and Venues](38-reporting-authors-venues.md) | Reporting & Export | Backlog |
| 39 | [Implement CSV and BibTeX Reporting Exports](39-csv-bibtex-exports.md) | Reporting & Export | Backlog |
| 40 | [Implement Python and R Statistical Analysis Exports](40-python-r-exports.md) | Reporting & Export | Backlog |
| 41 | [Implement backup/restore and hardening](41-backup-hardening.md) | Administration & Configuration | Backlog |
| 42 | [Complete CI/CD and production deployment specification](42-cicd-deployment.md) | Infrastructure | Backlog |

## Reusable prompt

```text
Implement the task described in rules and context/notion-tasks/<file>.md.

Read this directory's README, PENDING-DECISIONS.md, stack.yml, and
project-structure.md. First confirm the target repository and its actual state.

Use the guide's prerequisites and summarized requirements. Distinguish source
requirements from proposed decisions. Consult the original page when a necessary
detail is missing. Do not silently choose between contradictory requirements.

Implement the authorized core, run proportionate checks, and report:
- changed files and delivered behavior;
- satisfied criteria with evidence;
- tests/checks performed and their results;
- blockers, discrepancies, and missing integrations.

Do not consider a feature implemented merely because its guide was written.
Do not automatically advance to another task or modify Notion.
```

## Inventory limitations

No complete, independent tasks for Paper editing/deletion, duplicate detection/resolution, import rollback, an email adapter, or frontend scaffolding were found among the 42 pages. These features appear as references or dependencies. Check existing implementation and define missing scope before declaring consuming workflows complete.

Checks in guides whose source lacks Acceptance criteria are explicitly marked as proposals. The other checklists are operational summaries, not complete transcriptions.
