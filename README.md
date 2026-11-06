# Kairo Chat

> **Capture. Connect. Disappear.**  
> A privacy-first, camera-first, local-first Android social messaging application.

---

## Features

- **Camera-First Landing**: The camera is the default opening screen after authentication.
- **End-to-End Encrypted (E2EE) Messaging**: One-to-one chats with disappearing message timers and zero plaintext on the server.
- **Original Streak System**: Daily streak tracking calculated using server-side authoritative UTC timestamps.
- **Private Vault**: Device-only, AES-256-GCM encrypted media storage with biometric/PIN unlock and no cloud backup.
- **Ephemeral Stories**: Encrypted 24-hour stories with viewer tracking.
- **Privacy-Preserving Contact Discovery**: Salted HMAC-SHA256 phone hashing with no plaintext phone disclosure.

---

## Quick Start Guide

For comprehensive setup instructions, see [docs/HOW_TO_RUN.md](file:///Users/giri11/kira/docs/HOW_TO_RUN.md).

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
# Start Metro bundler
npm start

# Press 'a' to run on your connected Android emulator
```

### 3. Development Credentials
- **Phone**: `+1 555 000 1234`
- **OTP**: `123456`

---

## Documentation

- [Architecture Specification](file:///Users/giri11/kira/docs/ARCHITECTURE.md)
- [Database Schema](file:///Users/giri11/kira/docs/DATABASE.md)
- [Security & Cryptography](file:///Users/giri11/kira/docs/SECURITY.md)
- [Development Guide](file:///Users/giri11/kira/docs/DEVELOPMENT.md)
- [Progress Tracker](file:///Users/giri11/kira/docs/PROGRESS.md)
- [How to Run](file:///Users/giri11/kira/docs/HOW_TO_RUN.md)

