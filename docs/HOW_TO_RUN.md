# How to Run Kairo Chat

This guide explains how to install dependencies and run the Kairo Chat mobile application and backend relay server.

---

## 1. Prerequisites

Before running Kairo Chat, ensure you have the following installed on your machine:

1. **Node.js**: v20 or v24+ (verify with `node -v`)
2. **npm**: v10+ (verify with `npm -v`)
3. **Android Studio**:
   - Android SDK (API 34 or 35)
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools (contains `adb`)
   - An Android Virtual Device (AVD) configured and running

---

## 2. Free Up Disk Space (Important)

If you recently experienced a `no space left on device` error:
- Clear your npm cache: `npm cache clean --force`
- Empty the Trash on your Mac.
- Delete unused Android virtual devices or simulator caches in Android Studio.
- Ensure at least **5–10 GB of free disk space** for `node_modules` and Android build artifacts.

---

## 3. Installing Dependencies

In the project root (`/Users/giri11/kira`):

```bash
# Install mobile client dependencies
npm install
```

To install the optional backend relay server dependencies:

```bash
cd backend
npm install
cd ..
```

---

## 4. Launching the Android Emulator

1. Open **Android Studio**.
2. Click on **Virtual Device Manager** (or **Device Manager**).
3. Start an existing Android emulator (Pixel 7 / Pixel 8 with Android 14/15 is recommended).
4. Verify the emulator is connected by running:
   ```bash
   adb devices
   ```
   You should see `emulator-5554 device` listed.

---

## 5. Starting the Mobile Application

### Step 1: Start the Metro Bundler
In your terminal, inside `/Users/giri11/kira`:

```bash
npm start
```
or with a clean cache:
```bash
npx expo start -c
```

### Step 2: Open on Android Emulator
Once Metro is running in your terminal:
- Press **`a`** on your keyboard to automatically open the app on your Android emulator.
- Metro will build the JavaScript bundle and launch **Kairo Chat**.

---

## 6. Development & Testing (Mock Auth Mode)

Kairo Chat is configured by default with **Development Mock Auth Mode**:
- **Test Phone Number**: `+1 555 000 1234`
- **Test OTP Code**: `123456`
- On the verification screen, you can also tap **"Autofill Dev Code (123456)"** to immediately log in.

Once verified:
1. **Camera Screen** opens as the default landing view.
2. The bottom bar lets you switch between:
   - **Chats**: View E2EE encrypted conversation previews and active streaks.
   - **Camera**: Center shutter button with flip and flash controls.
   - **Stories**: Encrypted 24-hour disappearing stories feed.
   - **Friends**: Friend requests, user search, and streaks overview.
3. Tap the **Lock icon** in the top bar to test the **Private Vault** with local biometrics/PIN simulation.
4. Tap the **Profile / Settings icon** to manage privacy controls, disappearing message timers, and account settings.

---

## 7. Starting the Backend Relay (Optional)

In a separate terminal window:

```bash
cd backend
npm run dev
```

The relay server will start on port `4000` (`http://localhost:4000/health`) and begin listening for WebSocket E2EE envelope routing.

