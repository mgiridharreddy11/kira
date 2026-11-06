/**
 * Kairo Chat Local Client Database Schema (SQLite)
 * Local-First, Encrypted-at-Rest
 */

export const SQLITE_SCHEMA = {
  TABLE_CONVERSATIONS: `
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      participant_user_id TEXT NOT NULL,
      participant_username TEXT NOT NULL,
      participant_display_name TEXT NOT NULL,
      participant_avatar_uri TEXT,
      last_message_id TEXT,
      last_message_content_preview TEXT,
      last_message_timestamp INTEGER NOT NULL,
      unread_count INTEGER DEFAULT 0,
      disappearing_message_ttl INTEGER DEFAULT 86400,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
  `,

  TABLE_MESSAGES: `
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      message_type TEXT NOT NULL CHECK(message_type IN ('text', 'photo', 'video', 'voice', 'snap')),
      encrypted_content TEXT NOT NULL,
      media_blur_hash TEXT,
      media_duration INTEGER,
      delivery_status TEXT DEFAULT 'pending' CHECK(delivery_status IN ('pending', 'sent', 'delivered', 'read')),
      is_disappearing INTEGER DEFAULT 1,
      expires_at INTEGER,
      viewed_at INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at ASC);
    CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at);
  `,

  TABLE_VAULT: `
    CREATE TABLE IF NOT EXISTS vault_items (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      encrypted_file_path TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      duration INTEGER,
      initialization_vector TEXT NOT NULL,
      auth_tag TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_vault_created ON vault_items(created_at DESC);
  `,

  TABLE_STREAKS: `
    CREATE TABLE IF NOT EXISTS streaks (
      friend_user_id TEXT PRIMARY KEY,
      streak_count INTEGER DEFAULT 0,
      last_activity_utc INTEGER NOT NULL,
      expires_at_utc INTEGER NOT NULL,
      state TEXT DEFAULT 'active' CHECK(state IN ('active', 'warning', 'broken')),
      longest_streak INTEGER DEFAULT 0
    );
  `,
};

