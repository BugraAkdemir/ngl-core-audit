# 🔥 Firebase Kurulum Kılavuzu

NGL Clone projeniz için Firebase yapılandırma adımları.

## 1. Firebase Projesi Oluşturma

- [Firebase Console](https://console.firebase.google.com/) adresine gidin.
- **"Proje Ekle"** seçeneğine tıklayın ve projenize bir isim verin (örn: `fakengl-pro`).
- Google Analytics seçeneğini isteğe bağlı olarak devre dışı bırakabilirsiniz.

## 2. Kimlik Doğrulamayı Etkinleştirme (E-posta/Şifre)

- Sol menüden **Build > Authentication** seçeneğine tıklayın.
- **Get Started** butonuna basın.
- **Sign-in method** sekmesinden **Email/Password** seçeneğini seçin.
- **Enable** butonunu aktif edip **Kaydet** deyin.
- **Önemli:** **Users** sekmesine gidin ve **Add user** diyerek admin e-posta ve şifrenizi ekleyin. Uygulamada kayıt ol özelliği olmadığı için kullanıcıları buradan manuel yöneteceksiniz.

## 3. Firestore Veritabanı Oluşturma

- Sol menüden **Build > Firestore Database** seçeneğine tıklayın.
- **Create database** butonuna basın.
- Bir konum seçin (örn: `europe-west3`).
- **Production Mode** (Üretim Modu) ile başlatın.
- **Create** diyerek tamamlayın.

## 4. Servis Hesabı Anahtarı (Backend/API İçin)

- Proje genel bakışının yanındaki ⚙️ ikonuna tıklayıp **Project settings** seçin.
- **Service accounts** sekmesine gidin.
- **Generate new private key** butonuna basarak JSON dosyasını indirin. **BU DOSYAYI ASLA GITHUB'A YÜKLEMEYİN.**
- Bu dosyadan `project_id`, `private_key` ve `client_email` bilgilerini `.env` dosyanıza ekleyeceksiniz.

## 5. Web Uygulaması Ekleme (Frontend İçin)

- **Project Overview** (Proje Genel Bakış) sayfasına dönün.
- 🕸️ (Web) ikonuna tıklayın.
- Uygulamanıza bir isim verin (örn: `FakeNGL-Web`).
- Size verilen `firebaseConfig` objesini kopyalayın. Bu bilgileri frontend `.env` dosyasına yerleştireceğiz.
