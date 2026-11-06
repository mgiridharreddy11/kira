import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from '../src/features/authentication/authContext';
import { Colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <View style={styles.container}>
            <StatusBar style="light" backgroundColor={Colors.background} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/verify" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/profile-setup" options={{ headerShown: false }} />
              <Stack.Screen name="chat/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="camera/preview" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="vault/index" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="settings/index" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="settings/privacy" options={{ headerShown: false, animation: 'slide_from_right' }} />
            </Stack>
          </View>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
