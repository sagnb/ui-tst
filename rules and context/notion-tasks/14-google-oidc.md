# 14 — Implement Google OpenID Connect Sign-In

## Source and usage

- Source: [Implement Google OpenID Connect Sign-In](https://app.notion.com/p/Implement-Google-OpenID-Connect-Sign-In-3ad49936029380e283afd44fe89368d3).
- Notion ID: `3ad49936029380e283afd44fe89368d3`.
- Source domain: Authentication & User Management.
- Source status on 2026-09-20: Not Started; this does not represent local progress.
- Type: adapted English guide with summarized requirements and a proposed technical sequence; not a verbatim transcription.
- Source `Blocked by` relation: not populated. This does not imply the absence of technical dependencies.

First read the [README](README.md), [pending decisions](PENDING-DECISIONS.md), [stack](../stack.yml), and [proposed structure](../project-structure.md). Confirm the target repository and existing implementation before editing code. Paths in the structure are proposals, not evidence of implementation.

## Objective and summarized requirements

Add optional Google authentication using the existing ReLiS session issuer.

## Proposed prerequisites

- [09 — Implement Secure Login, Logout, and Session Management](09-login-sessions.md)
- [10 — Implement Registration and Email Verification](10-registration.md)
- [12 — Implement Self-Service Profile and Account Preferences](12-profile.md)

The dependencies above are implementation inferences. The original Notion relation is preserved separately; any cycles have not been removed.

## Step-by-step instructions for the LLM

1. Configure enablement and approved redirects; keep local login available.
2. Implement authorization code + PKCE with a short-lived, single-use transaction: state digest, nonce, protected verifier, same-origin return path, expiry, and consumption.
3. Validate the transaction before code exchange; validate signature using Google's keys, issuer, audience, azp when applicable, expiry, nonce, and sub; use only openid/email/profile.
4. Identify links by (provider, sub), never automatically link by email; require confirmation with recent authentication or an administrator action.
5. Issue the shared ReLiS session without project roles/context in the JWT; do not persist, log, or return Google tokens or reuse them as a session.
6. Implement link/unlink and block removal of the last approved sign-in method; apply global policy to any verified, unprivileged self-registration.

## Verification and completion criteria

Operational checklist synthesized from the consulted requirements; it is not a complete reproduction of the Acceptance criteria property. The issues below prevent claiming that a contradictory requirement has been satisfied.

- [ ] Replay or invalid state/nonce/PKCE/claims cannot create a session.
- [ ] Google grants no roles, memberships, or authority.
- [ ] Unlinking requires another valid method; secrets/tokens do not leak.
- [ ] Run checks proportionate to the implementation and record actual results, including anything that could not be tested.
- [ ] Report changed files, decisions, and outstanding issues; do not mark a nonexistent integration as complete.

## Gaps and pending decisions

RELIS-T-USER-002 functionally refers to the login task; this identifier was not exposed as a property on the consulted pages.

## Expected implementation deliverable

Implementation of the described scope, verification evidence, updated documentation, and a report of limitations. This file only guides execution; creating it does not implement the feature or update its Notion status.
