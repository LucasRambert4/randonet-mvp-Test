# 📄 Randonet MVP – React Native Expo Project

This guide explains how to **set up, run, and develop** the **Randonet MVP** project on your local machine using **React Native** and **Expo**.

---

## ✅ Prerequisites

Before you start, make sure you have these installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- **npm** (comes with Node.js) or [Yarn](https://classic.yarnpkg.com/)
- [Git](https://git-scm.com/)
- Expo CLI:  
  ```bash
  npm install -g expo-cli
  ```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/LucasRambert4/randonet-mvp-Test.git
cd randonet-mvp-Test
```

---

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 3️⃣ Configure Environment Variables

If the project uses **environment variables**, create a `.env` file in the root directory based on `.env.example` (if available):

```bash
cp .env.example .env
```

🔒 **Never commit your `.env` file!** It should stay **private** and be listed in `.gitignore`.

---

### 4️⃣ Start the Development Server

```bash
expo start
# or
npm start
# or
yarn start
```

This opens the **Expo Developer Tools** in your browser.

---

### 5️⃣ Run the App on a Device

You can run the app in **three ways**:

#### ✅ **Option A: Android Emulator**
1. Make sure your Android emulator is running.
2. In Expo Developer Tools, press `a` or click **Run on Android device/emulator**.

#### 🍏 **Option B: iOS Simulator** _(macOS only)_
1. Ensure **Xcode** is installed.
2. In Expo Developer Tools, press `i` or click **Run on iOS simulator**.

#### 📱 **Option C: Physical Device**
1. Install **Expo Go** on your iOS or Android device.
2. Scan the QR code shown in Expo Developer Tools.
3. The app will open in Expo Go.

---

## 📂 Deliverables

All project deliverables — including source code, assets, and documentation — are located in this repository:  
**➡️ [Randonet MVP GitHub Repo](https://github.com/LucasRambert4/randonet-mvp-Test.git)**

If you need to share the **compiled builds** or APKs, add them to a `deliverables/` folder and **update this README** with instructions to find or download them.

---

## ⚙️ Additional Commands

- `expo doctor` — Diagnose common issues.
- `expo prebuild` — Generate native iOS & Android project files.
- `expo run:android` — Build & run on Android.
- `expo run:ios` — Build & run on iOS _(macOS only)_.

---

## 🛠️ Troubleshooting

If something doesn’t work:
1. Make sure all dependencies are installed.
2. Clear the Expo cache:
   ```bash
   expo start -c
   # or
   npm start -- --clear
   ```
3. Refer to the [Expo Docs](https://docs.expo.dev/) for help.

---

## 🗂️ Support

Need help?  
➡️ Open an issue here: [GitHub Issues](https://github.com/LucasRambert4/YearProject/issues)

---

**Happy coding! 🚀**
