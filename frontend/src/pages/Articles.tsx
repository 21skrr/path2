import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArticleCard } from '../components/ArticleCard';
import { usePosts } from '../contexts/PostsContext';
import { Article } from '../types';
import './Articles.css';

const ALL_ARTICLES: Article[] = [
  { id: 1, title: 'Code du Travail 2026 : Les 5 amendements cles que tout DRH doit connaitre', content: 'Le nouveau Code du Travail marocain apporte des changements significatifs en matiere de teletravail, conges parentaux et contrats a duree determinee.', category: 'ACTUALITE', imageUrl: '', isPremium: false, publishedAt: '2026-03-26T08:00:00' },
  { id: 2, title: 'Nomination: Mme. Fatima Zahra El Alaoui nommee DRH chez OCP Group', content: 'Mme. Fatima Zahra El Alaoui a ete nommee Directrice des Ressources Humaines du groupe OCP.', category: 'NOMINATION', imageUrl: '', isPremium: false, publishedAt: '2026-03-25T10:00:00' },
  { id: 3, title: 'Interview exclusive : Strategie RH de Maroc Telecom pour 2026', content: 'Dans cette interview exclusive, le DRH de Maroc Telecom partage sa vision pour la transformation digitale des processus RH.', category: 'INTERVIEW', imageUrl: '', isPremium: true, publishedAt: '2026-03-25T16:00:00' },
  { id: 4, title: 'Etude: Le marche de emploi au Maroc — tendances et previsions', content: 'Une nouvelle etude revele les tendances majeures du marche de emploi au Maroc pour 2026.', category: 'ETUDE', imageUrl: '', isPremium: false, publishedAt: '2026-03-24T12:00:00' },
  { id: 5, title: 'Nomination: M. Youssef Bennani rejoint Bank Al-Maghrib comme DRH', content: 'M. Youssef Bennani prend la tete de la Direction des Ressources Humaines de Bank Al-Maghrib.', category: 'NOMINATION', imageUrl: '', isPremium: false, publishedAt: '2026-03-24T14:00:00' },
  { id: 6, title: 'Conformite RGPD au Maroc : Guide pratique pour les RH', content: 'La protection des donnees personnelles des employes est devenue une priorite.', category: 'ACTUALITE', imageUrl: '', isPremium: true, publishedAt: '2026-03-23T11:00:00' },
  { id: 7, title: 'Nomination: Dr. Amina Kettani nommee VP People chez Jumia Maroc', content: 'Dr. Amina Kettani rejoint Jumia Maroc en tant que Vice-Presidente People & Culture.', category: 'NOMINATION', imageUrl: '', isPremium: true, publishedAt: '2026-03-23T09:00:00' },
  { id: 8, title: 'Comment les entreprises marocaines adoptent IA dans les RH', content: "L'intelligence artificielle transforme les processus RH au Maroc.", category: 'ETUDE', imageUrl: '', isPremium: false, publishedAt: '2026-03-22T15:00:00' },
  { id: 9, title: 'Teletravail au Maroc : Cadre juridique et bonnes pratiques RH', content: 'Avec adoption croissante du teletravail, les DRH doivent adapter leurs politiques.', category: 'ACTUALITE', imageUrl: '', isPremium: false, publishedAt: '2026-03-21T10:00:00' },
];

const CATEGORIES = [
  { key: 'ALL',        label: 'Tous',          icon: '📋' },
  { key: 'ACTUALITE',  label: 'Actualite RH',  icon: '📰' },
  { key: 'INTERVIEW',  label: 'Interviews',    icon: '🎙️' },
  { key: 'ETUDE',      label: 'Etudes',        icon: '📊' },
  { key: 'NOMINATION', label: 'Nominations',   icon: '🏆' },
];

export const Articles: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category');
  
  const { posts } = usePosts();
  
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  const mappedDynamicPosts: Article[] = posts.map(p => ({
    id: typeof p.id === 'string' ? parseInt(p.id) || Date.now() : p.id,
    title: p.title,
    content: p.excerpt,
    category: p.category,
    imageUrl: p.image || '',
    isPremium: false,
    publishedAt: new Date().toISOString(),
  }));

  const allCombined = [...mappedDynamicPosts, ...ALL_ARTICLES];

  const filtered = allCombined.filter(article => {
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
