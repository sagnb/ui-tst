# 15 — Implement Project Context, Roles, and Membership

## Source and usage

- Source: [Implement Project Context, Roles, and Membership](https://app.notion.com/p/Implement-Project-Context-Roles-and-Membership-3ad49936029380d28180d33bc4573a5a).
- Notion ID: `3ad49936029380d28180d33bc4573a5a`.
- Source domain: Project & Protocol Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Use the URL project and current membership as the authorization boundary, with exact account lookup and secure invitations.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [05 — Implement API app shell](05-api-shell.md)
- [06 — Complete job queue and progress platform](06-job-platform.md)
- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [10 — Implement Registration and Email Verification](10-registration.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Define middleware that verifies the URL projectId, state, membership, and role; allow audited global support access.
2. Implement Team, exact normalized username/email lookup, and adding existing accounts; do not offer a global user directory or autocomplete.
3. Implement invitations with a fixed role, random token stored as a hash, expiry, and asynchronous email; check again for an existing account before inviting.
4. Accept an invitation only with verified ownership of its email; consume it once and create one active membership.
5. Prevent duplicate active memberships and invitations; resending invalidates the previous invitation.
6. Implement role changes, removal, and restoration while preserving historical work; show assignment impact and audit actions, including lookup.
7. Keep identities, credentials, invitations, memberships, and roles only in the Control DB.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] The URL project determines access; IDs from another project cannot cross the boundary.
- [ ] Reviewers/Validators/Guests cannot manage the team; Guests cannot mutate data.
- [ ] Removal revokes access without deleting the account or historical work.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

Conflicts block the final contract: PROJECT_ADMIN versus protected PROJECT_OWNER; last Project Manager versus last Project Admin guard; invitations last 7 days in UI/API versus 48 hours in Jobs. Project Managers cannot remove Project Admins. See PENDING-DECISIONS.md.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
