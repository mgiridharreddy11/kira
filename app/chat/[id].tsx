import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { Header } from '../../src/components/common/Header';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { EncryptedMessage } from '../../src/types';

const INITIAL_MESSAGES: EncryptedMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'usr_2',
    recipientId: 'usr_dev_kairo_001',
    type: 'text',
    content: 'Hey! Did you check out the new E2EE setup?',
    deliveryStatus: 'read',
    isDisappearing: true,
    expiresAt: Date.now() + 86400 * 1000,
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'usr_dev_kairo_001',
    recipientId: 'usr_2',
    type: 'text',
    content: 'Yes, keys stay on-device only. Zero plaintext on server.',
    deliveryStatus: 'read',
    isDisappearing: true,
    expiresAt: Date.now() + 86400 * 1000,
    createdAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'usr_2',
    recipientId: 'usr_dev_kairo_001',
    type: 'text',
    content: 'Check out the snap I sent you! ⚡',
    deliveryStatus: 'read',
    isDisappearing: true,
    expiresAt: Date.now() + 86400 * 1000,
    createdAt: Date.now() - 1000 * 60 * 5,
  },
];

export default function ChatConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name: string; username: string }>();
  const recipientName = params.name || 'Elena Roche';
  const recipientUsername = params.username || 'elena_roche';

  const [messages, setMessages] = useState<EncryptedMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: EncryptedMessage = {
      id: `msg_${Date.now()}`,
      conversationId: params.id || 'conv_1',
      senderId: 'usr_dev_kairo_001',
      recipientId: 'usr_2',
      type: 'text',
      content: inputText.trim(),
      deliveryStatus: 'sent',
      isDisappearing: true,
      expiresAt: Date.now() + 86400 * 1000,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatMessageTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer>
      <Header
        title={recipientName}
        subtitle={`@${recipientUsername}`}
        rightElement={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/(tabs)')}
            >
              <Ionicons name="camera" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Disappearing Message Notice Banner */}
      <View style={styles.disappearingBanner}>
        <Ionicons name="timer-outline" size={14} color={Colors.primary} />
        <Text style={styles.disappearingBannerText}>
          Messages disappear 24 hours after reading. End-to-end encrypted.
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            const isMe = item.senderId === 'usr_dev_kairo_001';
            return (
              <View
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.myMessageWrapper : styles.theirMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myMessageBubble : styles.theirMessageBubble,
                  ]}
                >
                  <Text style={[Typography.body, styles.messageContent]}>{item.content}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaTime}>{formatMessageTime(item.createdAt)}</Text>
                    {isMe && (
                      <Ionicons
                        name={item.deliveryStatus === 'read' ? 'checkmark-done' : 'checkmark'}
                        size={14}
                        color={item.deliveryStatus === 'read' ? Colors.primary : Colors.textMuted}
                        style={styles.deliveryCheck}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.cameraShortcut}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="camera" size={22} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            placeholder="Send encrypted chat..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            style={styles.textInput}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
            onPress={handleSend}
          >
            <Ionicons name="arrow-up" size={20} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  disappearingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 6,
  },
  disappearingBannerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: '#1E2D3B',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  theirMessageBubble: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageContent: {
    color: Colors.text,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  metaTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  deliveryCheck: {
    marginLeft: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cameraShortcut: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    color: Colors.text,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surfaceElevated,
    opacity: 0.5,
  },
});
