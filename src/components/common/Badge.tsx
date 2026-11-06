import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

export type BadgeType = 'streak' | 'disappearing' | 'unread' | 'verified';

interface BadgeProps {
  type: BadgeType;
  value?: string | number;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  switch (type) {
    case 'streak':
      return (
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={14} color={Colors.streak} />
          {value !== undefined && <Text style={styles.streakText}>{value}</Text>}
        </View>
      );
    case 'disappearing':
      return (
        <View style={styles.disappearingBadge}>
          <Ionicons name="timer-outline" size={12} color={Colors.primary} />
          {value !== undefined && <Text style={styles.disappearingText}>{value}</Text>}
        </View>
      );
    case 'unread':
      return (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{value}</Text>
        </View>
      );
    case 'verified':
      return (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.streakGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 0, 0.4)',
  },
  streakText: {
    ...Typography.badge,
    color: Colors.streak,
    marginLeft: 3,
  },
  disappearingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  disappearingText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 10,
    marginLeft: 2,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
});
