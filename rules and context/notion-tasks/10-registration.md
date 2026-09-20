# 10 — Implement Registration and Email Verification

## Source and usage

- Source: [Implement Registration and Email Verification](https://app.notion.com/p/Implement-Registration-and-Email-Verification-48f4993602938265b06681ed2318e707).
- Notion ID: `48f4993602938265b06681ed2318e707`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Provide configurable registration and email verification before protected access.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [05 — Implement API app shell](05-api-shell.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)
- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define public, disabled, and administrator-managed modes according to global configuration.
2. Implement register, verify-email, and resend-verification with abuse controls.
3. Generate random, single-use tokens with digest, expiry, and consumption metadata in the Control DB; invalidate previous tokens on resend.
4. Integrate the shared localized email adapter; unverified accounts remain ineligible for protected features.
5. Create registration and verification-pending screens, non-enumerating resend, and an anti-abuse challenge when policy requires it.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Each registration mode is enforced in the frontend and backend.
- [ ] Expired or consumed tokens cannot verify an account.
- [ ] Resend and responses do not enable enumeration.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

The description requires an anti-abuse challenge, while acceptance criteria make it optional depending on policy. Do not select a provider or make it globally mandatory without defining that policy.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
