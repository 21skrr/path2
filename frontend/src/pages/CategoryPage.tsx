import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { usePosts } from '../contexts/PostsContext';
import { ArticleCard } from '../components/ArticleCard';
import { FeaturedHero, NewsSlider, SectionHeader } from './Home';

const CATEGORY_MAP: Record<string, string> = {
  'actualite-maroc': 'ACTUALITE',
  'actualite-france': 'ACTUALITE',
  'interviews': 'INTERVIEW',
  'nominations': 'NOMINATION',
  'etudes': 'ETUDE',
  'annuaire': 'ANNUAIRE',
  'offres-emploi': 'OFFRE_EMPLOI',
  'textes-loi': 'TEXTE_LOI',
  'articles': 'ARTICLE',
};

const SUBCAT_SLUG_MAP: Record<string, string> = {
  'actualite-maroc': 'Actualité RH Maroc',
  'actualite-france': 'Actualité RH France',
  'code-travail': 'Code du Travail Marocain',
  'loi-09-08': 'Loi sur la Protection des Données (09-08)',
  'conventions': 'Conventions Collectives',
  'decrets': 'Décrets & Arrêtés RH',
  'securite': 'Textes sur la Sécurité au Travail',
  'teletravail': 'Réglementation du Télétravail'
};

export const CategoryPage: React.FC<{ type: string }> = ({ type }) => {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const { posts } = usePosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPageConfig = () => {
    let baseTitle = '';
    let sub = '';
    
    switch (type) {
      case 'actualite-maroc': baseTitle = 'Actualité RH Maroc'; sub = 'Toute l\'actualité des ressources humaines au Maroc'; break;
      case 'actualite-france': baseTitle = 'Actualité RH France'; sub = 'Suivez les tendances et décisions RH en France.'; break;
      case 'interviews': baseTitle = 'Interviews'; sub = 'Des entretiens exclusifs avec les leaders RH.'; break;
      case 'nominations': baseTitle = 'Nominations RH'; sub = 'Les derniers mouvements et nominations stratégiques.'; break;
      case 'etudes': baseTitle = 'Etudes & Publications'; sub = 'Des analyses approfondies du marché RH.'; break;
      case 'annuaire': baseTitle = 'Annuaire'; sub = 'Le répertoire des professionnels RH.'; break;
      case 'offres-emploi': baseTitle = 'Offres d\'Emploi'; sub = 'Découvrez les meilleures opportunités RH.'; break;
      case 'textes-loi': baseTitle = 'Textes de Loi & Juridique'; sub = 'Le cadre réglementaire marocain et ses évolutions.'; break;
      default: baseTitle = 'Dossiers & Ressources'; sub = 'Explorez nos publications spécialisées.'; break;
    }

    const subcatKey = params.id || type;
    const preciseSubcat = SUBCAT_SLUG_MAP[subcatKey];
    
    if (preciseSubcat && type === 'textes-loi') {
      baseTitle = preciseSubcat;
    }

    return { title: baseTitle, sub, subcatKey };
  };

  const { title, sub, subcatKey } = getPageConfig();
  const categoryEnum = CATEGORY_MAP[type];
  const requiredSubCat = SUBCAT_SLUG_MAP[subcatKey];

  // Filter posts for this specific category and optionally subcategory
  const categoryPosts = useMemo(() => {
    return posts.filter(p => {
      if (p.category !== categoryEnum) return false;
      if (requiredSubCat && p.subCategory !== requiredSubCat) return false;
      return true;
    });
  }, [posts, categoryEnum, requiredSubCat]);

  const sliderPosts = categoryPosts.filter(p => p.placement === 'SLIDER');
  const featuredMain = categoryPosts.find(p => p.placement === 'FEATURED_MAIN');
  const featuredSecondary = categoryPosts.filter(p => p.placement === 'FEATURED_SECONDARY').slice(0, 2);
  const trendingPosts = categoryPosts.filter(p => p.placement === 'TRENDING').slice(0, 3);
  const standardPosts = categoryPosts.filter(p => !p.placement || p.placement === 'STANDARD');

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">{title}</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">{sub}</p>
        </div>
      </div>
      
      {sliderPosts.length > 0 && <NewsSlider posts={sliderPosts} />}
      
      {(featuredMain || featuredSecondary.length > 0 || trendingPosts.length > 0) && (
        <FeaturedHero 
          main={featuredMain} 
          secondary={featuredSecondary} 
          trending={trendingPosts} 
        />
      )}

      <div className="container" style={{ padding: '60px 24px', minHeight: '60vh' }}>
        {standardPosts.length > 0 ? (
          <>
            <SectionHeader title={`Tous les articles - ${title}`} href="#" />
            <div className="articles-grid">
              {standardPosts.map((item) => (
                <ArticleCard key={item.id} article={item as any} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Aucun article standard pour le moment.
          </div>
        )}
      </div>
    </Layout>
  );
};
