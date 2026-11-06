import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';

const SAMPLE_FRIENDS = [
  {
    id: 'usr_2',
    displayName: 'Elena Roche',
    username: 'elena_roche',
    streak: 18,
    isOnline: true,
  },
  {
    id: 'usr_3',
    displayName: 'Marcus Vance',
    username: 'marcus_k',
    streak: 42,
    isOnline: false,
  },
  {
    id: 'usr_4',
    displayName: 'Sophia Lin',
    username: 'sophia_l',
    streak: 7,
    isOnline: true,
  },
];

const SAMPLE_REQUESTS = [
  {
    id: 'req_1',
    displayName: 'Liam O\'Connor',
    username: 'liam_oc',
  },
];

export default function FriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState(SAMPLE_FRIENDS);
  const [requests, setRequests] = useState(SAMPLE_REQUESTS);

  const handleAcceptRequest = (id: string) => {
    const accepted = requests.find((r) => r.id === id);
    if (accepted) {
      setRequests(requests.filter((r) => r.id !== id));
      setFriends([
        ...friends,
        {
          id: accepted.id,
          displayName: accepted.displayName,
          username: accepted.username,
          streak: 0,
          isOnline: true,
        },
      ]);
    }
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <ScreenContainer>
      <Header
        title="Friends"
        showBack={false}
        rightElement={
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => Alert.alert('Add Friend', 'Enter a username to send an encrypted friend request.')}
          >
            <Ionicons name="person-add" size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchSection}>
        <Input
          placeholder="Search friends by username..."
          value={search}
          onChangeText={setSearch}
          leftElement={<Ionicons name="search" size={18} color={Colors.textMuted} />}
          containerStyle={styles.searchContainer}
        />
      </View>

      <FlatList
        data={friends.filter(
          (f) =>
            f.displayName.toLowerCase().includes(search.toLowerCase()) ||
            f.username.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {requests.length > 0 && (
              <View style={styles.requestsSection}>
                <Text style={[Typography.subhead, styles.sectionHeaderTitle]}>
                  FRIEND REQUESTS ({requests.length})
                </Text>
                {requests.map((req) => (
                  <View key={req.id} style={styles.requestCard}>
                    <Avatar name={req.displayName} size={44} />
                    <View style={styles.requestInfo}>
                      <Text style={[Typography.headline, styles.requestName]}>
                        {req.displayName}
                      </Text>
                      <Text style={[Typography.caption, styles.requestUsername]}>
                        @{req.username}
                      </Text>
                    </View>
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAcceptRequest(req.id)}
                      >
                        <Ionicons name="checkmark" size={18} color={Colors.textInverse} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleRejectRequest(req.id)}
                      >
                        <Ionicons name="close" size={18} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text style={[Typography.subhead, styles.sectionHeaderTitle]}>
              MY FRIENDS ({friends.length})
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <View style={styles.friendLeft}>
              <Avatar name={item.displayName} size={48} />
              <View style={styles.friendDetails}>
                <View style={styles.friendNameRow}>
                  <Text style={[Typography.headline, styles.friendName]}>{item.displayName}</Text>
                  {item.streak > 0 && <Badge type="streak" value={item.streak} />}
                </View>
                <Text style={[Typography.caption, styles.friendUsername]}>@{item.username}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatActionBtn}
              onPress={() =>
                router.push({
                  pathname: '/chat/[id]',
                  params: {
                    id: `conv_${item.id}`,
                    name: item.displayName,
                    username: item.username,
                  },
                })
              }
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchContainer: {
    marginBottom: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  requestsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderTitle: {
    color: Colors.textMuted,
    marginVertical: Spacing.md,
    letterSpacing: 0.5,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  requestInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  requestName: {
    color: Colors.text,
  },
  requestUsername: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  acceptBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendDetails: {
    marginLeft: Spacing.md,
  },
  friendNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  friendName: {
    color: Colors.text,
  },
  friendUsername: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chatActionBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
