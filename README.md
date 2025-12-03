# ⚔️ Quest Board

> **Turn your life into an RPG.** A gamified task manager that rewards you with XP and Gold for completing your daily quests.

![Quest Board Preview](https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop)

## 🔗 Live Demo
**Try it on your phone or browser:**  
👉 **[https://questboard110.netlify.app/](https://questboard110.netlify.app/)**

---

## ✨ Features

*   **Gamified Tasks**: Earn **XP** (Experience Points) and **Gold** for every task you complete.
*   **Level Up System**: Gain levels as you complete more tasks. Watch your progress bar grow!
*   **Rewards Shop**: Spend your hard-earned Gold on real-life rewards (e.g., "Watch an Episode", "Buy a Snack").
*   **Daily Quests**: Recurring tasks that reset every day.
*   **History Log**: Track your journey with a detailed log of all completed quests and purchases.
*   **Cross-Platform**: Runs as a **Desktop App** (Windows) or a **Web App** (Mobile/Desktop).
*   **Beautiful UI**: Modern "Glassmorphism" design with smooth animations and dark mode.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Desktop Wrapper**: Electron
*   **Storage**: LocalStorage (Data persists on your device)

---

## 🚀 Getting Started (Local Development)

If you want to run this project on your own computer or modify the code:

### 1. Clone the repository
```bash
git clone https://github.com/Darshh16/Quest-Board-.git
cd Quest-Board-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
# Runs the desktop app (Electron) + Local Server
npm run electron:dev
```

---

## 📱 How to Use on Mobile (Local Network)

You can use the app on your phone without deploying it, as long as you are on the same Wi-Fi as your computer.

1.  Run the mobile server command:
    ```bash
    npm run mobile
    ```
2.  Look for the **Network URL** in the terminal (e.g., `http://192.168.1.5:5173`).
3.  Type that URL into your phone's browser.
4.  **Pro Tip**: Add it to your Home Screen for a native app feel!

---

## 📦 Building the Desktop App (.exe)

To create a standalone Windows executable:

1.  **Important**: Run your terminal as **Administrator**.
2.  Run the build command:
    ```bash
    npm run electron:build
    ```
3.  The installer will be in the `dist-electron` folder.

---

## 🌐 Deployment

To host your own web version:

1.  Run `npm run build`.
2.  Upload the `dist` folder to [Netlify Drop](https://app.netlify.com/drop) or Vercel.

---

*Built with ❤️ by Darshh16*
