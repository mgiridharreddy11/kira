import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Avatar } from '../../src/components/common/Avatar';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/features/authentication/authContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Kairo Chat?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account, identity keys, and all local encrypted data. This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <Header title="Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar name={user?.displayName || 'Kairo User'} size={60} />
          <View style={styles.profileInfo}>
            <Text style={[Typography.title2, styles.displayName]}>
              {user?.displayName || 'Kairo Pioneer'}
            </Text>
            <Text style={[Typography.subhead, styles.username]}>
              @{user?.username || 'kairo_explorer'}
            </Text>
            <View style={styles.keyFingerprintRow}>
              <Ionicons name="key-outline" size={12} color={Colors.primary} />
              <Text style={styles.keyText} numberOfLines={1}>
                {user?.publicKey ? user.publicKey.substring(0, 18) + '...' : 'Keystore Active'}
              </Text>
            </View>
          </View>
        </View>

        {/* Security & Privacy Settings Group */}
        <Text style={[Typography.caption, styles.groupHeader]}>SECURITY & PRIVACY</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/settings/privacy')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: Colors.primaryGlow }]}>
                <Ionicons name="shield-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={[Typography.headline, styles.settingLabel]}>Privacy Controls</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/vault')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: 'rgba(121, 40, 202, 0.2)' }]}>
                <Ionicons name="lock-closed-outline" size={20} color="#B388FF" />
              </View>
              <Text style={[Typography.headline, styles.settingLabel]}>Private Vault Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Messaging Preferences */}
        <Text style={[Typography.caption, styles.groupHeader]}>MESSAGING PREFERENCES</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/settings/privacy')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: Colors.streakGlow }]}>
                <Ionicons name="timer-outline" size={20} color={Colors.streak} />
              </View>
              <View>
                <Text style={[Typography.headline, styles.settingLabel]}>Default Disappearing Timer</Text>
                <Text style={[Typography.caption, styles.settingValue]}>24 Hours</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Account Management Group */}
        <Text style={[Typography.caption, styles.groupHeader]}>ACCOUNT</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: Colors.surfaceElevated }]}>
                <Ionicons name="log-out-outline" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={[Typography.headline, styles.settingLabel]}>Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: 'rgba(255, 51, 102, 0.15)' }]}>
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </View>
              <Text style={[Typography.headline, { color: Colors.error }]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={[Typography.caption, styles.footerText]}>Kairo Chat v1.0.0 (Android Build)</Text>
          <Text style={[Typography.caption, styles.footerSubtext]}>
            Capture. Connect. Disappear.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  profileInfo: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  displayName: {
    color: Colors.text,
  },
  username: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  keyFingerprintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  keyText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  groupHeader: {
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    color: Colors.text,
  },
  settingValue: {
    color: Colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 56,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  footerText: {
    color: Colors.textMuted,
  },
  footerSubtext: {
    color: Colors.primaryDark,
    marginTop: 2,
  },
});
