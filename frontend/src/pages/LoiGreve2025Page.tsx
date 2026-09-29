import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import './TextesLoi.css';

interface Subsection {
  id: string;
  label: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  label: string;
  title: string;
  content?: string;
  subsections?: Subsection[];
}

interface ArticleData {
  title: string;
  author: string;
  sections: Section[];
}

const SectionViewer: React.FC<{ section: Section, onRead: (title: string, content: string) => void }> = ({ section, onRead }) => {
  const [open, setOpen] = useState(false);
  const color = '#dc2626';

  return (
    <div className="loi-book">
      <div
        className="loi-book-header"
        onClick={() => setOpen(!open)}
        style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}
      >
        <div className="loi-book-header-left">
          <span className="loi-book-label">{section.label}</span>
          <h3 className="loi-book-title">{section.title}</h3>
        </div>
        <span className={`loi-book-chevron ${open ? 'open' : ''}`}>▾</span>
      </div>
      {open && (
        <div className="loi-book-body">
          {section.content && (
            <div className="loi-article-item" onClick={() => onRead(section.title, section.content!)}>
              <span className="loi-article-title">Lire la section: {section.title}</span>
            </div>
          )}
          {section.subsections && section.subsections.length > 0 && (
            <div className="loi-articles-list">
              {section.subsections.map(sub => (
                <div key={sub.id} className="loi-article-item" onClick={() => onRead(sub.title, sub.content)}>
                  <span className="loi-article-num" style={{ color: color, background: `${color}18` }}>
                    {sub.label}
                  </span>
                  <span className="loi-article-title">{sub.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const LoiGreve2025Page: React.FC = () => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [selectedContent, setSelectedContent] = useState<{title: string, content: string} | null>(null);

  useEffect(() => {
    fetch('/data/loi_greve_article.json')
      .then(res => res.json())
      .then(data => setArticleData(data))
      .catch(err => console.error("Failed to load loi_greve_article data", err));
  }, []);

  const keyPoints = [
    { icon: '🌍', title: 'Analyse de la conformité du Maroc aux principes de l\'OIT' },
    { icon: '⚖️', title: 'Passage d\'une reconnaissance symbolique à une régulation normative' },
    { icon: '📊', title: 'Comparaison avec les modèles européens (diversité et proportionnalité)' },
    { icon: '🆕', title: 'Innovations apportées par la Loi n° 97.15' },
    { icon: '🗣️', title: 'Critiques doctrinales et syndicales' },
  ];

  return (
    <Layout>
      <div className="loi-hero" style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #7c2d12 50%, #dc2626 100%)' }}>
        <div className="container">
          <span className="loi-badge">📝 Article d'analyse</span>
          <h1 className="animate-fadeInUp">{articleData ? articleData.title : 'Chargement...'}</h1>
          {articleData && (
            <p className="loi-hero-sub animate-fadeInUp delay-1" style={{ fontStyle: 'italic' }}>
              par {articleData.author}
            </p>
          )}
        </div>
      </div>

      <div className="loi-container">
        {/* Sidebar */}
        <aside className="loi-sidebar">
          <p className="loi-sidebar-title">Sommaire de l'article</p>
          {articleData?.sections.map(sec => (
            <a
              key={sec.id}
              className="loi-sidebar-link"
              onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{ cursor: 'pointer' }}
            >
              <span className="loi-sidebar-dot" style={{ color: '#dc2626' }} />
              {sec.label}. {sec.title}
            </a>
          ))}
        </aside>

        {/* Main */}
        <main className="loi-main">
          {/* Stats */}
          <div className="loi-stats">
            <div className="loi-stat-card">
              <div className="loi-stat-val" style={{ color: '#dc2626' }}>5</div>
              <div className="loi-stat-label">Sections</div>
            </div>
            <div className="loi-stat-card">
              <div className="loi-stat-val" style={{ color: '#dc2626' }}>2025</div>
              <div className="loi-stat-label">Loi Analysée</div>
            </div>
            <div className="loi-stat-card">
              <div className="loi-stat-val" style={{ color: '#dc2626' }}>OIT</div>
              <div className="loi-stat-label">Conformité</div>
            </div>
          </div>

          <div className="loi-intro-card" style={{ background: 'linear-gradient(135deg, #fff5f5, #fef2f2)', borderColor: '#fca5a5' }}>
            <h2 style={{ color: '#dc2626' }}>📌 À propos de cet article</h2>
            <p>
              Cet article académique analyse la manière dont le Maroc est passé d'une reconnaissance constitutionnelle 
              du droit de grève à une régulation normative concrète avec la Loi organique n° 97.15. 
              Il explore également les tensions internationales au sein de l'OIT et compare le contexte marocain aux 
              standards européens.
            </p>
            <p className="loi-note">
              Cliquez sur chaque section pour dérouler et lire les sous-sections correspondantes de l'article.
            </p>
          </div>

          {/* Points clés */}
          <div>
            <p style={{ fontWeight: 700, color: '#1a0a2e', marginBottom: 14, fontSize: 15 }}>
              🔑 Thèmes principaux abordés
            </p>
            <div className="loi-themes-grid">
              {keyPoints.map((p, i) => (
                <div key={i} className="loi-theme-card">
                  <span className="loi-theme-icon">{p.icon}</span>
                  <span className="loi-theme-title">{p.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          {articleData?.sections.map(sec => (
            <div key={sec.id} id={sec.id}>
              <SectionViewer section={sec} onRead={(title, content) => setSelectedContent({title, content})} />
            </div>
          ))}
        </main>
      </div>

      {selectedContent && (
        <div className="loi-modal-overlay" onClick={() => setSelectedContent(null)}>
          <div className="loi-modal-content" onClick={e => e.stopPropagation()}>
            <div className="loi-modal-header">
              <h3>Lecture</h3>
              <button className="loi-modal-close" onClick={() => setSelectedContent(null)}>✕</button>
            </div>
            <div className="loi-modal-body">
              <h4 style={{ color: '#dc2626', marginBottom: 16 }}>{selectedContent.title}</h4>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#374151', fontSize: '15px' }}>
                {selectedContent.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
