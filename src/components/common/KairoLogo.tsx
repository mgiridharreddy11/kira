import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface KairoLogoProps {
  size?: number;
  showText?: boolean;
}

export const KairoLogo: React.FC<KairoLogoProps> = ({ size = 64, showText = false }) => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="kairoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00F0FF" />
            <Stop offset="100%" stopColor="#7928CA" />
          </LinearGradient>
          <LinearGradient id="innerGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        {/* Outer Celestial Eclipse Ring */}
        <Circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#kairoGrad)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="180 30"
          strokeLinecap="round"
        />

        {/* Inner Luminary Orb representing Ephemeral Presence */}
        <Circle
          cx="50"
          cy="50"
          r="22"
          fill="url(#innerGlow)"
        />

        {/* Central Disappearing Focal Spark */}
        <Circle
          cx="50"
          cy="50"
          r="8"
          fill="#00F0FF"
        />

        {/* Dynamic Horizon Arc */}
        <Path
          d="M 28 50 Q 50 32 72 50"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[Typography.hero, styles.logoTitle]}>KAIRO</Text>
          <Text style={[Typography.badge, styles.logoTagline]}>CAPTURE • CONNECT • DISAPPEAR</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  logoTitle: {
    color: Colors.text,
    letterSpacing: 4,
    fontWeight: '900',
  },
  logoTagline: {
    color: Colors.primary,
    marginTop: 4,
    letterSpacing: 2,
    fontSize: 10,
  },
});
