# 13 — Implement Administrator User Directory and Account Lifecycle Management

## Source and usage

- Source: [Implement Administrator User Directory and Account Lifecycle Management](https://app.notion.com/p/Implement-Administrator-User-Directory-and-Account-Lifecycle-Management-3ac49936029380f2ae06dd6208248e09).
- Notion ID: `3ac49936029380f2ae06dd6208248e09`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Create an administrator directory and account lifecycle management while preserving historical attribution.

## Proposed prerequisites

- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [11 — Implement Password Change, Recovery, and Administrator Force Reset](11-password-reset.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Implement list-users, get-user, create-user, update-user-admin, and global-authority assignment for Application Administrators only.
2. Protect the last active administrator from archival or authority removal.
3. Implement archive/restore without permanent deletion; prevent archived users from logging in or receiving new assignments.
4. Integrate force-password-reset with the existing secure flow.
5. Create a searchable, paginated directory, details, memberships, status, verification, history, and high-impact confirmations.
6. Audit actions and preserve historical IDs in project records.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Project Admins cannot access the global directory.
- [ ] The last administrator cannot be archived or demoted.
- [ ] Historical attribution remains intact and reset does not reveal or set another user's password.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

No specific contradiction is highlighted in this summary. Cross-cutting decisions in the pending-decisions register still apply. Empty source fields do not authorize expanding scope.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
