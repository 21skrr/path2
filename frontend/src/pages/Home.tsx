import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';
import './Home.css';

// Mock data — works without backend
const MOCK_NOMINATIONS: Article[] = [
  {
    id: 1,
    title: 'Nomination: Mme. Fatima Zahra El Alaoui nommée DRH chez OCP Group',
    content: 'Mme. Fatima Zahra El Alaoui a été nommée Directrice des Ressources Humaines du groupe OCP, le leader mondial des phosphates. Forte de 15 ans d\'expérience dans le management stratégique des talents...',
    category: 'NOMINATION',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-25T10:00:00',
  },
  {
    id: 2,
    title: 'Nomination: M. Youssef Bennani rejoint Bank Al-Maghrib comme DRH',
    content: 'M. Youssef Bennani prend la tête de la Direction des Ressources Humaines de Bank Al-Maghrib. Il apporte une vision innovante avec un focus sur la transformation digitale RH...',
    category: 'NOMINATION',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-24T14:00:00',
  },
  {
    id: 3,
    title: 'Nomination: Dr. Amina Kettani nommée VP People chez Jumia Maroc',
    content: 'Dr. Amina Kettani rejoint Jumia Maroc en tant que Vice-Présidente People & Culture. Son expertise en psychologie organisationnelle et développement des compétences apportera...',
    category: 'NOMINATION',
    imageUrl: '',
    isPremium: true,
    publishedAt: '2026-03-23T09:00:00',
  },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: 4,
    title: 'Code du Travail 2026 : Les 5 amendements clés que tout DRH doit connaître',
    content: 'Le nouveau Code du Travail marocain apporte des changements significatifs en matière de télétravail, congés parentaux et contrats à durée déterminée. Analyse détaillée des impacts...',
    category: 'NEWS',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-26T08:00:00',
  },
  {
    id: 5,
    title: 'Interview exclusive : Stratégie RH de Maroc Telecom pour 2026',
    content: 'Dans cette interview exclusive, le DRH de Maroc Telecom partage sa vision pour la transformation digitale des processus RH et le développement des compétences numériques...',
    category: 'ARTICLE',
    imageUrl: '',
    isPremium: true,
    publishedAt: '2026-03-25T16:00:00',
  },
  {
    id: 6,
    title: 'Étude: Le marché de l\'emploi au Maroc — tendances et prévisions',
    content: 'Une nouvelle étude révèle les tendances majeures du marché de l\'emploi au Maroc pour 2026. Les secteurs IT, fintech et énergie renouvelable dominent la création d\'emplois...',
    category: 'NEWS',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-24T12:00:00',
  },
  {
    id: 7,
    title: 'Conformité RGPD au Maroc : Guide pratique pour les RH',
    content: 'La protection des données personnelles des employés est devenue une priorité. Ce guide pratique aide les professionnels RH à se conformer à la loi 09-08 et aux standards internationaux...',
    category: 'NEWS',
    imageUrl: '',
    isPremium: true,
    publishedAt: '2026-03-23T11:00:00',
  },
  {
    id: 8,
    title: 'Forum RH Maroc 2026 : Les moments forts de l\'édition de Casablanca',
    content: 'Le Forum RH Maroc 2026 a rassemblé plus de 500 professionnels à Casablanca. Retour sur les moments forts, les interventions marquantes et les tendances qui ont émergé...',
    category: 'ARTICLE',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-22T15:00:00',
  },
  {
    id: 9,
    title: 'Télétravail au Maroc : Cadre juridique et bonnes pratiques RH',
    content: 'Avec l\'adoption croissante du télétravail, les DRH doivent adapter leurs politiques. Analyse du cadre juridique marocain et recommandations pratiques pour une mise en œuvre réussie...',
    category: 'NEWS',
    imageUrl: '',
    isPremium: false,
    publishedAt: '2026-03-21T10:00:00',
  },
];

const STATS = [
  { value: '2,450+', label: 'Articles Publiés', icon: '📰' },
  { value: '8,200+', label: 'Membres Actifs', icon: '👥' },
  { value: '350+', label: 'Ressources', icon: '📁' },
  { value: '120+', label: 'Nominations', icon: '🏆' },
];

export const Home: React.FC = () => {
  return (
    <Layout>
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="container hero-content">
          <div className="hero-badge animate-fadeInUp">🇲🇦 Plateforme RH #1 au Maroc</div>
          <h1 className="hero-title animate-fadeInUp delay-1">
            L'actualité RH<br />
            <span className="hero-highlight">qui fait avancer</span> votre carrière
          </h1>
          <p className="hero-subtitle animate-fadeInUp delay-2">
            Actualités, nominations, ressources professionnelles et réseau d'experts — 
            tout ce dont les professionnels RH du Maroc ont besoin.
          </p>
          <div className="hero-actions animate-fadeInUp delay-3">
            <Link to="/articles" className="btn-primary">Explorer l'actualité →</Link>
            <Link to="/register" className="btn-hero-secondary">Rejoindre gratuitement</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div key={i} className={`stat-item animate-fadeInUp delay-${i + 1}`}>
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── Nominations Section ── */}
        <section className="home-section">
          <div className="section-header">
            <h2>🏆 Nominations Récentes</h2>
            <Link to="/articles" className="section-link">Voir toutes →</Link>
          </div>
          <div className="nominations-grid">
            {MOCK_NOMINATIONS.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* ── Latest Articles ── */}
        <section className="home-section">
          <div className="section-header">
            <h2>📰 Actualité RH</h2>
            <Link to="/articles" className="section-link">Tout voir →</Link>
          </div>
          <div className="articles-grid">
            {MOCK_ARTICLES.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="home-cta">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Accédez à tout le contenu Premium</h2>
              <p>Templates juridiques, guides exclusifs, interviews de DRH et bien plus encore.</p>
              <Link to="/membership" className="btn-gold">Découvrir les offres ★</Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">✓ Templates RH professionnels</div>
              <div className="cta-feature">✓ Guides juridiques complets</div>
              <div className="cta-feature">✓ Interviews exclusives</div>
              <div className="cta-feature">✓ Accès anticipé aux articles</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
