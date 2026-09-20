# 01 — Implement runtime config validation

## Source and usage

- Source: [Implement runtime config validation](https://app.notion.com/p/Implement-runtime-config-validation-3b4499360293802cbed7fada48d48d0a).
- Notion ID: `3b4499360293802cbed7fada48d48d0a`.
- Source domain: Infrastructure.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Define one typed configuration contract for web, API, worker, migrations, and deployment; fail before accepting traffic or writing data when configuration is invalid.

## Proposed prerequisites

No mandatory preceding guide; confirm the repository context.

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Inventory the variables used by each process and separate public values from secrets.
2. Define the shared configuration contract and required validation; Zod is the library specified in the stack.
3. Integrate validated configuration loading into each process startup, before connections and writes.
4. Expose health/readiness diagnostics by configuration category without returning values.
5. Document variables and examples without real credentials.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Missing or invalid configuration prevents the relevant process from starting.
- [ ] Web, API, worker, and tools use the same contract.
- [ ] Diagnostics and logs do not reveal secrets.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The Notion page does not provide a data model or acceptance criteria; the checks below are technical proposals.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
