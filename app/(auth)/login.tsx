import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { KairoLogo } from '../../src/components/common/KairoLogo';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/features/authentication/authContext';
import { APP_CONFIG } from '../../src/constants';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const [phone, setPhone] = useState(APP_CONFIG.MOCK_AUTH.PHONE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);

    if (result.success) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone },
      });
    } else {
      setError(result.error || 'Failed to send code.');
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <KairoLogo size={72} showText />
          </View>

          <View style={styles.formContainer}>
            <Text style={[Typography.title1, styles.title]}>Enter Phone Number</Text>
            <Text style={[Typography.body, styles.subtitle]}>
              Kairo Chat verifies accounts with a secure one-time code. Your number is never stored in plaintext or shared.
            </Text>

            <Input
              label="MOBILE NUMBER"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (error) setError(null);
              }}
              placeholder="+1 555 000 1234"
              keyboardType="phone-pad"
              autoFocus
              error={error || undefined}
              leftElement={<Ionicons name="call-outline" size={20} color={Colors.primary} />}
            />

            {APP_CONFIG.MOCK_AUTH.ENABLED && (
              <View style={styles.mockBanner}>
                <Ionicons name="information-circle" size={18} color={Colors.primary} />
                <Text style={styles.mockText}>
                  Dev Mode: Test OTP is <Text style={styles.boldText}>{APP_CONFIG.MOCK_AUTH.OTP}</Text>
                </Text>
              </View>
            )}

            <Button
              title="Continue"
              variant="glow"
              loading={loading}
              onPress={handleSendOtp}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[Typography.caption, styles.termsText]}>
              By continuing, you agree to Kairo Chat's zero-knowledge privacy policy and encryption terms.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  formContainer: {
    marginTop: Spacing.xxl,
  },
  title: {
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  mockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryGlow,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  mockText: {
    ...Typography.caption,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  termsText: {
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
