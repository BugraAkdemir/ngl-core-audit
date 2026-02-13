# 🔥 Firebase Setup Guide

Follow these steps to configure Firebase for your NGL Clone project.

## 1. Create a Firebase Project

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click **"Add Project"** and name it (e.g., `fakengl-pro`).
- Disable Google Analytics (optional).

## 2. Enable Authentication (Email/Password)

- In the left sidebar, click **Build > Authentication**.
- Click **Get Started**.
- Under **Sign-in method**, select **Email/Password**.
- Enable **Email/Password** and click **Save**.
- **Crucial:** Go to the **Users** tab and click **Add user**. Add your admin email and password here. You will manually manage users from here (Registration is disabled in the app).

## 3. Create Firestore Database

- In the left sidebar, click **Build > Firestore Database**.
- Click **Create database**.
- Select a location (e.g., `europe-west3`).
- Start in **Production Mode**.
- Click **Create**.

## 4. Get Service Account Key (for Backend)

- Click the ⚙️ icon next to "Project Overview" and select **Project settings**.
- Go to the **Service accounts** tab.
- Click **Generate new private key**.
- Download the JSON file. **NEVER UPLOAD THIS FILE TO GITHUB.**
- From this file, you will need: `project_id`, `private_key`, and `client_email`.

## 5. Add a Web App (for Frontend)

- Go back to **Project Overview**.
- Click the 🕸️ (Web) icon.
- Register app (e.g., `FakeNGL-Web`).
- Copy the `firebaseConfig` object. You will need these for your frontend `.env` file later.

---

# 🇹🇷 Firebase Kurulum Kılavuzu

NGL Clone projeniz için Firebase yapılandırma adımları.

## 1. Firebase Projesi Oluşturma

- [Firebase Console](https://console.firebase.google.com/) adresine gidin.
- **"Proje Ekle"** seçeneğine tıklayın ve isimlendirin (örn: `fakengl-pro`).

## 2. Kimlik Doğrulamayı Etkinleştirme (E-posta/Şifre)

- Sol menüden **Build > Authentication** seçeneğine tıklayın.
- **Get Started** deyin.
- **Sign-in method** sekmesinden **Email/Password** seçeneğini seçin.
- Etkinleştirip **Kaydet** deyin.
- **Önemli:** **Users** sekmesine gidin ve **Add user** diyerek admin e-posta ve şifrenizi ekleyin. Kullanıcıları buradan manuel olarak yöneteceksiniz.

## 3. Firestore Veritabanı Oluşturma

- Sol menüden **Build > Firestore Database** seçeneğine tıklayın.
- **Create database** deyin.
- Konum seçin ve **Production Mode** ile başlatın.

## 4. Servis Hesabı Anahtarı (Backend İçin)

- "Project Overview" yanındaki ⚙️ ikonuna tıklayıp **Project settings** seçin.
- **Service accounts** sekmesine gidin.
- **Generate new private key** butonuna basarak JSON dosyasını indirin. **BU DOSYAYI GITHUB'A YÜKLEMEYİN.**
- Bu dosyadaki `project_id`, `private_key` ve `client_email` bilgilerini kullanacağız.

## 5. Web Uygulaması Ekleme (Frontend İçin)

- **Project Overview**'a dönün.
- 🕸️ (Web) ikonuna tıklayın.
- Uygulamayı kaydedin ve size verilen `firebaseConfig` objesini kopyalayın. Bunları frontend `.env` dosyasında kullanacağız.
