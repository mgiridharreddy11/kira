# KAIRO CHAT — DEVELOPMENT GUIDE

## 1. Prerequisites
- **Node.js**: v20+ or v24+ (Current environment: Node v24.19.0, npm 11.17.0)
- **Expo CLI**: Included with `expo` package
- **Android Studio / Android SDK**: For running on Android Emulator or physical device
- **Java Development Kit**: OpenJDK 17 or 21

---

## 2. Installation & Setup

### 2.1 Mobile Application
```bash
# In the project root (/Users/giri11/kira)
npm install
```

### 2.2 Launching the Android Application
```bash
# 1. Start Metro bundler:
npm start

# 2. To run directly on an Android emulator or connected device via USB:
npm run android
```

Alternatively:
- Open the Android emulator in Android Studio first.
- Run `npx expo start -c` to start Metro with a clean cache.
- Press `a` in the terminal to automatically install and launch the Kairo Chat development build on your Android emulator.

---

## 3. Environment Modes

### 3.1 Mock Authentication Mode (Development)
For rapid local testing without active SMS providers, Kairo Chat includes a strictly gated `MOCK_AUTH` configuration:
- Test phone: `+15550001234`
- Test OTP: `123456`
- Active only when `EXPO_PUBLIC_APP_ENV=development`. Disabled automatically in production builds.

### 3.2 Production Mode
Requires backend relay service configuration (`EXPO_PUBLIC_API_URL=https://api.kairochat.app`).
