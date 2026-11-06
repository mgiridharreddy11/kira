export type MessageType = 'text' | 'photo' | 'video' | 'voice' | 'snap';

export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'read';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  phoneNumber?: string; // Hashed or masked for privacy
  avatarUri?: string;
  bio?: string;
  publicKey: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantUsername: string;
  participantDisplayName: string;
  participantAvatarUri?: string;
  lastMessage?: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  disappearingTtl: number; // in seconds
  updatedAt: number;
}

export interface EncryptedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  type: MessageType;
  content: string; // Plaintext when decrypted on device, ciphertext in transit
  mediaUri?: string;
  mediaDuration?: number;
  deliveryStatus: DeliveryStatus;
  isDisappearing: boolean;
  expiresAt?: number;
  viewedAt?: number;
  createdAt: number;
}

export interface SnapItem {
  id: string;
  senderId: string;
  senderUsername: string;
  mediaUri: string;
  mediaType: 'photo' | 'video';
  durationSeconds: number; // View duration (e.g., 5s, 10s or 1-time view)
  viewCountLimit: number;
  viewsRemaining: number;
  caption?: string;
  filterId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface StoryItem {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUri?: string;
  mediaUri: string;
  mediaType: 'photo' | 'video';
  caption?: string;
  createdAt: number;
  expiresAt: number;
  viewerCount: number;
  isViewed: boolean;
}

export interface StreakInfo {
  friendId: string;
  friendUsername: string;
  streakCount: number;
  state: 'active' | 'warning' | 'broken';
  lastQualifiedTimestampUtc: number;
  expiresAtUtc: number; // Countdown threshold
  longestStreak: number;
}

export interface VaultItem {
  id: string;
  fileName: string;
  encryptedFilePath: string;
  mimeType: 'image/jpeg' | 'image/png' | 'video/mp4';
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  iv: string; // Base64 IV
  authTag: string; // Base64 Auth Tag
  createdAt: number;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: UserProfile;
  isAuthenticated: boolean;
}
