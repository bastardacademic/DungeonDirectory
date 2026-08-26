# ADR‑0001: Token‑based Authentication (No Cookies)

**Status**: Accepted

## Context
DungeonDirectory requires stateless scaling and a niche audience wary of cross‑site tracking.

## Decision
Use short‑lived JWT access tokens and rotating refresh tokens in Authorization headers; no cookies -> no CSRF requirement.

## Consequences
* Easy horizontal scaling
* Clients must store tokens securely (SecureStore/localStorage)
