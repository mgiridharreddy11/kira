import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/features/authentication/authContext';
import { APP_CONFIG } from '../../src/constants';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone: string }>();
  const phone = params.phone || APP_CONFIG.MOCK_AUTH.PHONE;
  const { verifyOtp, sendOtp } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    setError(null);
    setLoading(true);
    const result = await verifyOtp(phone, otp);
    setLoading(false);

    if (result.success) {
      if (result.isNewUser) {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setError(result.error || 'Invalid code.');
    }
  };

  const handleResend = async () => {
    if (countdown === 0) {
      await sendOtp(phone);
      setCountdown(30);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Verification" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            </View>
            <Text style={[Typography.title1, styles.title]}>Enter 6-Digit Code</Text>
            <Text style={[Typography.body, styles.subtitle]}>
              A secure verification code was sent to <Text style={styles.phoneHighlight}>{phone}</Text>
            </Text>
          </View>

          <View style={styles.formSection}>
            <Input
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                if (error) setError(null);
              }}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              error={error || undefined}
              style={styles.otpInput}
            />

            {APP_CONFIG.MOCK_AUTH.ENABLED && (
              <TouchableOpacity
                onPress={() => setOtp(APP_CONFIG.MOCK_AUTH.OTP)}
                style={styles.mockAutofill}
              >
                <Ionicons name="flash-outline" size={16} color={Colors.primary} />
                <Text style={styles.mockAutofillText}>Autofill Dev Code ({APP_CONFIG.MOCK_AUTH.OTP})</Text>
              </TouchableOpacity>
            )}

            <Button
              title="Verify & Continue"
              variant="glow"
              loading={loading}
              disabled={otp.length < 6}
              onPress={handleVerify}
              style={styles.verifyBtn}
            />

            <View style={styles.resendRow}>
              <Text style={styles.resendPrompt}>Didn't receive code? </Text>
              {countdown > 0 ? (
                <Text style={styles.countdownText}>Resend in {countdown}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendAction}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
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
  topSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  title: {
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phoneHighlight: {
    color: Colors.text,
    fontWeight: '700',
  },
  formSection: {
    marginTop: Spacing.lg,
  },
  otpInput: {
    fontSize: 28,
    letterSpacing: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
  mockAutofill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  mockAutofillText: {
    ...Typography.caption,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  verifyBtn: {
    marginTop: Spacing.sm,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  resendPrompt: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  countdownText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  resendAction: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
