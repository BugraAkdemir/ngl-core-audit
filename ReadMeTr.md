# NGL Profesyonel Denetim ve Anonim Soru-Cevap Platformu

![NGL Banner](https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop)

NGL'den ilham alan, güvenlik denetimi ve özel veri toplama için tasarlanmış gelişmiş bir full-stack anonim mesajlaşma platformu. React/Vite frontend ve Node.js/Express backend ile oluşturulan bu proje; profesyonel bir admin paneli, veri kalıcılığı ve gelişmiş IP takibi özelliklerine sahiptir.

## ✨ Özellikler

### 📨 Kullanıcılar İçin

- **Anonim Mesajlaşma**: Rastgele ipuçları (zar özelliği) içeren sorunsuz mesaj gönderim arayüzü.
- **Instagram Doğrulaması**: Güven oluşturmak/veri toplamak için isteğe bağlı Instagram kullanıcı adı sorgusu.
- **Modern Kullanıcı Arayüzü**: Framer Motion kullanılarak hazırlanan canlı gradyanlar ve akıcı mikro animasyonlar.
- **Önce Gizlilik**: Kullanıcılar için açık gizlilik notları ve güvenlik garantileri.

### 🔐 Adminler İçin (Güvenli Panel)

- **Bulut Gelen Kutusu**: Firebase Firestore üzerinde güvenli bir şekilde saklanan, IP takibi ve zaman damgalı anlık mesajlar.
- **Firebase Authentication**: E-posta ve şifre kullanarak güvenli giriş. Maksimum güvenlik için kayıt ol özelliği devre dışıdır.
- **Gelişmiş Kalıcılık**: Bulut tabanlı depolama, Vercel yeniden dağıtımları sırasında verilerinizin asla kaybolmamasını sağlar.

### 🛡️ Güvenlik

- **Firebase Admin SDK**: Tüm admin işlemleri için sunucu tarafında token doğrulaması.
- **Yetki Bazlı Güvenlik**: Erişim, yalnızca Firebase Console üzerinden manuel olarak eklenen kullanıcılarla sınırlıdır.
- **Express Rate Limit**: Mesaj gönderim uç noktasında spam ve suistimali önler.

## 🛠️ Teknoloji Yığını

- **Frontend**: React 19, Vite, Framer Motion, Firebase Client SDK
- **Backend**: Node.js, Express, Firebase Admin SDK (Vercel üzerinde Serverless)
- **Depolama**: Firebase Firestore (NoSQL)

## 📦 Kurulum ve Dağıtım

1. **Klonla ve Yükle:**

   ```bash
   git clone https://github.com/kullaniciadi/ngl-core-audit.git
   npm install
   ```

2. **Firebase Yapılandırması:**
   [Firebase Kurulum Kılavuzu](./FirebaseKurulum.md) adımlarını izleyerek projenizi oluşturun.

3. **Ortam Değişkenlerini Ayarla:**
   `.env.example` dosyasını temel alarak bir `.env` dosyası oluşturun ve Firebase anahtarlarınızı girin.

4. **Vercel'e Dağıt:**
   Kodunuzu GitHub'a yükleyin ve Vercel'e bağlayın. `.env` değişkenlerinizi Vercel Dashboard'una eklemeyi unutmayın.

## 📂 Proje Yapısı

```text
├── api/              # Vercel Serverless Functions (Backend)
├── src/
│   ├── pages/        # Gönderim sayfası, Giriş, Admin Paneli
│   ├── components/   # UI bileşenleri
│   └── lib/          # Firebase istemci yapılandırması
├── vite.config.js    # Proxy ve derleme yapılandırması
└── vercel.json       # Dağıtım yapılandırması
```

## 📜 Lisans

MIT Lisansı. Sadece eğitim ve güvenlik denetimi amaçlıdır.

---
⚡ **BugraAkdemir Developer** tarafından geliştirilmiştir.
