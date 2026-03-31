import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';
import './Articles.css';

const ALL_ARTICLES: Article[] = [
  { id: 1, title: 'Code du Travail 2026 : Les 5 amendements clés que tout DRH doit connaître', content: 'Le nouveau Code du Travail marocain apporte des changements significatifs en matière de télétravail, congés parentaux et contrats à durée déterminée. Analyse détaillée des impacts pour les professionnels RH.', category: 'NEWS', imageUrl: '', isPremium: false, publishedAt: '2026-03-26T08:00:00' },
  { id: 2, title: 'Nomination: Mme. Fatima Zahra El Alaoui nommée DRH chez OCP Group', content: 'Mme. Fatima Zahra El Alaoui a été nommée Directrice des Ressources Humaines du groupe OCP, le leader mondial des phosphates. Forte de 15 ans d\'expérience dans le management stratégique des talents.', category: 'NOMINATION', imageUrl: '', isPremium: false, publishedAt: '2026-03-25T10:00:00' },
  { id: 3, title: 'Interview exclusive : Stratégie RH de Maroc Telecom pour 2026', content: 'Dans cette interview exclusive, le DRH de Maroc Telecom partage sa vision pour la transformation digitale des processus RH et le développement des compétences numériques au sein de l\'entreprise.', category: 'ARTICLE', imageUrl: '', isPremium: true, publishedAt: '2026-03-25T16:00:00' },
  { id: 4, title: 'Étude: Le marché de l\'emploi au Maroc — tendances et prévisions', content: 'Une nouvelle étude révèle les tendances majeures du marché de l\'emploi au Maroc pour 2026. Les secteurs IT, fintech et énergie renouvelable dominent la création d\'emplois dans le royaume.', category: 'NEWS', imageUrl: '', isPremium: false, publishedAt: '2026-03-24T12:00:00' },
  { id: 5, title: 'Nomination: M. Youssef Bennani rejoint Bank Al-Maghrib comme DRH', content: 'M. Youssef Bennani prend la tête de la Direction des Ressources Humaines de Bank Al-Maghrib. Il apporte une vision innovante avec un focus sur la transformation digitale RH bancaire.', category: 'NOMINATION', imageUrl: '', isPremium: false, publishedAt: '2026-03-24T14:00:00' },
  { id: 6, title: 'Conformité RGPD au Maroc : Guide pratique pour les RH', content: 'La protection des données personnelles des employés est devenue une priorité. Ce guide pratique aide les professionnels RH à se conformer à la loi 09-08 et aux standards internationaux.', category: 'NEWS', imageUrl: '', isPremium: true, publishedAt: '2026-03-23T11:00:00' },
  { id: 7, title: 'Nomination: Dr. Amina Kettani nommée VP People chez Jumia Maroc', content: 'Dr. Amina Kettani rejoint Jumia Maroc en tant que Vice-Présidente People & Culture. Son expertise en psychologie organisationnelle apportera une nouvelle dimension au management des talents.', category: 'NOMINATION', imageUrl: '', isPremium: true, publishedAt: '2026-03-23T09:00:00' },
  { id: 8, title: 'Comment les entreprises marocaines adoptent l\'IA dans les RH', content: 'L\'intelligence artificielle transforme les processus RH au Maroc. Du recrutement prédictif à l\'analyse des performances, découvrez les outils et stratégies adoptés par les leaders du marché.', category: 'ARTICLE', imageUrl: '', isPremium: false, publishedAt: '2026-03-22T15:00:00' },
  { id: 9, title: 'Télétravail au Maroc : Cadre juridique et bonnes pratiques RH', content: 'Avec l\'adoption croissante du télétravail, les DRH doivent adapter leurs politiques. Analyse du cadre juridique marocain et recommandations pratiques pour une mise en œuvre réussie.', category: 'NEWS', imageUrl: '', isPremium: false, publishedAt: '2026-03-21T10:00:00' },
];

const CATEGORIES = [
  { key: 'ALL', label: 'Tous', icon: '📋' },
  { key: 'NEWS', label: 'Actualité', icon: '📰' },
  { key: 'NOMINATION', label: 'Nominations', icon: '🏆' },
  { key: 'ARTICLE', label: 'Interviews', icon: '🎙️' },
];

export const Articles: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  const filtered = ALL_ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'ALL' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Actualité RH</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">Les dernières nouvelles, nominations et interviews du monde RH marocain</p>
        </div>
      </div>

      <div className="container articles-page">
        {/* ── Search & Filters ── */}
        <div className="articles-toolbar animate-fadeInUp delay-2">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs" style={{ flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`filter-tab ${activeCategory === cat.key ? 'filter-tab--active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span className="filter-tab-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
            {/* Show dynamic active category if it's not in the default list */}
            {!CATEGORIES.find(c => c.key === activeCategory) && activeCategory !== 'ALL' && (
              <button className="filter-tab filter-tab--active">
                <span className="filter-tab-icon">🏷️</span>
                {activeCategory}
              </button>
            )}
          </div>
        </div>

        {/* ── Results Count ── */}
        <div className="articles-count">
          <span>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
          {activeCategory !== 'ALL' && (
            <button className="clear-filter" onClick={() => setActiveCategory('ALL')}>Effacer le filtre ✕</button>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>Aucun article trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filtered.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
