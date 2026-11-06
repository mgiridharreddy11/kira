# KAIRO CHAT — DATABASE ARCHITECTURE

## 1. Dual-Tier Storage Design

Kairo Chat operates with two isolated data planes:
1. **Local Client Database (SQLite via Expo SQLite)** — Client-authoritative for private messages, local media indexes, settings, and vault pointers.
2. **Backend Relay Database (PostgreSQL)** — Ephemeral queue, authentication sessions, public keys, social graph relations, and streak metadata.

---

## 2. Local Database Schema (Client Device SQLite)

### 2.1 Conversations Table (`conversations`)
```sql
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  participant_user_id TEXT NOT NULL,
  participant_username TEXT NOT NULL,
  participant_display_name TEXT,
  participant_avatar_uri TEXT,
  last_message_id TEXT,
  last_message_content_preview TEXT,
  last_message_timestamp INTEGER NOT NULL,
  unread_count INTEGER DEFAULT 0,
  disappearing_message_ttl INTEGER DEFAULT 86400, -- in seconds (default 24 hours)
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
```

### 2.2 Messages Table (`messages`)
```sql
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK(message_type IN ('text', 'photo', 'video', 'voice', 'snap')),
  encrypted_content TEXT NOT NULL, -- Ciphertext or encrypted local media URI
  media_blur_hash TEXT,
  media_duration INTEGER,
  delivery_status TEXT DEFAULT 'pending' CHECK(delivery_status IN ('pending', 'sent', 'delivered', 'read')),
  is_disappearing INTEGER DEFAULT 1,
  expires_at INTEGER, -- UTC timestamp when client should securely shred
  viewed_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at);
```

### 2.3 Private Vault Table (`vault_items`)
```sql
CREATE TABLE IF NOT EXISTS vault_items (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  encrypted_file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  initialization_vector TEXT NOT NULL, -- IV used for AES-GCM local encryption
  auth_tag TEXT NOT NULL,              -- GCM auth tag for integrity
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vault_created ON vault_items(created_at DESC);
```

### 2.4 Streaks Table (`streaks`)
```sql
CREATE TABLE IF NOT EXISTS streaks (
  friend_user_id TEXT PRIMARY KEY,
  streak_count INTEGER DEFAULT 0,
  last_activity_utc INTEGER NOT NULL,
  expires_at_utc INTEGER NOT NULL,
  state TEXT DEFAULT 'active' CHECK(state IN ('active', 'warning', 'broken')),
  longest_streak INTEGER DEFAULT 0
);
```

---

## 3. Backend Database Schema (PostgreSQL)

### 3.1 Users Table (`users`)
- `id` (UUID, PK)
- `phone_hash` (TEXT, UNIQUE, HMAC-SHA256 salted hash — no plaintext phone numbers)
- `username` (VARCHAR(30), UNIQUE)
- `display_name` (VARCHAR(50))
- `avatar_key` (TEXT, optional)
- `public_identity_key` (TEXT NOT NULL, Ed25519)
- `public_pre_key` (TEXT NOT NULL, X25519)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 3.2 Friendships Table (`friendships`)
- `id` (UUID, PK)
- `user_id_1` (UUID, FK -> users.id)
- `user_id_2` (UUID, FK -> users.id)
- `status` (TEXT: 'pending', 'accepted', 'blocked')
- `initiator_id` (UUID, FK -> users.id)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 3.3 Ephemeral Relay Queue (`message_envelopes`)
- `id` (UUID, PK)
- `recipient_id` (UUID, FK -> users.id, INDEXED)
- `sender_id` (UUID, FK -> users.id)
- `encrypted_envelope` (BYTEA NOT NULL) -- Server cannot decrypt this payload
- `expires_at` (TIMESTAMPTZ NOT NULL)  -- Hard deletion threshold
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
