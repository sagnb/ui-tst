# 12 — Implement Self-Service Profile and Account Preferences

## Source and usage

- Source: [Implement Self-Service Profile and Account Preferences](https://app.notion.com/p/Implement-Self-Service-Profile-and-Account-Preferences-3ac4993602938004b9d2dd0b4a13c8a0).
- Notion ID: `3ac4993602938004b9d2dd0b4a13c8a0`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: Implement Secure Login, Logout, and Session Management.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Allow users to manage their profile details, picture, language, and verified email changes.

## Proposed prerequisites

- [07 — Implement upload/storage service](07-storage.md)
- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [10 — Implement Registration and Email Verification](10-registration.md)
- [11 — Implement Password Change, Recovery, and Administrator Force Reset](11-password-reset.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define an explicit editable-field allowlist; exclude global authority, project role, account status, and verification state.
2. Implement get-my-profile, update-my-profile, start-email-change, and confirm-email-change for the current user only.
3. Reuse email verification; retain the verified address until the change flow completes.
4. Integrate upload-profile-picture and remove-profile-picture with storage and type/size validation.
5. Create the Account page with identity, email, language, picture, status, and a security/password link.

## Verification and completion criteria

The source Acceptance criteria property is empty. The checklist below is proposed from the other requirements.

- [ ] Users cannot modify privileged fields or another user's profile.
- [ ] Email changes only after verification.
- [ ] Pictures use safe references and preferences persist.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Acceptance criteria are empty in the source; checks are proposed. The explicit cycle with login is documented in the pending-decisions index.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
