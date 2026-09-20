# 09 — Implement Secure Login, Logout, and Session Management

## Source and usage

- Source: [Implement Secure Login, Logout, and Session Management](https://app.notion.com/p/Implement-Secure-Login-Logout-and-Session-Management-3ab4993602938059950ad70dd8d2e9e9).
- Notion ID: `3ab4993602938059950ad70dd8d2e9e9`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: Implement Self-Service Profile and Account Preferences.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Authenticate eligible users and maintain revocable ReLiS sessions, using a short-lived JWT in a secure cookie and URL-based project context.

## Proposed prerequisites

- [03 — Create control Prisma schema](03-control-prisma.md)
- [05 — Implement API app shell](05-api-shell.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Implement Control DB credentials using asynchronous crypto.scrypt, versioned parameters, and a random salt of at least 16 bytes; compare derived keys in constant time and rehash after login when needed.
2. Implement login, current user, logout, and renewal where applicable; reject archived, disabled, or unverified accounts.
3. Issue JWTs in an HttpOnly, Secure, SameSite=Lax cookie. Validate signature, issuer, audience, expiry, session ID, and revocation/token version on every protected request.
4. Keep claims minimal: subject, session, issued/expiry times, issuer, audience, token ID, and version if needed; retrieve roles and permissions from the database.
5. Keep signing keys in secret configuration with kid; apply rate limiting, CSRF protection, and non-enumerating responses.
6. Create localized screens, safe return paths after expiry, and immediate web-state clearing on logout.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Login → current identity → logout works for an eligible account.
- [ ] Missing, invalid, revoked, and expired sessions are rejected.
- [ ] No bearer token is stored in localStorage/sessionStorage and no active project is stored in the session.
- [ ] Credential/status errors do not reveal whether an email exists.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

There is an explicit circular dependency with profile management. Proposal: implement current identity and a minimal session first, then profile and integration; retain the cycle as a planning issue.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
