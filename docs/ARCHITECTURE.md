# KAIRO CHAT — SYSTEM ARCHITECTURE SPECIFICATION

> **Tagline:** Capture. Connect. Disappear.  
> **Platform:** Android (Expo / React Native) with Local-First Hybrid Architecture  
> **Status:** Active Implementation

---

## 1. High-Level Architecture Overview

Kairo Chat adheres to a **Privacy-First, Camera-First, Local-First** design pattern:

```
+-----------------------------------------------------------------------------------+
|                              KAIRO CHAT CLIENT (Android)                          |
|                                                                                   |
|  +--------------------+  +---------------------+  +----------------------------+  |
|  |     Camera Hub     |  |    Encrypted Chat   |  |        Private Vault       |  |
|  |  (Default Landing) |  |   (Local SQLite)    |  |     (Keystore + AES-GCM)   |  |
|  +--------------------+  +---------------------+  +----------------------------+  |
|             \                       |                       /                     |
|              \                      |                      /                      |
|      +-------------------------------------------------------------+              |
|      |               Local Security & Storage Layer                |              |
|      |    - Android Keystore Hardware-backed Master Keys           |              |
|      |    - Expo SecureStore for Auth & Identity Sessions          |              |
|      |    - Encrypted SQLite for Messages, Streaks, Stories        |              |
|      |    - Scoped Filesystem for Local Cached Media               |              |
|      +-------------------------------------------------------------+              |
+----------------------------------------+------------------------------------------+
                                         |  TLS 1.3 / E2EE Payloads
                                         v
+-----------------------------------------------------------------------------------+
|                             KAIRO BACKEND RELAY ENGINE                            |
|                                                                                   |
|  +--------------------+  +---------------------+  +----------------------------+  |
|  |  E2EE Relay Router |  | Auth / Session Mgr  |  |  Streak & Sync Authority   |  |
|  |  (WebSocket / WSS) |  |    (OTP Engine)     |  |   (Server-Side Time Guard) |  |
|  +--------------------+  +---------------------+  +----------------------------+  |
|             \                       |                       /                     |
|              +----------------------+----------------------+                      |
|                                     |                                             |
|                                     v                                             |
|                       PostgreSQL Zero-Knowledge Store                             |
|             - Identity Keys (Ed25519/X25519 public keys)                          |
|             - Ephemeral Encrypted Message Queues (TTL-based)                      |
|             - Social graph & Friend Relationships                                 |
|             - NO PLAINTEXT MESSAGES, NO VAULT MEDIA STORAGE                      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pillars

### 2.1 Camera-First Interaction Model
- When an authenticated user launches Kairo Chat, the default landing view is immediately the **Camera Screen**.
- Left swipe navigates to **Chats**, Right swipe navigates to **Stories**, Downward or top header access navigates to **Friends** and **Profile / Private Vault**.

### 2.2 Local-First Storage Guarantee
- All message history resides exclusively on the user's Android device inside encrypted local storage.
- If a device is uninstalled without local export, conversation history is gone. The backend does not keep a permanent archive of chats.

### 2.3 Ephemeral Relay Mechanism
- Messages sent to online recipients are delivered over low-latency WebSockets.
- If the recipient is offline, the message envelope (encrypted with the recipient's public key) is held in an ephemeral backend queue with a 14-day TTL. Once delivered, it is purged immediately.

### 2.4 Authoritative Server Clock for Streaks
- Device clocks can be manipulated by users. To prevent streak tampering, all streak qualification, milestone calculation, and expiry checks are computed using authoritative UTC timestamps from the backend.

---

## 3. Directory Layout

```
KairoChat/
├── app/                  # Expo Router file-based route definitions
│   ├── _layout.tsx       # Root layout (Theme, Safe Area, Global Providers)
│   ├── (auth)/           # Phone registration, OTP, profile setup
│   ├── (tabs)/           # Core tab navigator (Camera, Chats, Stories, Friends)
│   ├── camera/           # Camera preview, filters, captioning, send selector
│   ├── chat/             # 1-to-1 E2EE encrypted chat screens
│   ├── friends/          # Search, profile discovery, requests
│   ├── stories/          # Story creator & story viewer
│   ├── vault/            # Biometric/PIN-protected local private vault
│   └── settings/         # Privacy, account, disappearing message configs
├── src/
│   ├── components/       # Reusable Atomic UI components
│   ├── constants/        # App-wide constants (routes, limits, intervals)
│   ├── database/         # Local SQLite schema & encrypted migrations
│   ├── features/         # Feature logic (auth, camera, messaging, streaks, vault)
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation helpers & deep link managers
│   ├── security/         # Keystore, crypto wrappers, biometric auth
│   ├── theme/            # Kairo Dark-First design tokens (colors, typography)
│   ├── types/            # TypeScript interfaces and contracts
│   └── utils/            # Formatting, time, validation utilities
├── backend/              # Node.js / TypeScript Relay & Auth Server
│   ├── src/              # Modules (auth, messaging, streaks, websocket)
│   └── tests/            # Integration & unit test suites
└── docs/                 # Architectural & engineering documentation
```
