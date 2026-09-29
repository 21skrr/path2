import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';

// ── Dropdown data ──────────────────────────────────────────────

const ACTUALITE_LINKS = [
  { label: 'Actualité RH Maroc', href: '/actualite-maroc' },
  { label: 'Actualité RH France', href: '/actualite-france' },
];

const ARTICLES_SUBCATEGORIES = [
  'Marque Employeur & Communication RH',
  'Évaluations & Tests RH',
  'Recrutement & Onboarding',
  'Formation & Développement RH',
  'Rémunération & Avantages Sociaux',
  'Qualité de Vie au Travail (QVT)',
  'RSE & Développement Durable',
  'Santé et Sécurité au Travail',
  'Diversité & Inclusion',
  'Management & Leadership',
  'Stratégie RH',
  'Organisation RH',
  'Technologie RH & IA',
  'Dialogue Social & Politiques RH',
  'Lifestyle RH',
];

const INTERVIEWS_CARDS = [
  {
    id: 1,
    title: '[INTERVIEW] « L\'entreprise ne vit jamais hors sol » – échange avec Mahja NAIT BARKA, fondatrice de CitizOn',
    image: '',
    href: '/interview/1',
  },
  {
    id: 2,
    title: '[INTERVIEW] EDVANTIS : Tawhid CHTIOUI revient sur l\'obtention des 4 Palmes d\'Excellence pour chacune de ses écoles',
    image: '',
    href: '/interview/2',
  },
  {
    id: 3,
    title: '[INTERVIEW] Le Groupe Omnipar : un groupe familial structuré aux exigences des multinationales. Interview avec Hanan HAJJI',
    image: '',
    href: '/interview/3',
  },
  {
    id: 4,
    title: '[INTERVIEW] « L\'Humain n\'est pas une ressource, c\'est la Source » – échange avec Jean-Louis FEL, Fondateur de VAKOM',
    image: '',
    href: '/interview/4',
  },
];

const ETUDES_CARDS = [
  {
    id: 1,
    title: '[ETUDE] Ce que 81 000 personnes attendent vraiment de l\'IA',
    image: '',
    href: '/etude/1',
  },
  {
    id: 2,
    title: '[RAPPORT] Quand les dirigeants vieillissent et les équipes rajeunissent : un risque stratégique sous-estimé',
    image: '',
    href: '/etude/2',
  },
  {
    id: 3,
    title: '[RAPPORT] IA et transformation des entreprises (2026) : le rapport WEF–Accenture appelle à une refonte organisationnelle totale',
    image: '',
    href: '/etude/3',
  },
  {
    id: 4,
    title: '[ETUDE] Ramadan 2026 : ce que révèle l\'échec du pilotage RH face au temps',
    image: '',
    href: '/etude/4',
  },
];

const TEXTES_LOI_LINKS = [
  { label: 'Code du Travail', href: '/textes-loi/code-travail' },
  { label: 'Loi Droit de Grève 2025', href: '/textes-loi/loi-droit-de-greve' },
];

// ── Component ─────────────────────────────────────────────────

export const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const { user, isAuthenticated, isAdmin, isSenior, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openDropdown = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 250);
  };

  const keepOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <header className="drh-header">
      {/* ── Top Bar ── */}
      <div className="drh-topbar">
        <div className="drh-topbar-inner">
          {/* Left: dark mode toggle + social */}
          <div className="drh-topbar-left">
            <button
              className="drh-darkmode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="drh-social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="drh-social-icon drh-social-linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="drh-social-icon drh-social-x" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.633 5.906-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="drh-social-icon drh-social-facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="drh-social-icon drh-social-instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="drh-social-icon drh-social-whatsapp" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="drh-logo">
            <Link to="/home">
              <span className="drh-logo-text">
                <span className="drh-logo-p">P</span>
                <span className="drh-logo-at">@</span>
                <span className="drh-logo-th">TH</span>
                <span className="drh-logo-arrow">↗</span>
              </span>
              <span className="drh-logo-tagline">PEOPLE AT THE HEART OF GROWTH</span>
            </Link>
          </div>

          {/* Right: Search & Auth */}
          <div className="drh-search-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {searchOpen ? (
              <form className="drh-search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="drh-search-input"
                  autoFocus
                />
                <button type="submit" className="drh-search-btn" aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </button>
                <button type="button" className="drh-search-close" onClick={() => setSearchOpen(false)}>✕</button>
              </form>
            ) : (
              <button className="drh-search-trigger" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span>Search...</span>
              </button>
            )}

            {/* Auth UI */}
            <div className="drh-auth-container" style={{ position: 'relative' }}>
              {!isAuthenticated ? (
                <Link to="/login" className="drh-auth-btn" style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', background: '#7B2D8E', color: 'white', padding: '6px 12px', borderRadius: '4px' }}>
                  Connexion
                </Link>
              ) : (
                <div 
                  className="drh-user-avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#00B4A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                  
                  {userDropdownOpen && (
                    <div className="drh-user-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '150px', zIndex: 100 }}>
                      <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 'bold', color: '#1a0a2e', fontSize: '14px' }}>{user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {isAdmin ? 'Administrateur' : (
                            user?.membershipTier === 'COMMUNITY' ? '🤝 Pack Community' :
                            user?.membershipTier === 'PROFESSIONAL' ? '🎯 Pack Professionnel' :
                            user?.membershipTier === 'SENIOR' ? '👑 Pack Senior' :
                            'Membre Gratuit'
                          )}
                        </div>
                        {user?.referralInfo?.referralCode && (
                          <div style={{ fontSize: '10px', color: '#00B4A6', fontFamily: 'monospace', marginTop: '4px', fontWeight: '700', letterSpacing: '0.05em' }}>
                            🔗 {user.referralInfo.referralCode}
                          </div>
                        )}
                      </div>
                      {isAdmin && (
                        <Link to="/admin" style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: '#1a0a2e', textDecoration: 'none' }} onClick={() => setUserDropdownOpen(false)}>
                          Tableau de Bord
                        </Link>
                      )}
                      {(isSenior && !isAdmin) && (
                        <Link to="/admin" style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: '#7B2D8E', textDecoration: 'none', fontWeight: '600' }} onClick={() => setUserDropdownOpen(false)}>
                          ✍️ Publier du contenu
                        </Link>
                      )}
                      <Link to="/my-account" style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: '#1a0a2e', textDecoration: 'none' }} onClick={() => setUserDropdownOpen(false)}>
                        Mon Espace
                      </Link>
                      <Link to="/directory" style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: '#1a0a2e', textDecoration: 'none' }} onClick={() => setUserDropdownOpen(false)}>
                        Annuaire Membres
                      </Link>
                      <button 
                        onClick={handleLogout}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="drh-header-divider" />

      {/* ── Nav Bar ── */}
      <nav className="drh-navbar">
        <div className="drh-navbar-inner">

          {/* Actualité RH */}
          <div
            className={`drh-nav-item ${activeDropdown === 'actualite' ? 'drh-nav-active' : ''}`}
            onMouseEnter={() => openDropdown('actualite')}
            onMouseLeave={closeDropdown}
          >
            <span className="drh-nav-link">
              Actualité RH
              <svg className="drh-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
            {activeDropdown === 'actualite' && (
              <div className="drh-dropdown drh-dropdown-list" onMouseEnter={keepOpen} onMouseLeave={closeDropdown}>
                {ACTUALITE_LINKS.map((link) => (
                  <Link key={link.href} to={link.href} className="drh-dropdown-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Interviews */}
          <div
            className={`drh-nav-item ${activeDropdown === 'interviews' ? 'drh-nav-active' : ''}`}
            onMouseEnter={() => openDropdown('interviews')}
            onMouseLeave={closeDropdown}
          >
            <span className="drh-nav-link">
              Interviews
              <svg className="drh-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
            {activeDropdown === 'interviews' && (
              <div className="drh-dropdown drh-dropdown-cards" onMouseEnter={keepOpen} onMouseLeave={closeDropdown}>
                {INTERVIEWS_CARDS.map((card) => (
                  <Link key={card.id} to={card.href} className="drh-dropdown-card">
                    <div className="drh-dropdown-card-img">
                      <div className="drh-card-img-placeholder">
                        <span className="drh-card-badge">PATH</span>
                      </div>
                    </div>
                    <p className="drh-dropdown-card-title">{card.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Articles */}
          <div
            className={`drh-nav-item ${activeDropdown === 'articles' ? 'drh-nav-active' : ''}`}
            onMouseEnter={() => openDropdown('articles')}
            onMouseLeave={closeDropdown}
          >
            <span className="drh-nav-link">
              Articles
              <svg className="drh-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
            {activeDropdown === 'articles' && (
              <div className="drh-dropdown drh-dropdown-list drh-dropdown-articles" onMouseEnter={keepOpen} onMouseLeave={closeDropdown}>
                {ARTICLES_SUBCATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/articles?category=${encodeURIComponent(cat)}`}
                    className="drh-dropdown-link"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nominations — no dropdown */}
          <div className="drh-nav-item">
            <Link to="/nominations" className="drh-nav-link drh-nav-link-plain">
              Nominations
            </Link>
          </div>

          {/* Etudes */}
          <div
            className={`drh-nav-item ${activeDropdown === 'etudes' ? 'drh-nav-active' : ''}`}
            onMouseEnter={() => openDropdown('etudes')}
            onMouseLeave={closeDropdown}
          >
            <span className="drh-nav-link">
              Etudes
              <svg className="drh-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
            {activeDropdown === 'etudes' && (
              <div className="drh-dropdown drh-dropdown-cards" onMouseEnter={keepOpen} onMouseLeave={closeDropdown}>
                {ETUDES_CARDS.map((card) => (
                  <Link key={card.id} to={card.href} className="drh-dropdown-card">
                    <div className="drh-dropdown-card-img">
                      <div className="drh-card-img-placeholder drh-card-img-etude">
                        <span className="drh-card-badge">PATH</span>
                      </div>
                    </div>
                    <p className="drh-dropdown-card-title">{card.title}</p>
                  </Link>
                ))}
                <div className="drh-dropdown-pagination">
                  <button className="drh-pag-btn" aria-label="Previous">‹</button>
                  <button className="drh-pag-btn" aria-label="Next">›</button>
                </div>
              </div>
            )}
          </div>

          {/* Annuaire */}
          <div className="drh-nav-item">
            <Link to="/directory" className="drh-nav-link drh-nav-link-plain">
              Annuaire
            </Link>
          </div>

          {/* Offres d'Emploi — no dropdown */}
          <div className="drh-nav-item">
            <Link to="/offres-emploi" className="drh-nav-link drh-nav-link-plain">
              Offres d'Emploi
            </Link>
          </div>

          {/* Textes de Loi */}
          <div
            className={`drh-nav-item ${activeDropdown === 'textes' ? 'drh-nav-active' : ''}`}
            onMouseEnter={() => openDropdown('textes')}
            onMouseLeave={closeDropdown}
          >
            <span className="drh-nav-link">
              Textes de Loi
              <svg className="drh-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
            {activeDropdown === 'textes' && (
              <div className="drh-dropdown drh-dropdown-list" onMouseEnter={keepOpen} onMouseLeave={closeDropdown}>
                {TEXTES_LOI_LINKS.map((link) => (
                  <Link key={link.href} to={link.href} className="drh-dropdown-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
};
