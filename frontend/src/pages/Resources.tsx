import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Resource } from '../types';
import './Resources.css';

const MOCK_RESOURCES: Resource[] = [
  { id: 1, title: 'Contrat de Travail CDI — Modèle Standard', fileUrl: '#', category: 'LEGAL', isPremium: false },
  { id: 2, title: 'Contrat de Travail CDD — Modèle Conforme', fileUrl: '#', category: 'LEGAL', isPremium: false },
  { id: 3, title: 'Règlement Intérieur — Template Entreprise', fileUrl: '#', category: 'LEGAL', isPremium: true },
  { id: 4, title: 'Modèle Fiche de Poste Complète', fileUrl: '#', category: 'TEMPLATE', isPremium: false },
  { id: 5, title: 'Grille d\'Évaluation Annuelle', fileUrl: '#', category: 'TEMPLATE', isPremium: true },
  { id: 6, title: 'Plan de Formation Annuel — Template Excel', fileUrl: '#', category: 'TEMPLATE', isPremium: false },
  { id: 7, title: 'Guide Onboarding — Première Semaine', fileUrl: '#', category: 'ONBOARDING', isPremium: false },
  { id: 8, title: 'Checklist Intégration Nouveau Collaborateur', fileUrl: '#', category: 'ONBOARDING', isPremium: false },
  { id: 9, title: 'Kit Complet Onboarding Premium', fileUrl: '#', category: 'ONBOARDING', isPremium: true },
  { id: 10, title: 'Procédure de Licenciement — Guide Juridique', fileUrl: '#', category: 'LEGAL', isPremium: true },
  { id: 11, title: 'Tableau de Bord RH — Indicateurs Clés', fileUrl: '#', category: 'TEMPLATE', isPremium: true },
  { id: 12, title: 'Lettre d\'Avertissement — Modèle', fileUrl: '#', category: 'LEGAL', isPremium: false },
];

const CATEGORIES = [
  { key: 'ALL', label: 'Tous', icon: '📋', count: 12 },
  { key: 'LEGAL', label: 'Légal', icon: '⚖️', count: 5 },
  { key: 'TEMPLATE', label: 'Modèles', icon: '📄', count: 4 },
  { key: 'ONBOARDING', label: 'Onboarding', icon: '🚀', count: 3 },
];

const getFileIcon = (title: string) => {
  if (title.toLowerCase().includes('excel') || title.toLowerCase().includes('tableau')) return '📊';
  if (title.toLowerCase().includes('guide') || title.toLowerCase().includes('kit')) return '📘';
  return '📄';
};

export const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const { isPremium: userIsPremium } = useAuth();

  const filtered = MOCK_RESOURCES.filter(r =>
    activeCategory === 'ALL' || r.category === activeCategory
  );

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = { 'LEGAL': 'Légal', 'TEMPLATE': 'Modèle', 'ONBOARDING': 'Onboarding' };
    return labels[category] || category;
  };

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Ressources Professionnelles</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">Templates, guides juridiques et outils pour les professionnels RH</p>
        </div>
      </div>

      <div className="container resources-page">
        {/* ── Category Tabs ── */}
        <div className="filter-tabs animate-fadeInUp delay-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`filter-tab ${activeCategory === cat.key ? 'filter-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span className="filter-tab-icon">{cat.icon}</span>
              {cat.label}
              <span className="filter-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* ── Resources Grid ── */}
        <div className="resources-grid">
          {filtered.map(resource => {
            const isLocked = resource.isPremium && !userIsPremium;
            return (
              <div key={resource.id} className={`resource-card card ${isLocked ? 'resource-card--locked' : ''}`}>
                <div className="resource-card-top">
                  <span className="resource-file-icon">{getFileIcon(resource.title)}</span>
                  <div className="resource-badges">
                    <span className="resource-cat-tag">{getCategoryLabel(resource.category)}</span>
                    {resource.isPremium && <span className="badge badge-premium">★ Premium</span>}
                  </div>
                </div>
                <h3 className="resource-title">{resource.title}</h3>
                <div className="resource-card-footer">
                  {isLocked ? (
                    <Link to="/membership" className="resource-upgrade-btn">
                      🔒 Débloquer avec Premium
                    </Link>
                  ) : (
                    <button className="resource-download-btn">
                      ⬇ Télécharger
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
