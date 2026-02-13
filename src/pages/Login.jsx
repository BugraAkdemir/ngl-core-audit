import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      sessionStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('E-posta veya şifre hatalı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="login-header">
          <span className="logo">NGL</span>
          <p>Admin Girişi</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="ngl-button login-btn" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </motion.div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #000;
        }

        .login-card {
          background: #111;
          width: 100%;
          max-width: 380px;
          padding: 40px 30px;
          border-radius: 40px;
          text-align: center;
          border: 1px solid #222;
        }

        .login-header {
          margin-bottom: 40px;
        }

        .login-header .logo {
          font-weight: 900;
          font-size: 2.5rem;
          font-style: italic;
          color: white;
          display: block;
          margin-bottom: 8px;
        }

        .login-header p {
          color: #666;
          font-weight: 600;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group input {
          width: 100%;
          padding: 18px 24px;
          border-radius: 20px;
          border: 1px solid #222;
          background: #000;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          border-color: #ff1f7c;
        }

        .login-error {
          color: #ff4d4d;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .login-btn {
          margin-top: 20px;
          background: var(--ngl-gradient);
          color: white;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
