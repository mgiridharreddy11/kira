import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Avatar } from '../../src/components/common/Avatar';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';

const SAMPLE_STORIES = [
  {
    id: 'st_1',
    userId: 'usr_2',
    displayName: 'Elena Roche',
    username: 'elena_roche',
    timeAgo: '2h ago',
    hasUnviewed: true,
  },
  {
    id: 'st_2',
    userId: 'usr_3',
    displayName: 'Marcus Vance',
    username: 'marcus_k',
    timeAgo: '5h ago',
    hasUnviewed: true,
  },
  {
    id: 'st_3',
    userId: 'usr_4',
    displayName: 'Sophia Lin',
    username: 'sophia_l',
    timeAgo: '9h ago',
    hasUnviewed: false,
  },
  {
    id: 'st_4',
    userId: 'usr_5',
    displayName: 'David Chen',
    username: 'david_c',
    timeAgo: '14h ago',
    hasUnviewed: false,
  },
];

export default function StoriesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <ScreenContainer>
      <Header
        title="Stories"
        showBack={false}
        rightElement={
          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="camera" size={20} color={Colors.primary} />
            <Text style={styles.headerAddText}>Add Snap</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* User's Own Story Card */}
        <View style={styles.myStoryCard}>
          <TouchableOpacity
            style={styles.myStoryLeft}
            onPress={() => router.push('/(tabs)')}
          >
            <View style={styles.myAvatarWrapper}>
              <Avatar name="Me" size={54} />
              <View style={styles.addBadge}>
                <Ionicons name="add" size={14} color={Colors.textInverse} />
              </View>
            </View>
            <View style={styles.myStoryInfo}>
              <Text style={[Typography.headline, styles.myStoryTitle]}>My Story</Text>
              <Text style={[Typography.caption, styles.myStorySubtitle]}>
                Tap camera to add an encrypted 24h story
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stories Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title2, styles.sectionTitle]}>Recent Updates</Text>
          <View style={styles.e2eeIndicator}>
            <Ionicons name="shield-checkmark-outline" size={14} color={Colors.primary} />
            <Text style={styles.e2eeText}>E2EE Delivery</Text>
          </View>
        </View>

        {/* Friends Stories List */}
        <View style={styles.storiesGrid}>
          {SAMPLE_STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              activeOpacity={0.8}
              onPress={() => {
                // In milestone 9 this opens the full-screen story player
              }}
            >
              <View style={styles.storyCardBackground}>
                <Avatar
                  name={story.displayName}
                  size={46}
                  hasStory
                  isStoryViewed={!story.hasUnviewed}
                />
              </View>
              <View style={styles.storyCardFooter}>
                <Text style={[Typography.subhead, styles.storyUser]} numberOfLines={1}>
                  {story.displayName}
                </Text>
                <Text style={[Typography.caption, styles.storyTime]}>{story.timeAgo}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Technical Notice Banner */}
        <View style={styles.noticeCard}>
          <Ionicons name="time-outline" size={18} color={Colors.primary} />
          <Text style={styles.noticeText}>
            Stories automatically shred after 24 hours. The server retains zero decrypted media.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  headerAddText: {
    ...Typography.caption,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.lg,
  },
  myStoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  myStoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  myAvatarWrapper: {
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceElevated,
  },
  myStoryInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  myStoryTitle: {
    color: Colors.text,
  },
  myStorySubtitle: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
  },
  e2eeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  e2eeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 11,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  storyCard: {
    width: '47.5%',
    height: 160,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  storyCardBackground: {
    alignItems: 'flex-start',
  },
  storyCardFooter: {
    marginTop: 'auto',
  },
  storyUser: {
    color: Colors.text,
    fontWeight: '600',
  },
  storyTime: {
    color: Colors.textMuted,
    marginTop: 2,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noticeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 16,
  },
});
