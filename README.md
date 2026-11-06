# Kairo Chat (kira)

> **Capture. Connect. Disappear.**  
> A privacy-first, camera-first, local-first Android social messaging application inspired by the spirit of ephemeral moments.

---

## 🚀 Overview

Kairo Chat is an end-to-end encrypted (E2EE), camera-first messaging application built with React Native and Expo. It emphasizes user privacy, device-only local encrypted storage, and real-time multimedia interactions without retaining plaintext data or vault media on any cloud server.

---

## ✨ Features

- 📸 **Camera-First Landing**: The camera is the default opening screen immediately upon app launch.
- 🔒 **End-to-End Encrypted (E2EE) Messaging**: One-to-one real-time conversations with disappearing message TTLs and zero-knowledge routing.
- 🔥 **Original Streak System**: Daily streak tracking calculated using server-side authoritative UTC timestamps to prevent client-side clock tampering.
- 🛡️ **Private Vault**: Device-only, hardware-backed AES-256-GCM encrypted media gallery protected with biometrics and PIN.
- ⭕ **Ephemeral Stories**: Encrypted 24-hour stories feed with viewer tracking.
- 👤 **Privacy-Preserving Contact Discovery**: Salted HMAC-SHA256 phone hashing with no plaintext phone disclosure.

---

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Routing**: Expo Router (file-based navigation)
- **Local Storage**: Encrypted SQLite & Expo SecureStore
- **Animation**: React Native Reanimated & React Native Gesture Handler
- **Backend Relay**: Node.js, Express, WebSocket (WSS), PostgreSQL

---

## 📖 Quick Start & Documentation

- [Setup & Run Guide](docs/HOW_TO_RUN.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Database Specifications](docs/DATABASE.md)
- [Security & Cryptography](docs/SECURITY.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Milestone Progress](docs/PROGRESS.md)

---

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Metro bundler
npm start

# 3. Press 'a' in terminal to run on your connected Android emulator
```

#### Development Credentials (Mock Auth Mode)
- **Test Phone**: `+1 555 000 1234`
- **Test OTP**: `123456`
