import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PathHoverFooter } from '../components/PathHoverFooter';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, Play, Flame, Star, Scale } from 'lucide-react';
import './Home.css';

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

export const TICKER_ITEMS = [
  'Code du Travail 2026 : 5 amendements clés',
  'IA et transformation RH — rapport WEF 2026',
  'Nomination : Francis JESPERS à la tête d\'Allianz Trade Maroc',
  'Forum PATH 2026 — Casablanca, 15 Mai',
  'Télétravail : nouveau cadre juridique marocain',
  'Ramadan 2026 : pilotage RH face au temps',
];



export type ArticleItemType = {
  id: number;
  category?: string;
  title: string;
  date: string;
  href: string;
  image: string;
  featured?: boolean;
  type?: string;
  company?: string;
  location?: string;
};

export const MOCK_ACTUALITE: ArticleItemType[] = [
  { id: 1, category: 'ACTUALITÉ RH MAROC', title: 'Code du Travail 2026 : Les 5 amendements clés que tout DRH doit connaître', date: '28 MARS', href: '/articles/a1', image: '', featured: true },
  { id: 2, category: 'ACTUALITÉ RH', title: 'IA et cols bleus : Jeff BEZOS cible l\'industrie avec un fonds de 100 milliards $', date: '27 MARS', href: '/articles/a2', image: '' },
  { id: 3, category: 'ACTUALITÉ RH FRANCE', title: 'Réforme des retraites en France : impact sur les stratégies RH des multinationales', date: '26 MARS', href: '/articles/a3', image: '' },
  { id: 4, category: 'ACTUALITÉ RH MAROC', title: 'Télétravail au Maroc : bilan 2025 et perspectives pour les DRH en 2026', date: '25 MARS', href: '/articles/a4', image: '' },
];

export const MOCK_NOMINATIONS = [
  { id: 1, title: '[NOMINATION] Allianz Trade Maroc confie sa direction générale à Francis JESPERS', date: '26 MARS', href: '/nominations/1', image: '' },
  { id: 2, title: '[NOMINATION] Mme. Fatima Zahra El Alaoui nommée DRH chez OCP Group', date: '25 MARS', href: '/nominations/2', image: '' },
  { id: 3, title: '[NOMINATION] M. Youssef Bennani rejoint Bank Al-Maghrib comme DRH', date: '24 MARS', href: '/nominations/3', image: '' },
  { id: 4, title: '[NOMINATION] Dr. Amina Kettani nommée VP People chez Jumia Maroc', date: '23 MARS', href: '/nominations/4', image: '' },
];

export const MOCK_OFFRES = [
  { id: 1, title: 'Responsable RH & Paie', company: 'Groupe OCP', location: 'Casablanca', date: '28 MARS', href: '/offres/1', type: 'CDI' },
  { id: 2, title: 'HR Business Partner Senior', company: 'Attijariwafa Bank', location: 'Rabat', date: '27 MARS', href: '/offres/2', type: 'CDI' },
  { id: 3, title: 'Chargé(e) de Recrutement', company: 'Maroc Telecom', location: 'Casablanca', date: '26 MARS', href: '/offres/3', type: 'CDD' },
  { id: 4, title: 'Directeur des Ressources Humaines', company: 'Groupe Akdital', location: 'Casablanca', date: '25 MARS', href: '/offres/4', type: 'CDI' },
];

const MOCK_TEXTES_LOI = [
  { title: 'Code du Travail Marocain — Loi 65-99', date: '2004', href: '/textes-loi/1' },
  { title: 'Loi sur la Protection des Données Personnelles 09-08', date: '2009', href: '/textes-loi/2' },
  { title: 'Décret relatif au télétravail — Circulaire 2022', date: '2022', href: '/textes-loi/3' },
  { title: 'Loi sur la Sécurité et Santé au Travail', date: '2021', href: '/textes-loi/4' },
];

const PLANS = [
  {
    id: 1, name: 'Community', price: '100', period: '/mois', tag: null,
    description: 'Accès à la communauté WhatsApp et agenda des meetups',
    features: ['Groupe WhatsApp PATH', 'Agenda des meetups', 'Newsletter mensuelle', 'Annuaire membres'],
    note: '⚠️ Meetup : 400 dh / participation',
    cta: 'Rejoindre', href: '/membership',
  },
  {
    id: 2, name: 'Professionnel', price: '2 500', period: '/mois', tag: 'Recommandé',
    description: 'Tous meetups inclus + Benchmark RH premium',
    features: ['Tout le pack Community', ' Tous meetups inclus', 'Benchmark RH', 'Contenus & études exclusives', 'Templates RH', 'Webinaires experts'],
    note: null,
    cta: 'Sélectionner', href: '/membership',
  },
  {
    id: 3, name: 'Senior / Recruteur', price: '4 000', period: '/mois', tag: 'Éditorial',
    description: 'Droits éditoriaux complets + publication sur la plateforme',
    features: ['Tout le Pack Pro', 'Publication d\'annonces', 'Articles & contenu', 'BDD RH avancée', 'Profil DRH mis en avant', 'Support 24/7'],
    note: null,
    cta: 'Devenir Senior', href: '/membership',
  },
];

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

export type ImgVariant = 'interview' | 'etude' | 'news' | 'nomination';

export const ImgPlaceholder: React.FC<{ variant?: ImgVariant; large?: boolean }> = ({ variant = 'news', large = false }) => {
  const gradients: Record<ImgVariant, string> = {
    news:      'linear-gradient(135deg, #1a0a2e 0%, #2d1052 55%, #7B2D8E 100%)',
    interview: 'linear-gradient(135deg, #1a0a2e 0%, #7B2D8E 55%, #5C1F6A 100%)',
    etude:     'linear-gradient(135deg, #0a1e2e 0%, #007a72 45%, #00B4A6 100%)',
    nomination:'linear-gradient(135deg, #0a1a2e 0%, #005a55 50%, #00B4A6 100%)',
  };
  return (
    <div className={`path-img-placeholder${large ? ' path-img-large' : ''}`} style={{ background: gradients[variant] }}>
      <span className="path-img-watermark">P@TH</span>
    </div>
  );
};

export const CategoryTag: React.FC<{ label: string; variant?: ImgVariant }> = ({ label, variant = 'news' }) => (
  <span className={`path-cat-tag path-cat-${variant}`}>{label}</span>
);

// WordPress-style "Edit Post" button for admin users
const AdminEditButton: React.FC<{ postId?: number | string; href?: string }> = ({ postId, href }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  const editUrl = postId ? `/admin?tab=articles&edit=${postId}` : (href ? `/admin?tab=articles` : '/admin');
  return (
    <Link
      to={editUrl}
      className="wp-admin-edit-btn"
      onClick={(e) => e.stopPropagation()}
      title="Modifier cet article"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
    >
      <Pencil size={12} /> Edit
    </Link>
  );
};

// Horizontal scrolling news ticker
export const NewsTicker: React.FC = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="path-ticker">
      <span className="path-ticker-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Play size={10} fill="currentColor" /> EN DIRECT
      </span>
      <div className="path-ticker-track">
        <div className="path-ticker-inner">
          {items.map((item, i) => (
            <span key={i} className="path-ticker-item">
              {item} <span className="path-ticker-sep">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Full-width featured hero with main + 2 secondary + trending list
export const FeaturedHero: React.FC<{ main: any, secondary: any[], trending: any[] }> = ({ main, secondary, trending }) => (
  <section className="path-hero-section">
    <div className="path-container">
      <div className="path-hero-grid">

        {/* Main featured */}
        {main && (
          <div className="path-hero-main-wrapper">
            <AdminEditButton postId={main.id} />
            <Link to={main.href || '#'} className="path-hero-main">
              <ImgPlaceholder variant={main.category === 'INTERVIEW' ? 'interview' : main.category === 'ETUDE' ? 'etude' : main.category === 'NOMINATION' ? 'nomination' : 'news'} large />
              <div className="path-hero-main-overlay">
                <div className="path-hero-main-meta">
                  {main.tag && <span className="path-hero-tag">{main.tag}</span>}
                  <CategoryTag label={main.category || 'ACTUALITE'} variant={main.category === 'INTERVIEW' ? 'interview' : main.category === 'ETUDE' ? 'etude' : main.category === 'NOMINATION' ? 'nomination' : 'news'} />
                </div>
                <h2 className="path-hero-main-title">{main.title}</h2>
                <p className="path-hero-main-excerpt">{main.excerpt}</p>
                <div className="path-hero-main-footer">
                  <span className="path-hero-date">{main.date}</span>
                  <span className="path-hero-read">{main.readTime || '5 min de lecture'}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary stack */}
        <div className="path-hero-secondary">
          {secondary.map((art) => (
            <div key={art.id} className="path-hero-sec-wrapper">
              <AdminEditButton postId={art.id} />
              <Link to={art.href} className="path-hero-secondary-card">
                <div className="path-hero-sec-img">
                  <ImgPlaceholder variant={art.category === 'INTERVIEW' ? 'interview' : art.category === 'ETUDE' ? 'etude' : art.category === 'NOMINATION' ? 'nomination' : 'news'} />
                </div>
                <div className="path-hero-sec-content">
                  <CategoryTag label={art.category || 'ACTUALITE'} variant={art.category === 'INTERVIEW' ? 'interview' : art.category === 'ETUDE' ? 'etude' : art.category === 'NOMINATION' ? 'nomination' : 'news'} />
                  <p className="path-hero-sec-title">{art.title}</p>
                  <span className="path-hero-sec-date">{art.date}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Trending sidebar */}
        <div className="path-trending">
          <div className="path-trending-header">
            <Flame className="path-trending-icon" size={16} style={{ color: '#f97316' }} />
            <span>Tendances</span>
          </div>
          {trending.map((item, i) => (
            <Link key={item.id} to={item.href} className="path-trending-item">
              <span className="path-trending-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="path-trending-body">
                <CategoryTag label={item.category || 'ACTUALITE'} variant={item.category === 'INTERVIEW' ? 'interview' : item.category === 'ETUDE' ? 'etude' : item.category === 'NOMINATION' ? 'nomination' : 'news'} />
                <p className="path-trending-title">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  </section>
);

// Auto-advancing slider with prev/next arrows
export const NewsSlider: React.FC<{ posts: any[] }> = ({ posts }) => {
  const [current, setCurrent] = useState(0);
  const total = posts.length;

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  if (!posts || posts.length === 0) return null;

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  const item = posts[current];

  return (
    <div className="path-slider">
      {/* Progress bar */}
      <div className="path-slider-progress">
        <div className="path-slider-progress-bar" key={current} />
      </div>

      <div className="path-slider-body">
        {/* Prev/next */}
        {total > 1 && <button className="path-slider-arrow path-slider-prev" onClick={prev} aria-label="Précédent">‹</button>}

        {/* Main content */}
        <Link to={item.href || '#'} className="path-slider-content">
          <div className="path-slider-img">
            <ImgPlaceholder variant={item.category === 'INTERVIEW' ? 'interview' : item.category === 'ETUDE' ? 'etude' : item.category === 'NOMINATION' ? 'nomination' : 'news'} large />
          </div>
          <div className="path-slider-info">
            <CategoryTag label={item.category || 'ACTUALITE'} variant={item.category === 'INTERVIEW' ? 'interview' : item.category === 'ETUDE' ? 'etude' : item.category === 'NOMINATION' ? 'nomination' : 'news'} />
            <h3 className="path-slider-title">{item.title}</h3>
            <span className="path-slider-date">{item.date}</span>
          </div>
        </Link>

        {total > 1 && <button className="path-slider-arrow path-slider-next" onClick={next} aria-label="Suivant">›</button>}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="path-slider-thumbs">
          {posts.map((s, i) => (
            <button
              key={s.id}
              className={`path-slider-thumb ${i === current ? 'path-slider-thumb-active' : ''}`}
              onClick={() => setCurrent(i)}
            >
              <div className="path-slider-thumb-img">
                <ImgPlaceholder variant={s.category === 'INTERVIEW' ? 'interview' : s.category === 'ETUDE' ? 'etude' : s.category === 'NOMINATION' ? 'nomination' : 'news'} />
              </div>
              <span className="path-slider-thumb-title">{s.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Section header with left accent line
export const SectionHeader: React.FC<{ title: string; href: string; subtitle?: string }> = ({ title, href, subtitle }) => (
  <div className="path-section-header">
    <div className="path-section-header-left">
      <h2 className="path-section-title">{title}</h2>
      {subtitle && <p className="path-section-subtitle">{subtitle}</p>}
    </div>
    <Link to={href} className="path-see-all">Voir tout <span>→</span></Link>
  </div>
);

// Mixed editorial grid: 1 large + 3 small
export const EditorialGrid: React.FC<{ items: ArticleItemType[]; variant: ImgVariant }> = ({ items, variant }) => (
  <div className="path-editorial-grid">
    {/* Large featured */}
    <div className="path-editorial-main-wrapper">
      <AdminEditButton postId={items[0].id} />
      <Link to={items[0].href} className="path-editorial-main">
        <div className="path-editorial-main-img">
          <ImgPlaceholder variant={variant} large />
          <div className="path-editorial-main-overlay">
            {items[0].category && <CategoryTag label={items[0].category} variant={variant} />}
            <h3 className="path-editorial-main-title">{items[0].title}</h3>
            <span className="path-editorial-main-date">{items[0].date}</span>
          </div>
        </div>
      </Link>
    </div>
    {/* 3 small cards */}
    <div className="path-editorial-small-col">
      {items.slice(1, 4).map(item => (
        <div key={item.id} className="path-editorial-small-wrapper">
          <AdminEditButton postId={item.id} />
          <Link to={item.href} className="path-editorial-small-card">
            <div className="path-editorial-small-img">
              <ImgPlaceholder variant={variant} />
            </div>
            <div className="path-editorial-small-info">
              {item.category && <CategoryTag label={item.category} variant={variant} />}
              <p className="path-editorial-small-title">{item.title}</p>
              <span className="path-editorial-small-date">{item.date}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

// 4-column cards grid for interviews
const CardsGrid: React.FC<{ items: { id: number; title: string; date: string; href: string; image: string }[]; variant: ImgVariant }> = ({ items, variant }) => (
  <div className="path-cards-grid">
    {items.map(item => (
      <div key={item.id} className="path-article-card-wrapper">
        <AdminEditButton postId={item.id} />
        <Link to={item.href} className="path-article-card">
          <div className="path-article-card-img">
            <ImgPlaceholder variant={variant} />
          </div>
          <div className="path-article-card-body">
            <CategoryTag label={variant === 'interview' ? 'INTERVIEW' : variant === 'etude' ? 'ETUDE' : 'ARTICLE'} variant={variant} />
            <p className="path-article-card-title">{item.title}</p>
            <span className="path-article-card-date">{item.date}</span>
          </div>
        </Link>
      </div>
    ))}
  </div>
);

// Nominations horizontal scroll
const NominationsRow: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="path-nominations-row">
    {items.map(item => (
      <Link key={item.id} to={item.href} className="path-nom-card">
        <div className="path-nom-card-img">
          <ImgPlaceholder variant="nomination" />
        </div>
        <div className="path-nom-card-body">
          <span className="path-nom-badge">NOMINATIONS RH</span>
          <p className="path-nom-card-title">{item.title}</p>
          <span className="path-nom-card-date">{item.date}</span>
        </div>
      </Link>
    ))}
  </div>
);

// Inline Membership section
const MembershipSection: React.FC = () => (
  <section className="path-membership-section">
    <div className="path-membership-bg">
      <div className="path-membership-header">
        <span className="path-membership-eyebrow">Rejoignez PATH</span>
        <h2 className="path-membership-title">Choisissez votre pack d'adhésion</h2>
        <p className="path-membership-sub">De la communauté WhatsApp aux droits éditoriaux complets — trouvez le pack qui correspond à votre ambition RH.</p>
      </div>
      <div className="path-membership-plans">
        {PLANS.map(plan => (
          <div key={plan.id} className={`path-plan-card ${plan.tag === 'Recommandé' ? 'path-plan-featured' : ''}`}>
            {plan.tag && <div className="path-plan-tag">{plan.tag}</div>}
            <div className="path-plan-header">
              <h3 className="path-plan-name">{plan.name}</h3>
              <div className="path-plan-price-row">
                <span className="path-plan-price">{plan.price}</span>
                <span className="path-plan-currency">MAD{plan.period}</span>
              </div>
              <p className="path-plan-desc">{plan.description}</p>
            </div>
            <ul className="path-plan-features">
              {plan.features.map((f, i) => (
                <li key={i}><span className="path-check">✓</span>{f}</li>
              ))}
            </ul>
            {'note' in plan && plan.note && (
              <p style={{ fontSize: '11px', color: '#78350f', background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', lineHeight: '1.4' }}>
                {plan.note}
              </p>
            )}
            <Link to={plan.href} className={`path-plan-btn ${plan.tag === 'Recommandé' ? 'path-plan-btn-featured' : plan.tag === 'Éditorial' ? 'path-plan-btn-senior' : ''}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Offres d'emploi section
const OffresSection: React.FC = () => (
  <div className="path-offres-grid">
    {MOCK_OFFRES.map(offre => (
      <Link key={offre.id} to={offre.href} className="path-offre-card">
        <div className="path-offre-card-top">
          <span className={`path-offre-type ${offre.type === 'CDI' ? 'path-offre-cdi' : 'path-offre-cdd'}`}>{offre.type}</span>
          <span className="path-offre-date">{offre.date}</span>
        </div>
        <p className="path-offre-title">{offre.title}</p>
        <span className="path-offre-meta">
          <span className="path-offre-company">{offre.company}</span>
          <span className="path-offre-sep">·</span>
          {offre.location}
        </span>
      </Link>
    ))}
  </div>
);

// Sidebar widgets
const SocialWidget: React.FC = () => (
  <div className="path-widget">
    <h3 className="path-widget-title">Suivez-nous</h3>
    <div className="path-social-grid">
      {[
        { href: 'https://linkedin.com', cls: 'path-social-li', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
        { href: 'https://x.com', cls: 'path-social-x', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.633 5.906-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
        { href: 'https://facebook.com', cls: 'path-social-fb', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
        { href: 'https://instagram.com', cls: 'path-social-ig', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
        { href: 'https://whatsapp.com', cls: 'path-social-wa', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
      ].map((s, i) => (
        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={`path-social-btn ${s.cls}`}>{s.icon}</a>
      ))}
    </div>
  </div>
);

const NominationsSidebarWidget: React.FC = () => (
  <div className="path-widget">
    <div className="path-widget-header-row">
      <h3 className="path-widget-title">Nominations RH</h3>
      <Link to="/nominations" className="path-widget-more">Voir tout →</Link>
    </div>
    {MOCK_NOMINATIONS.slice(0, 3).map(item => (
      <Link key={item.id} to={item.href} className="path-nom-sidebar-item">
        <div className="path-nom-sidebar-img"><ImgPlaceholder variant="nomination" /></div>
        <div>
          <span className="path-nom-sidebar-badge">NOMINATIONS RH</span>
          <p className="path-nom-sidebar-title">{item.title}</p>
        </div>
      </Link>
    ))}
  </div>
);

const MembershipSidebarWidget: React.FC = () => (
  <div className="path-widget path-widget-membership">
    <div className="path-widget-membership-content">
      <Star className="path-widget-membership-icon" size={24} fill="currentColor" style={{ color: '#eab308' }} />
      <h3 className="path-widget-membership-title">Passez Premium</h3>
      <p className="path-widget-membership-text">Accédez à tout le contenu exclusif PATH dès maintenant.</p>
      <Link to="/membership" className="path-widget-membership-btn">Voir les offres</Link>
    </div>
  </div>
);

const OffresSidebarWidget: React.FC = () => (
  <div className="path-widget">
    <div className="path-widget-header-row">
      <h3 className="path-widget-title">Offres d'Emploi</h3>
      <Link to="/offres-emploi" className="path-widget-more">Voir tout →</Link>
    </div>
    {MOCK_OFFRES.slice(0, 4).map(o => (
      <Link key={o.id} to={o.href} className="path-offre-sidebar-item">
        <div className="path-offre-sidebar-info">
          <p className="path-offre-sidebar-title">{o.title}</p>
          <span className="path-offre-sidebar-company">{o.company} · {o.location}</span>
        </div>
        <span className={`path-offre-sidebar-type ${o.type === 'CDI' ? 'path-offre-cdi' : 'path-offre-cdd'}`}>{o.type}</span>
      </Link>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export const Home: React.FC = () => {
  const { posts } = usePosts();

  // Categories
  const dynamicActualites = posts.filter(p => p.category === 'ACTUALITE').map(p => ({
    id: typeof p.id === 'string' ? parseInt(p.id) || Date.now() : p.id,
    category: p.category, title: p.title, date: p.date, href: p.href, image: p.image || ''
  }));

  const dynamicInterviews = posts.filter(p => p.category === 'INTERVIEW').map(p => ({
    id: typeof p.id === 'string' ? parseInt(p.id) || Date.now() : p.id,
    title: p.title, date: p.date, href: p.href, image: p.image || ''
  }));

  const dynamicEtudes = posts.filter(p => p.category === 'ETUDE').map(p => ({
    id: typeof p.id === 'string' ? parseInt(p.id) || Date.now() : p.id,
    category: p.category, title: p.title, date: p.date, href: p.href, image: p.image || ''
  }));
  
  const dynamicNominations = posts.filter(p => p.category === 'NOMINATION').map(p => ({
    id: typeof p.id === 'string' ? parseInt(p.id) || Date.now() : p.id,
    category: p.category, title: p.title, date: p.date, href: p.href, image: p.image || ''
  }));

  // Placements
  const sliderPosts = posts.filter(p => p.placement === 'SLIDER');
  // Fallback to first article if no featured main is selected
  const featuredMain = posts.find(p => p.placement === 'FEATURED_MAIN') || posts[0];
  const featuredSecondary = posts.filter(p => p.placement === 'FEATURED_SECONDARY');
  const trendingPosts = posts.filter(p => p.placement === 'TRENDING');

  return (
    <div className="path-page">
      <Navbar />
      <NewsTicker />
      <FeaturedHero main={featuredMain} secondary={featuredSecondary} trending={trendingPosts} />

      {/* Slider section */}
      <div className="path-slider-section">
        <div className="path-container">
          <div className="path-slider-section-header">
            <h2 className="path-slider-section-title">Dernières Actualités</h2>
          </div>
          {sliderPosts.length > 0 && <NewsSlider posts={sliderPosts} />}
        </div>
      </div>

      {/* Main layout */}
      <div className="path-container path-layout">
        <main className="path-main">

          {/* Actualité RH */}
          {dynamicActualites.length > 0 && (
            <section className="path-section">
              <SectionHeader title="Actualité RH" href="/actualite-maroc" subtitle="Les dernières nouvelles RH au Maroc et à l'international" />
              <EditorialGrid items={dynamicActualites} variant="news" />
            </section>
          )}

          {/* Interviews */}
          {dynamicInterviews.length > 0 && (
            <section className="path-section">
              <SectionHeader title="Interviews" href="/interview-rh" subtitle="Les dirigeants RH prennent la parole" />
              <CardsGrid items={dynamicInterviews} variant="interview" />
            </section>
          )}

        {/* Nominations */}
        {dynamicNominations.length > 0 && (
          <section className="path-section">
            <SectionHeader title="Nominations RH" href="/nominations" subtitle="Les dernières nominations dans le monde RH" />
            <NominationsRow items={dynamicNominations} />
          </section>
        )}

        {/* Membership inline section */}
        <MembershipSection />

        {/* Etudes & Publications */}
        {dynamicEtudes.length > 0 && (
          <section className="path-section">
            <SectionHeader title="Etudes & Publications" href="/etudes-et-publications" subtitle="Rapports, études et analyses pour les professionnels RH" />
            <EditorialGrid items={dynamicEtudes} variant="etude" />
          </section>
        )}

        {/* Offres d'Emploi */}
        <section className="path-section">
          <SectionHeader title="Offres d'Emploi" href="/offres-emploi" subtitle="Les meilleures opportunités RH au Maroc" />
          <OffresSection />
        </section>

        {/* Textes de Loi */}
        <section className="path-section">
          <SectionHeader title="Textes de Loi" href="/textes-loi" subtitle="Cadre juridique RH marocain" />
          <div className="path-textes-list">
            {MOCK_TEXTES_LOI.map(item => (
              <Link key={item.href} to={item.href} className="path-texte-item">
                <Scale className="path-texte-icon" size={18} style={{ color: '#0d9488' }} />
                <div className="path-texte-content">
                  <p className="path-texte-title">{item.title}</p>
                  <span className="path-texte-date">{item.date}</span>
                </div>
                <span className="path-texte-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <aside className="path-sidebar">
        <SocialWidget />
        <NominationsSidebarWidget />
        <MembershipSidebarWidget />
        <OffresSidebarWidget />
      </aside>
    </div>

    {/* Footer */}
    <PathHoverFooter />
  </div>
  );
};
