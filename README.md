# Offline-First Task Manager (React Native & Expo)

A robust, offline-first mobile Task Manager built with **React Native (Expo)**, **Zustand**, and **AsyncStorage**. The application features an advanced synchronization queue to seamlessly sync local offline actions with a mock backend (**json-server**) when network connectivity is available.

---

## 🚀 Key Features

- **Offline-First Architecture:** Full application functionality while offline. Create, update, and view tasks without active internet access.
- **Smart Synchronization Queue:** Local actions are queued up with sync statuses (`Pending Sync` / `Synced`). Synchronization is triggered on-demand via a single button tap.
- **Robust Local Persistence:** All state changes and queued synchronization requests are persisted using `AsyncStorage` to prevent data loss even if the app process is terminated.
- **Media Attachment (Camera Integration):** Snap a quick photo using the device camera and attach it directly to your task.
- **Action History Logs:** An audit trail screen displays local changes, sync timestamps, and connection/sync logs for absolute transparency.
- **Optimistic UI Updates:** UI updates immediately when an action is performed, keeping the user experience snappy and responsive.

---

## 🏗️ Architecture Explanation

The application follows a modular, offline-first architecture designed to decouple the UI from network availability.

1. **State Management:** Powered by **Zustand**. It provides a lightweight, performant, and boilerplate-free state container. All tasks, sync queues, and application settings reside in a global Zustand store.
2. **Storage:** We use **`@react-native-async-storage/async-storage`** for persistent local storage. Zustand is integrated with the `createJSONStorage` middleware to automatically persist and rehydrate the entire application state (including the pending sync queue) upon app startup.
3. **Synchronization (Sync):** Implemented via a custom-built sequential transaction queue.
   - Local writes are executed immediately in the UI (Optimistic Updates) and marked as `Pending Sync`.
   - When the user triggers manual synchronization, the application processes the pending queue sequentially using Axios, performing POST/PUT/DELETE requests to the mock server.
   - If an API call succeeds, the task state is updated to `Synced`.
4. **Notifications:**
   - Fully integrated with **`expo-notifications`**.
   - The app sends system-level local notifications to notify the user about connectivity changes, successful sync queue completions, and task-related updates. This ensures the user is informed even if the application is running in the background.
5. **Location & Geocoding:**
   - Instead of silent GPS tracking, the application allows users to manually input an address.
   - **Online Flow:** The app sends a request to the **Nominatim API (OpenStreetMap)** to geocode the manually entered address, fetching precise coordinates (latitude/longitude) and the formatted location name.
   - **Offline Flow:** If the device is offline during task creation, the raw text address entered by the user is stored locally.

---

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your physical device (for development) OR an Android emulator

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 🗄️ Mock Server Setup (`json-server`)

The mock backend uses a local `json-server`. The backend structure is designed to support both tasks and operational logging.

### Running the Backend Server

Start the local `json-server` to mock API requests. Make sure it runs on your local network IP (not `localhost`) so your physical device can communicate with it:

```bash
# Replace 192.168.X.X with your computer's local IP address
npx json-server --watch db.json --port 3000 --host 192.168.X.X
```

### Server Database Schema (`db.json`)

```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "title": "Setup local development environment",
      "address": "Red Square, Moscow",
      "status": "Synced",
      "imageUri": "file:///data/user/0/.../cache/Camera/photo.jpg",
      "coords": {
        "latitude": 55.7558,
        "longitude": 37.6173
      },
      "createdAt": "2026-07-16T14:15:00.000Z"
    }
  ],
  "history": [
    {
      "id": "log-uuid-1",
      "action": "TASK_CREATED",
      "timestamp": "2026-07-16T14:15:05.000Z",
      "details": "Task 'Setup local development environment' created locally."
    }
  ]
}
```

---

## 📱 Running the App & APK Build

### Running the Expo Application

Start the Expo bundler:

```bash
npx expo start
```

Scan the generated QR code using your physical phone (using Expo Go on Android or the Camera app on iOS).

### Production Release & Standalone APK Build

To generate a standalone APK for production testing:

1. **EAS Build Link:**
   - [Download standalone APK from Expo Dashboard](https://expo.dev/artifacts/placeholder-link-to-your-build) _(Replace with your actual EAS APK link once the build is finished)_

2. **How to build APK manually via EAS CLI:**
   ```bash
   npm install -g eas-cli
   eas build --platform android --profile preview
   ```

---

## ⚠️ Known Limitations & Trade-offs

1. **Storage Scaling Limits (AsyncStorage):** `AsyncStorage` is an excellent lightweight key-value store for prototyping and moderate datasets. However, it is not optimized for complex SQL queries or storing extremely large datasets. For a massive production application, we would migrate to **SQLite** or **WatermelonDB**.
2. **Conflict Resolution Strategy:** To keep the offline-first logic clean and performant, we use a **Last-Write-Wins (LWW)** strategy based on client-side timestamps. For collaborative multi-user environments, this could lead to data overwrites; we would implement Conflict-Free Replicated Data Types (CRDTs) or version vector checks in a real-world multi-user system.
3. **Manual Sync vs. Background Sync:** Sync is triggered manually via the UI. Background sync (syncing when the app is minimized or closed) was intentionally left out of this version to prevent aggressive device battery consumption.

---

## 🤖 AI & Tooling Disclosure

We utilized AI assistants (such as ChatGPT / Claude) for:

- Scaffolding UI boilerplate (React Native components).
- Generating the standard configurations for the `json-server` mock database schema.
- Structuring the technical documentation and `README.md`.

All core logic, state synchronization queues, offline-first transaction states, Nominatim API integration, expo-notifications logic, and state-rehydration mechanisms were designed and verified manually to ensure deep structural understanding and stability.
