export const APP_CONFIG = {
  appName: 'Kairo Chat',
  version: '1.0.0',
  tagline: 'Capture. Connect. Disappear.',
  
  // Storage keys in SecureStore
  STORAGE_KEYS: {
    AUTH_TOKEN: 'kairo_auth_token',
    REFRESH_TOKEN: 'kairo_refresh_token',
    USER_PROFILE: 'kairo_user_profile',
    PRIVATE_KEY: 'kairo_private_identity_key',
    PUBLIC_KEY: 'kairo_public_identity_key',
    VAULT_PIN_HASH: 'kairo_vault_pin_hash',
    VAULT_BIOMETRIC_ENABLED: 'kairo_vault_bio_enabled',
    VAULT_SALT: 'kairo_vault_salt',
  },

  // Disappearing messages presets
  DISAPPEARING_TTL_OPTIONS: [
    { label: 'Off', seconds: 0 },
    { label: 'Instant (after viewing)', seconds: -1 },
    { label: '5 Minutes', seconds: 300 },
    { label: '1 Hour', seconds: 3600 },
    { label: '24 Hours (Default)', seconds: 86400 },
    { label: '7 Days', seconds: 604800 },
  ],

  // Streak Rules
  STREAK: {
    QUALIFICATION_WINDOW_HOURS: 24,
    EXPIRY_WARNING_HOURS: 4, // Show warning badge when < 4h left
  },

  // Vault Rules
  VAULT: {
    AUTO_LOCK_TIMEOUT_MS: 60 * 1000, // 60 seconds of backgrounding
    MAX_FAILED_ATTEMPTS: 5,
  },

  // Mock Authentication for local development
  MOCK_AUTH: {
    ENABLED: true,
    PHONE: '+15550001234',
    OTP: '123456',
    MOCK_USER: {
      id: 'usr_dev_kairo_001',
      username: 'kairo_explorer',
      displayName: 'Kairo Pioneer',
      publicKey: 'mock_ed25519_pk_pioneer_001',
      createdAt: Date.now(),
    },
  },
} as const;
