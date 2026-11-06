import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Conversation } from '../../src/types';

// Initial sample data demonstrating real UI with streaks and disappearing messages
const SAMPLE_CONVERSATIONS: (Conversation & { streak?: number; isDisappearing?: boolean })[] = [
  {
    id: 'conv_1',
    participantId: 'usr_2',
    participantUsername: 'elena_roche',
    participantDisplayName: 'Elena Roche',
    lastMessage: 'Check out the snap I sent you! ⚡',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
    unreadCount: 2,
    disappearingTtl: 86400,
    updatedAt: Date.now() - 1000 * 60 * 5,
    streak: 18,
    isDisappearing: true,
  },
  {
    id: 'conv_2',
    participantId: 'usr_3',
    participantUsername: 'marcus_k',
    participantDisplayName: 'Marcus Vance',
    lastMessage: 'Encrypted payload received. All clear.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    unreadCount: 0,
    disappearingTtl: 3600,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    streak: 42,
    isDisappearing: true,
  },
  {
    id: 'conv_3',
    participantId: 'usr_4',
    participantUsername: 'sophia_l',
    participantDisplayName: 'Sophia Lin',
    lastMessage: 'Are we capturing the eclipse tonight?',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    unreadCount: 0,
    disappearingTtl: 86400,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    streak: 7,
    isDisappearing: false,
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantDisplayName.toLowerCase().includes(search.toLowerCase()) ||
      c.participantUsername.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const formatTimestamp = (ts: number) => {
    const diffMins = Math.floor((Date.now() - ts) / (1000 * 60));
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  return (
    <ScreenContainer>
      <Header
        title="Chats"
        showBack={false}
        rightElement={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/(tabs)/friends')}
            >
              <Ionicons name="person-add-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.searchSection}>
        <Input
          placeholder="Search encrypted conversations..."
          value={search}
          onChangeText={setSearch}
          leftElement={<Ionicons name="search" size={18} color={Colors.textMuted} />}
          containerStyle={styles.searchContainer}
        />
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRow}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: item.id,
                  name: item.participantDisplayName,
                  username: item.participantUsername,
                },
              })
            }
          >
            <Avatar name={item.participantDisplayName} size={50} hasStory />

            <View style={styles.chatInfo}>
              <View style={styles.chatHeaderRow}>
                <View style={styles.nameRow}>
                  <Text style={[Typography.headline, styles.participantName]}>
                    {item.participantDisplayName}
                  </Text>
                  {item.streak ? <Badge type="streak" value={item.streak} /> : null}
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(item.lastMessageTimestamp)}</Text>
              </View>

              <View style={styles.messageRow}>
                <Text
                  style={[
                    Typography.body,
                    styles.lastMessageText,
                    item.unreadCount > 0 && styles.unreadMessageText,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>

                <View style={styles.badgesRow}>
                  {item.isDisappearing && (
                    <Badge type="disappearing" value="24h" />
                  )}
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadWrapper}>
                      <Badge type="unread" value={item.unreadCount} />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.border} />
            <Text style={[Typography.headline, styles.emptyTitle]}>No conversations yet</Text>
            <Text style={[Typography.body, styles.emptyText]}>
              Find friends or capture a snap to start an end-to-end encrypted chat.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchContainer: {
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  participantName: {
    color: Colors.text,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessageText: {
    color: Colors.textSecondary,
    flex: 1,
    marginRight: Spacing.md,
  },
  unreadMessageText: {
    color: Colors.text,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unreadWrapper: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.massive,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
