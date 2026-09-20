# 02 — Add Docker Compose local stack

## Source and usage

- Source: [Add Docker Compose local stack](https://app.notion.com/p/Add-Docker-Compose-local-stack-3b449936029380bcbd8be3437ececdf5).
- Notion ID: `3b449936029380bcbd8be3437ececdf5`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Provide one-command local development with web, API, worker, PostgreSQL, reverse proxy, object storage, and mail capture.

## Proposed prerequisites

- [01 — Implement runtime config validation](01-runtime-config.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Check which applications exist and their actual commands; do not assume the monorepo described in Notion already exists in this checkout.
2. Define services and shared configuration, including the Control DB and per-project test databases.
3. Configure local persistent volumes and exclude them from version control.
4. Expose health/readiness through the local proxy and restrict database and storage port exposure.
5. Document startup, diagnostics, and local access to MailHog/Mailpit and job observability.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] One command starts the documented environment and its dependencies become ready.
- [ ] Local volumes and credentials are not committed to Git.
- [ ] Development services are not presented as product features.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria are not provided in the source. BiBler is required by the import task but is not included in this task's new service list; integrate or document its availability before implementing that import.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
