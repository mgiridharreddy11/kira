# KAIRO CHAT — BACKEND RELAY ENGINE

Zero-Knowledge Ephemeral Relay & Streak Sync Authority.

## Core Responsibilities
1. **Zero-Knowledge Envelope Routing**: Forwards encrypted payloads between active clients over WebSockets without plaintext visibility.
2. **Authoritative Clock**: Supplies UTC timestamps for streak qualification and milestone calculation.
3. **Ephemeral Queues**: Queues undelivered encrypted envelopes with a strict TTL.
4. **Phone Hash Discovery**: Queries salted HMAC-SHA256 hashes for friend discovery without exposing raw phone numbers.
