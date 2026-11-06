import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/spacing';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  hasStory?: boolean;
  isStoryViewed?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  hasStory = false,
  isStoryViewed = false,
}) => {
  const getInitials = (text: string) => {
    if (!text) return '?';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const ringColor = isStoryViewed ? Colors.border : Colors.primary;

  return (
    <View
      style={[
        styles.ringContainer,
        {
          width: size + (hasStory ? 6 : 0),
          height: size + (hasStory ? 6 : 0),
          borderRadius: BorderRadius.round,
          borderWidth: hasStory ? 2.5 : 0,
          borderColor: ringColor,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: size,
            height: size,
            borderRadius: BorderRadius.round,
          }}
        />
      ) : (
        <View
          style={[
            styles.placeholderContainer,
            {
              width: size,
              height: size,
              borderRadius: BorderRadius.round,
            },
          ]}
        >
          <Text
            style={[
              Typography.headline,
              { fontSize: size * 0.4, color: Colors.primary },
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
