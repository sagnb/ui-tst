# 04 — Implement reusable project Prisma schema

## Source and usage

- Source: [Implement reusable project Prisma schema](https://app.notion.com/p/Implement-reusable-project-Prisma-schema-3b4499360293809895dbd69c461aa143).
- Notion ID: `3b4499360293809895dbd69c461aa143`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create one fixed, reusable PostgreSQL schema for each isolated project database; represent dynamic protocol behavior as metadata.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Inventory the Paper, protocol, assignment, screening, QA, classification, reporting, and audit contracts described in the guides.
2. Extend the existing database package with a schema and static migrations separate from the Control DB.
3. Represent categories, dependencies, and subcategories as records in fixed models, without generating tables per category.
4. Create typed repositories and schema version/compatibility checks.
5. Validate the same schema in two independent databases and prepare it for the provisioning template.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Two projects use the same schema without sharing data.
- [ ] Changing protocol metadata does not generate structural SQL or migrations.
- [ ] Runtime contracts use fixed models.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Data model and acceptance criteria are empty in the source. The exact design depends on domain contracts; do not invent final columns from this summary alone.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
