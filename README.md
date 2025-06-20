# Randonet MVP – React Native Expo Project

This guide will help you set up and run the Randonet MVP project on your local machine using React Native and Expo.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm or [Yarn](https://classic.yarnpkg.com/) (npm comes with Node.js)
- [Git](https://git-scm.com/)
- Expo CLI (install with `npm install -g expo-cli`)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LucasRambert4/randonet-mvp-Test.git
cd randonet-mvp-Test
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables (if needed)

If the project uses environment variables, create a `.env` file in the root directory based on the `.env.example` file (if provided).

### 4. Run the Project

Start the development server:

```bash
expo start
# or
npm start
# or
yarn start
```

This will open the Expo Developer Tools in your browser.

### 5. Run on Your Device

You have several options to run the app:

#### Option A: Run on Android Emulator
1. Make sure you have an Android emulator set up.
2. In the Expo Developer Tools, press `a` or click "Run on Android device/emulator".

#### Option B: Run on iOS Simulator (macOS only)
1. Make sure you have Xcode installed.
2. In the Expo Developer Tools, press `i` or click "Run on iOS simulator".

#### Option C: Run on Physical Device
1. Install the **Expo Go** app on your iOS or Android device.
2. Scan the QR code shown in the Expo Developer Tools with your device's camera.
3. The app will open in Expo Go.

## Additional Commands

- `expo doctor`: Checks your project for common issues.
- `expo prebuild`: Generates native iOS and Android project files.
- `expo run:android`: Builds and runs the app on Android.
- `expo run:ios`: Builds and runs the app on iOS (macOS only).

## Troubleshooting

If you encounter issues:
1. Make sure all dependencies are installed correctly.
2. Clear the cache with:

```bash
expo start -c
# or
npm start -- --clear
```

3. Check the [Expo documentation](https://docs.expo.dev/) for common issues.

## Support

For any issues with the project, please open an issue on the [GitHub repository](https://github.com/LucasRambert4/YearProject/issues).

Happy coding! 🚀
