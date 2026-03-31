import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';

const MOCK_ITEMS: Article[] = [
  { id: 101, title: 'Transformation organisationnelle : enjeux 2026', content: 'Le nouveau paradigme des entreprises marocaines face à la mondialisation.', category: 'NEWS', imageUrl: '', isPremium: false, publishedAt: '2026-03-27T08:00:00' },
  { id: 102, title: 'Politique de Rémunération et Performance', content: 'Comment aligner la rémunération sur la performance globale tout en préservant l\'équité interne.', category: 'ARTICLE', imageUrl: '', isPremium: true, publishedAt: '2026-03-26T10:00:00' },
  { id: 103, title: 'Baromètre QVT 2026 : Résultats nationaux', content: 'Une baisse significative du stress est observée chez les collaborateurs en télétravail hybride.', category: 'NEWS', imageUrl: '', isPremium: false, publishedAt: '2026-03-25T14:00:00' },
  { id: 104, title: 'Nomination : Nouvelle Direction RH chez Attijariwafa Bank', content: 'Un vent de fraîcheur technologique à la tête des ressources humaines.', category: 'NOMINATION', imageUrl: '', isPremium: false, publishedAt: '2026-03-24T09:00:00' },
  { id: 105, title: 'RSE : L\'employabilité au cœur de l\'impact sociétal', content: 'Les entreprises marocaines intègrent massivement l\'ESG dans leurs KPI.', category: 'NEWS', imageUrl: '', isPremium: true, publishedAt: '2026-03-23T11:00:00' },
  { id: 106, title: 'Les métiers de demain : que faut-il anticiper ?', content: 'IA, Data et automatisation : les 10 compétences qui feront la différence.', category: 'ARTICLE', imageUrl: '', isPremium: false, publishedAt: '2026-03-22T16:00:00' },
];

export const CategoryPage: React.FC<{ type: string }> = ({ type }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPageConfig = () => {
    switch (type) {
      case 'actualite-maroc':
        return { title: 'Actualité RH Maroc', sub: 'Toute l\'actualité des ressources humaines au Maroc.' };
      case 'actualite-france':
        return { title: 'Actualité RH France', sub: 'Suivez les tendances et décisions RH en France.' };
      case 'nominations':
        return { title: 'Nominations RH', sub: 'Les derniers mouvements et nominations stratégiques.' };
      case 'offres-emploi':
        return { title: 'Offres d\'Emploi', sub: 'Découvrez les meilleures opportunités RH.' };
      case 'textes-loi':
        return { title: 'Textes de Loi & Juridique', sub: 'Le cadre réglementaire marocain et ses évolutions.' };
      default:
        return { title: 'Dossiers & Ressources', sub: 'Explorez nos publications spécialisées.' };
    }
  };

  const { title, sub } = getPageConfig();

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">{title}</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">{sub}</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '60px 24px', minHeight: '60vh' }}>
        <div className="articles-grid">
          {MOCK_ITEMS.map((item) => (
            <ArticleCard key={item.id} article={item} />
          ))}
        </div>
      </div>
    </Layout>
  );
};
