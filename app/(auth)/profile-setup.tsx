import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Avatar } from '../../src/components/common/Avatar';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/features/authentication/authContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { completeProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (!displayName.trim() || !username.trim()) {
      setError('Please provide both display name and username.');
      return;
    }

    setLoading(true);
    const result = await completeProfile(username.trim().toLowerCase(), displayName.trim());
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Failed to update profile.');
    }
  };

  return (
    <ScreenContainer>
      <Header title="Create Profile" showBack={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <Avatar name={displayName || 'Kairo'} size={88} />
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Ionicons name="camera" size={16} color={Colors.primary} />
              <Text style={styles.changePhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Input
              label="DISPLAY NAME"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="e.g. Alex Vance"
              autoFocus
            />

            <Input
              label="USERNAME"
              value={username}
              onChangeText={(text) => setUsername(text.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="e.g. alex_vance"
              autoCapitalize="none"
              error={error || undefined}
              leftElement={<Text style={styles.atSymbol}>@</Text>}
            />

            <View style={styles.infoCard}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoCardText}>
                Your identity keys will be generated and anchored securely in your Android Keystore.
              </Text>
            </View>

            <Button
              title="Enter Kairo Chat"
              variant="glow"
              loading={loading}
              onPress={handleFinish}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changePhotoText: {
    ...Typography.caption,
    color: Colors.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  formSection: {
    marginTop: Spacing.md,
  },
  atSymbol: {
    ...Typography.headline,
    color: Colors.primary,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCardText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
});
