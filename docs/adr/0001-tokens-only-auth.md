# ADR‑0001: Tokens‑only Authentication

**Status**: Accepted

## Context
DungeonDirectory avoids cookies for auth; access + refresh tokens are sent via headers.

## Decision
Implement JWT access tokens (15 min) and rotating refresh tokens (7 days) in `Authorization` and `Refresh` headers.

## Consequences
No CSRF layer needed; requires secure storage on clients.
