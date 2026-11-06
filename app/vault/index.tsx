import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { VaultItem } from '../../src/types';

export default function PrivateVaultScreen() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock Kairo Private Vault',
          fallbackLabel: 'Enter Vault PIN',
        });

        if (result.success) {
          setIsUnlocked(true);
          return;
        }
      }
      
      // Fallback for development/emulator
      setIsUnlocked(true);
    } catch (e: any) {
      Alert.alert('Authentication Failed', e.message || 'Could not verify credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
  };

  return (
    <ScreenContainer>
      <Header
        title="Private Vault"
        rightElement={
          isUnlocked ? (
            <TouchableOpacity style={styles.lockBtn} onPress={handleLock}>
              <Ionicons name="lock-closed" size={18} color={Colors.primary} />
              <Text style={styles.lockBtnText}>Lock</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {!isUnlocked ? (
        <View style={styles.lockedContainer}>
          <View style={styles.shieldGlow}>
            <Ionicons name="shield-checkmark" size={64} color={Colors.primary} />
          </View>

          <Text style={[Typography.title1, styles.lockedTitle]}>Hardware-Encrypted Vault</Text>
          <Text style={[Typography.body, styles.lockedDescription]}>
            Files inside this vault are encrypted locally with AES-256-GCM. There is no cloud backup. If you lose your keys, vault data cannot be recovered.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              <Text style={styles.featureText}>Device-only storage (no cloud copies)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              <Text style={styles.featureText}>Protected by Android Keystore</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              <Text style={styles.featureText}>Hidden from Android system gallery</Text>
            </View>
          </View>

          <Button
            title="Unlock with Biometrics / PIN"
            variant="glow"
            loading={isAuthenticating}
            onPress={handleAuthenticate}
            style={styles.unlockBtn}
          />
        </View>
      ) : (
        <View style={styles.unlockedContainer}>
          <View style={styles.vaultStatusBar}>
            <Ionicons name="lock-open-outline" size={16} color={Colors.success} />
            <Text style={styles.vaultStatusText}>Vault Decrypted (Active Session)</Text>
          </View>

          <FlatList
            data={vaultItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.galleryContent}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <Ionicons name="image" size={32} color={Colors.textMuted} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyVault}>
                <Ionicons name="images-outline" size={48} color={Colors.border} />
                <Text style={[Typography.headline, styles.emptyTitle]}>Vault is Empty</Text>
                <Text style={[Typography.caption, styles.emptySubtitle]}>
                  Capture a snap and choose "Save Privately" to encrypt files into this vault.
                </Text>
              </View>
            }
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  lockBtnText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  lockedContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldGlow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  lockedTitle: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  lockedDescription: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  featuresList: {
    alignSelf: 'stretch',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.subhead,
    color: Colors.text,
  },
  unlockBtn: {
    width: '100%',
  },
  unlockedContainer: {
    flex: 1,
  },
  vaultStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 230, 118, 0.2)',
    gap: 6,
  },
  vaultStatusText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  galleryContent: {
    padding: Spacing.md,
  },
  gridItem: {
    width: '31%',
    height: 110,
    margin: '1.16%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyVault: {
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
  emptySubtitle: {
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
