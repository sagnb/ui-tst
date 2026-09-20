# 11 — Implement Password Change, Recovery, and Administrator Force Reset

## Source and usage

- Source: [Implement Password Change, Recovery, and Administrator Force Reset](https://app.notion.com/p/Implement-Password-Change-Recovery-and-Administrator-Force-Reset-3ac499360293806fad8dec50174659d7).
- Notion ID: `3ac499360293806fad8dec50174659d7`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Implement password change, recovery, and forced reset without allowing administrators to view or set other users' passwords.

## Proposed prerequisites

- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [10 — Implement Registration and Email Verification](10-registration.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Implement change-password with current-password confirmation and the same hashing parameters as login.
2. Implement request-password-reset, validate-reset-token, and complete-reset with digest storage, expiry, and single-use consumption.
3. Offer administrator-force-reset only to authorized administrators; never return a password or token to the administrator.
4. Revoke previous sessions after every successful password change/reset.
5. Create localized change, forgotten-password, reset, and administrator-confirmation screens; do not add periodic password expiry.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Recovery returns the same response for existing and unknown emails.
- [ ] Tokens expire, are single-use, and are persisted only as digests.
- [ ] Reset/change revokes sessions and administrators cannot set another user's password.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

No specific contradiction is highlighted in this summary. Cross-cutting decisions in the pending-decisions register still apply. Empty source fields do not authorize expanding scope.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
