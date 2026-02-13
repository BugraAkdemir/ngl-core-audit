import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, Dices } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getSettings, saveMessage } from '../lib/firebase';

export default function Send() {
  const [step, setStep] = useState(1);
  const [igUsername, setIgUsername] = useState('');
  const [message, setMessage] = useState('');
  const [ip, setIp] = useState('Fetching...');
  const { username } = useParams();
  const targetUser = username || 'enguncel_taskopruyeni_itiraf';

  const prompts = [
    "Şu an birinden hoşlanıyor musun?",
    "Benim hakkımda ne düşünüyorsun?",
    "Bir sırrını paylaş! 🤫",
    "En son kimi öptün? 💋",
    "Cesaret mi doğruluk mu?",
    "En büyük korkun ne?",
    "Takip ettiğin en garip hesap kim?",
    "Benimle ilgili 3 kelime söyle"
  ];

  useEffect(() => {
    getSettings()
      .then(settings => {
        if (!settings.requireIg) {
          setStep(2);
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err));

    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'));
  }, []);

  const handleNextStep = () => {
    if (igUsername.trim().length > 0) {
      setStep(2);
    }
  };

  const handleDice = () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setMessage(random);
  };

  const handleSend = async () => {
    if (message.trim().length === 0) return;

    try {
      await saveMessage({
        text: message,
        igUsername: igUsername || 'Atlandı',
        ip: ip
      });
      setStep(3);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleReset = async () => {
    try {
      const settings = await getSettings();
      setStep(settings.requireIg ? 1 : 2);
    } catch {
      setStep(1);
    }
    setMessage('');
    setIgUsername('');
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ngl-card ig-prompt-card"
        >
          <div className="ig-header">
            <span className="ig-icon">📸</span>
            <h3>instagram adresini doğrula</h3>
          </div>
          <p className="trust-note">
            bana anonim mesajlar gönderebilmek için instagram hesabını bağlaman gerekiyor.
          </p>

          <div className="input-field-group">
            <span className="at-symbol">@</span>
            <input
              type="text"
              placeholder="instagram kullanıcı adın"
              value={igUsername}
              onChange={(e) => setIgUsername(e.target.value)}
              className="ig-input"
            />
          </div>

          <div className="security-guarantee">
            <div className="guarantee-item">
              <span className="shield">🛡️</span>
              <span>kullanıcı adın hiç kimse ile paylaşılmayacaktır.</span>
            </div>
            <div className="guarantee-item">
              <span className="lock">🔒</span>
              <span>tüm gizlilik sorumluluğu NGL'ye aittir.</span>
            </div>
          </div>

          <button
            className="ngl-button"
            onClick={handleNextStep}
            disabled={!igUsername.trim()}
          >
            Devam Et
          </button>
        </motion.div>
      );
    }

    if (step === 2) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ngl-card message-card"
        >
          <div className="card-header">
            <div className="avatar">
              <UserCircle2 size={44} color="#dbdbdb" strokeWidth={1.5} />
            </div>
            <div className="header-info">
              <span className="username">@{targetUser}</span>
              <span className="tagline">bana anonim olarak mesajlar gönder!</span>
            </div>
          </div>

          <div className="question-box">
            <textarea
              placeholder="bir şeyler yaz..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
            />
            <button className="pill-dice" onClick={handleDice}><Dices size={24} color="#FF1F7C" /></button>
          </div>

          <button
            className="ngl-button"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Gönder!
          </button>
        </motion.div>
      );
    }

    if (step === 3) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ngl-card success-card"
          >
            <div className="success-icon-wrapper">
              <div className="check-ring">
                <div className="check-mark">✓</div>
              </div>
            </div>
            <h2>teşekkürler!</h2>
            <p className="success-sub">mesajın başarıyla iletildi!</p>

            <button
              className="ngl-button reset-btn"
              onClick={handleReset}
            >
              Bir mesaj daha gönder
            </button>
          </motion.div>
        </AnimatePresence>
      );
    }
  };

  return (
    <div className="ngl-container main-bg">
      <div className="ngl-wrapper">
        {renderStep()}

        {step !== 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="footer-elements"
          >
            <div className="lock-indicator">
              <span>🔒</span> anonim soru ve cevap
            </div>

            <div className="story-count">
              👇 214 arkadaşlar az önce bastı 👇
            </div>

            <button className="ngl-button app-action">
              Kendi mesajlarını al!
            </button>
          </motion.div>
        )}

        <footer className="page-footer">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </footer>
      </div>

      <style>{`
        .main-bg {
          background: linear-gradient(180deg, #FF1F7C 0%, #FF9B42 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 24px;
        }
        .ngl-wrapper {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .message-card {
          padding: 24px;
          margin-bottom: 24px;
          background: white;
          border-radius: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .avatar {
          width: 50px;
          height: 50px;
          background: #f7f7f7;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .header-info { display: flex; flex-direction: column; align-items: flex-start; }
        .username { font-weight: 700; font-size: 1rem; color: #000; }
        .tagline { font-size: 0.95rem; color: #333; font-weight: 500; }

        .question-box {
          background: #fdfdfd;
          border-radius: 24px;
          padding: 20px;
          position: relative;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          border: 1px solid #f0f0f0;
          margin-bottom: 20px;
        }

        textarea {
          width: 100%;
          height: 100px;
          border: none;
          background: transparent;
          outline: none;
          font-size: 1.3rem;
          font-weight: 700;
          color: #FF1F7C;
          resize: none;
          text-align: left;
        }
        textarea::placeholder { color: #ffc9e0; }

        .pill-dice {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #f0f0f0;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .pill-dice:active { transform: scale(0.9); }

        .ig-prompt-card {
          padding: 30px;
          text-align: center;
          margin-bottom: 24px;
          background: white;
          border-radius: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
        }
        .ig-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .ig-icon { font-size: 2.5rem; }
        .ig-header h3 { font-weight: 800; font-size: 1.2rem; text-transform: lowercase; color: #000; }
        .trust-note { color: #666; font-weight: 600; font-size: 0.9rem; margin-bottom: 25px; line-height: 1.4; }
        
        .input-field-group {
          background: #f5f5f5;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 25px;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .input-field-group:focus-within { border-color: #FF1F7C; }
        .at-symbol { font-weight: 800; color: #999; font-size: 1.2rem; }
        .ig-input {
          background: transparent;
          border: none;
          padding: 18px 10px;
          width: 100%;
          font-weight: 700;
          font-size: 1rem;
          outline: none;
          color: #333;
        }
        .ig-input::placeholder { color: #aaa; }

        .security-guarantee {
          background: #fafafa;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 25px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }
        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #444;
        }

        .success-card { 
          padding: 50px 30px; 
          margin-bottom: 24px; 
          text-align: center; 
          background: white; 
          border-radius: 30px; 
          width: 100%;
        }
        .success-icon-wrapper { margin-bottom: 20px; }
        .check-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #2ecc71;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .check-mark { color: white; font-size: 3rem; font-weight: 900; }
        .success-sub { color: #666; font-weight: 600; font-size: 1.1rem; margin-top: 10px; }
        .reset-btn { margin-top: 25px; background: #000; color: white; border-radius: 30px; padding: 16px; font-weight: 800; width: 100%; }

        .lock-indicator {
          color: white; font-size: 0.85rem; font-weight: 700;
          display: flex; align-items: center; gap: 6px; margin-bottom: 24px; justify-content: center;
        }
        .story-count { color: white; font-weight: 800; font-size: 1.05rem; margin-bottom: 16px; text-align: center; }
        .app-action { background: rgba(0, 0, 0, 0.8); font-size: 1.1rem; padding: 18px 20px; border-radius: 30px; font-weight: 800; width: 100%; }
        .page-footer { margin-top: 40px; display: flex; gap: 20px; color: rgba(255,255,255,0.7); font-weight: 600; font-size: 0.9rem; justify-content: center; width: 100%; }
        
        .footer-elements { width: 100%; }
      `}</style>
    </div>
  );
}
