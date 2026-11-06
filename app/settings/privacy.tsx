import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';

export default function PrivacySettingsScreen() {
  const [readReceipts, setReadReceipts] = useState(true);
  const [typingIndicators, setTypingIndicators] = useState(true);
  const [phoneDiscoverability, setPhoneDiscoverability] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(true);

  return (
    <ScreenContainer>
      <Header title="Privacy Controls" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[Typography.caption, styles.groupHeader]}>CHAT PRIVACY</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[Typography.headline, styles.settingTitle]}>Read Receipts</Text>
              <Text style={[Typography.caption, styles.settingDescription]}>
                Let friends know when you have viewed their encrypted messages.
              </Text>
            </View>
            <Switch
              value={readReceipts}
              onValueChange={setReadReceipts}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
              thumbColor={Colors.text}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[Typography.headline, styles.settingTitle]}>Typing Indicators</Text>
              <Text style={[Typography.caption, styles.settingDescription]}>
                Broadcast encrypted typing status in active conversations.
              </Text>
            </View>
            <Switch
              value={typingIndicators}
              onValueChange={setTypingIndicators}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
              thumbColor={Colors.text}
            />
          </View>
        </View>

        <Text style={[Typography.caption, styles.groupHeader]}>IDENTITY & DISCOVERY</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[Typography.headline, styles.settingTitle]}>Phone Discoverability</Text>
              <Text style={[Typography.caption, styles.settingDescription]}>
                Allow friends with your phone number to find your account via blind cryptographic hashes.
              </Text>
            </View>
            <Switch
              value={phoneDiscoverability}
              onValueChange={setPhoneDiscoverability}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
              thumbColor={Colors.text}
            />
          </View>
        </View>

        <Text style={[Typography.caption, styles.groupHeader]}>VAULT SECURITY</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[Typography.headline, styles.settingTitle]}>Biometric Unlock</Text>
              <Text style={[Typography.caption, styles.settingDescription]}>
                Require Fingerprint or Face Authentication to decrypt Private Vault media.
              </Text>
            </View>
            <Switch
              value={biometricUnlock}
              onValueChange={setBiometricUnlock}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
              thumbColor={Colors.text}
            />
          </View>
        </View>

        {/* Technical limitation transparency callout */}
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <View style={styles.noticeTextContainer}>
            <Text style={[Typography.subhead, styles.noticeTitle]}>Notice on Disappearing Media</Text>
            <Text style={[Typography.caption, styles.noticeBody]}>
              While Kairo Chat enforces Android FLAG_SECURE to block OS screenshots, no software can prevent a recipient from capturing screens using a secondary camera. Disappear with confidence, but connect with trust.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
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
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    color: Colors.text,
  },
  settingDescription: {
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    gap: Spacing.md,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    color: Colors.primary,
    marginBottom: 4,
  },
  noticeBody: {
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
