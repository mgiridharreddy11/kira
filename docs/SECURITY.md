# KAIRO CHAT — SECURITY & CRYPTOGRAPHY SPECIFICATION

## 1. Security Philosophy
1. **Never Invent Cryptography**: Only use established, independently audited algorithms (AES-256-GCM, SHA-256, HMAC, X25519/Ed25519).
2. **Zero-Knowledge Backend**: Plaintext message payloads, snap media, and private vault contents are strictly prohibited from touching the backend unencrypted.
3. **Hardware-Backed Key Anchors**: Secret keys on Android devices are bound to the Android Keystore / Hardware Security Module (HSM).
4. **Honest Disappearing Policy**: We never guarantee that disappearing media cannot be physically re-photographed or captured via OS bugs. We make limitations explicit to users.

---

## 2. Cryptographic Protocols

### 2.1 Private Vault Encryption
- **Algorithm**: AES-256-GCM (Galois/Counter Mode) with 128-bit authentication tag and randomized 96-bit Initialization Vector (IV).
- **Master Key Derivation**:
  - Key derived via PBKDF2 (100,000 iterations of SHA-256) with a cryptographic device salt, or directly generated via Android Keystore.
  - Stored inside Android Keystore with biometric authorization requirement (`USER_AUTHENTICATION_REQUIRED`).
- **File Shredding**: When a vault item is deleted, the file is overwritten with random bytes prior to unlinking to prevent unallocated block recovery.

### 2.2 End-to-End Encryption (E2EE)
- **Key Exchange**: Ephemeral Diffie-Hellman over Curve25519 (X25519).
- **Symmetric Cipher**: AES-256-GCM for packet payloads.
- **Identity Verification**: Ed25519 digital signatures to detect Man-In-The-Middle (MITM) attacks during key exchange.
- **Ephemeral Message Retention**: Once decrypted by the recipient client, local messages honor the disappearing message TTL timer and are purged from client SQLite.

### 2.3 Authentication & Phone Privacy
- Phone numbers are never stored in plaintext on the backend or exposed to other users.
- Contact discovery utilizes a client-hashed query approach: `HMAC-SHA256(phone_e164, server_secret_salt)`.
- Sessions use short-lived JWTs (15-minute access tokens) paired with rotating cryptographic refresh tokens anchored in `Expo SecureStore`.

---

## 3. Disappearing Content Technical Limitations Notice
Users are transparently notified within the app:
- Hardware screencaps and third-party recording devices cannot be stopped by software alone.
- Android `FLAG_SECURE` is enforced on sensitive screens (Vault and Snap Viewer) to disable screenshotting where supported by the OS.
