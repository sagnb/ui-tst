# 32 — Implement Screening Progress Dashboard and Agreement Statistics

## Source and usage

- Source: [Implement Screening Progress Dashboard and Agreement Statistics](https://app.notion.com/p/Implement-Screening-Progress-Dashboard-and-Agreement-Statistics-3b349936029380639b34d5798e14cfd8).
- Notion ID: `3b349936029380639b34d5798e14cfd8`.
- Source domain: Screening.
- Source status on 2026-09-20: Backlog; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Display read-only phase metrics that distinguish Screening from Validation.

## Proposed prerequisites

- [30 — Implement Screening Assignment and Reviewer Decision Flow](30-screening.md)
- [31 — Implement Screening Conflict Resolution and Validation Workspaces](31-screening-conflicts-validation.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Create separate dashboard, Screening/Validation progress, and statistics endpoints for each flow.
2. Calculate workload from active assignments; the Screening gauge counts completed assignments outside conflicts, while Validation counts completed validations.
3. Create personal/global cards, participant/Total bars, and authorized actions; hide disabled Validation.
4. Derive outcomes, decisions by user, historical conflicts, and criteria percentages; record ScreeningOutcomeHistory and snapshots as specified.
5. Save originalScreeningOutcome when creating a validation assignment and use it for Matched rather than comparing with an outcome already changed by Veto/Normal.
6. Calculate Kappa on the server when enabled and at least two comparable reviewers exist; show unavailable when insufficient.
7. Refresh read models after assignments, decisions, cancellations, validation, and outcome changes.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Assignment types are not mixed in denominators.
- [ ] Matched uses the original snapshot and metrics never cross project/phase boundaries.
- [ ] Unavailable Kappa is not shown as zero or perfect agreement.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The source does not define the Kappa variant, missing-data handling, or criteria-percentage denominators. Define and document these before validating statistics; do not assume a formula.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
