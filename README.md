# NGL Professional Audit & Anonymous Q&A Platform

![NGL Banner](https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop)

A sophisticated full-stack anonymous messaging platform inspired by NGL.designed for security auditing and private data collection. Built with a React/Vite frontend and a Node.js/Express backend, this project features a professional admin dashboard, data persistence, and advanced IP tracking.

## ✨ Features

### 📨 For Users

- **Anonymous Messaging**: Seamless message submission interface with random prompts (dice feature).
- **Instagram Verification**: Conditional Instagram username prompt to build trust/collect data.
- **Modern UI**: Vibrant gradients and smooth micro-animations using Framer Motion.
- **Privacy First**: Clear privacy notes and security guarantees for users.

### 🔐 For Admins (Secure Dashboard)

- **Cloud Inbox**: Real-time messages with IP tracking and timestamps, stored securely in Firebase Firestore.
- **Firebase Authentication**: Secure login using Email & Password. Self-registration is disabled for maximum security.
- **Advanced Persistence**: Cloud-based storage ensures your data is never lost during Vercel redeployments.

### 🛡️ Security

- **Firebase Admin SDK**: Server-side token verification for all administrative actions.
- **Role-Based Security**: Access is restricted to users manually added via the Firebase Console.
- **Express Rate Limit**: Prevents spam on the messaging endpoint.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Framer Motion, Firebase Client SDK
- **Backend**: Node.js, Express, Firebase Admin SDK (Serverless on Vercel)
- **Storage**: Firebase Firestore (NoSQL)

## 📦 Installation & Deployment

1. **Clone & Install:**

   ```bash
   git clone https://github.com/yourusername/ngl-core-audit.git
   npm install
   ```

2. **Configure Firebase:**
   Follow the [Firebase Setup Guide](./FirebaseSetup.md) to create your project and get credentials.

3. **Set Environment Variables:**
   Create a `.env` file based on `.env.example` and fill in your Firebase keys.

4. **Deploy to Vercel:**
   Push your code to GitHub and connect it to Vercel. Don't forget to add your `.env` variables to the Vercel Dashboard.

## 📂 Project Structure

```text
├── api/              # Vercel Serverless Functions (Backend)
├── src/
│   ├── pages/        # Send, Login, Admin Panel
│   ├── components/   # UI components
│   └── lib/          # Firebase client config
├── vite.config.js    # Proxy and build configuration
└── vercel.json       # Deployment configuration
```

## 📜 License

MIT License. For educational and security auditing purposes only.

---
Built with ⚡ by BugraAkdemir Developer
