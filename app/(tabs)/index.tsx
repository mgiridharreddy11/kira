import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/features/authentication/authContext';

export default function CameraScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  // Video recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          skipProcessing: false,
        });

        if (photo?.uri) {
          router.push({
            pathname: '/camera/preview',
            params: { mediaUri: photo.uri, mediaType: 'photo' },
          });
        }
      } catch (e: any) {
        Alert.alert('Camera Error', e.message || 'Could not capture photo.');
      }
    }
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      case 'off':
      default:
        return 'flash-off';
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={[Typography.body, styles.loadingText]}>Initializing Kairo Optics...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="camera-reverse-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={[Typography.title1, styles.permissionTitle]}>Camera Access Needed</Text>
          <Text style={[Typography.body, styles.permissionBody]}>
            Kairo Chat is a camera-first messenger. To capture snaps, stories, and encrypted media, please grant camera permission.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Enable Camera</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flash}
      >
        {/* Top Floating Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="person-circle-outline" size={32} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.topRightControls}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/vault')}
            >
              <View style={styles.vaultBadge}>
                <Ionicons name="lock-closed" size={18} color={Colors.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
              <Ionicons name={getFlashIcon()} size={22} color={Colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recording Timer Indicator */}
        {isRecording && (
          <View style={styles.recordingPill}>
            <View style={styles.redDot} />
            <Text style={styles.recordingText}>{recordingSeconds}s</Text>
          </View>
        )}

        {/* Bottom Shutter Dock */}
        <View style={styles.bottomDock}>
          <View style={styles.bottomSpacer} />

          {/* Center Original Shutter Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={takePhoto}
            style={styles.shutterOuterRing}
          >
            <View style={styles.shutterInnerRing}>
              <View style={styles.shutterCore} />
            </View>
          </TouchableOpacity>

          {/* Quick Filter / Gallery Button */}
          <TouchableOpacity
            style={styles.bottomSideBtn}
            onPress={() => router.push('/(tabs)/chats')}
          >
            <Ionicons name="chatbubble" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionIconCircle: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  permissionTitle: {
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  permissionBody: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xl,
  },
  permissionBtnText: {
    ...Typography.headline,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  topBar: {
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(10, 11, 14, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingPill: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginRight: 6,
  },
  recordingText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
  },
  bottomDock: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xxl,
  },
  bottomSpacer: {
    width: 48,
  },
  shutterOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  shutterInnerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  bottomSideBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 11, 14, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
