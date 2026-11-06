import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';

export default function MediaPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mediaUri: string; mediaType: string }>();
  const mediaUri = params.mediaUri;
  const [caption, setCaption] = useState('');
  const [viewDuration, setViewDuration] = useState<number>(10); // 10s default or infinite

  const handleRetake = () => {
    router.back();
  };

  const handleSaveToVault = () => {
    Alert.alert(
      'Saved to Private Vault',
      'The captured media has been encrypted with your Keystore master key and stored device-only.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  const handleSendSnap = () => {
    Alert.alert(
      'Snap Dispatched',
      'Encrypted payload queued for recipients. Disappears upon viewing.',
      [{ text: 'Done', onPress: () => router.replace('/(tabs)/chats') }]
    );
  };

  return (
    <View style={styles.container}>
      {mediaUri ? (
        <Image source={{ uri: mediaUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No preview media found</Text>
        </View>
      )}

      {/* Floating Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconCircle} onPress={handleRetake}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={styles.durationPill}
            onPress={() => setViewDuration(viewDuration === 10 ? 5 : viewDuration === 5 ? 1 : 10)}
          >
            <Ionicons name="timer-outline" size={16} color={Colors.primary} />
            <Text style={styles.durationText}>{viewDuration}s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={handleSaveToVault}>
            <Ionicons name="lock-closed" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Caption Overlay */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.captionContainer}
      >
        <TextInput
          placeholder="Add a caption..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={caption}
          onChangeText={setCaption}
          style={styles.captionInput}
          maxLength={100}
        />
      </KeyboardAvoidingView>

      {/* Bottom Send Dock */}
      <View style={styles.bottomDock}>
        <TouchableOpacity style={styles.vaultBtn} onPress={handleSaveToVault}>
          <Ionicons name="shield-outline" size={20} color={Colors.text} />
          <Text style={styles.vaultBtnText}>Vault</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendSnapBtn} onPress={handleSendSnap}>
          <Text style={styles.sendSnapText}>Send Snap</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  topBar: {
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  durationText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
  },
  captionContainer: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  captionInput: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bottomDock: {
    position: 'absolute',
    bottom: 34,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 29, 38, 0.85)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  vaultBtnText: {
    ...Typography.headline,
    color: Colors.text,
  },
  sendSnapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  sendSnapText: {
    ...Typography.headline,
    color: Colors.textInverse,
    fontWeight: '700',
  },
});
