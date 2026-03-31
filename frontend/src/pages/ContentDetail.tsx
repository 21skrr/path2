import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MOCK_ACTUALITE } from './Home';

export const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Try to find the article in mock data
  const parsedId = parseInt(id || '0', 10);
  const matchedArticle = MOCK_ACTUALITE.find((a) => a.id === parsedId);

  const title = matchedArticle?.title || "Stratégie RH et Transformation : Les clés du succès en 2026";
  const category = matchedArticle?.category || "ARTICLE EXPERT";
  const date = matchedArticle?.date || "28 MARS 2026";

  return (
    <Layout>
      <div className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary-dark)', 
            borderRadius: '100px', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            marginBottom: '16px' 
          }}>
            {category}
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '16px', color: 'var(--gray-900)' }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gray-500)', fontSize: '14px', gap: '16px' }}>
            <span>📅 {date}</span>
            <span>⏱️ 5 min de lecture</span>
          </div>
        </div>

        <div style={{ 
          width: '100%', 
          height: '400px', 
          background: 'linear-gradient(135deg, #1a0a2e 0%, #7B2D8E 100%)', 
          borderRadius: '16px', 
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.1)',
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '10px'
        }}>
          P@TH EXCLUSIF
        </div>

        <div style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--gray-700)' }}>
          <p style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '500', color: 'var(--gray-900)' }}>
            Dans un monde professionnel en perpétuelle mutation, les directeurs des ressources humaines se retrouvent en première ligne pour orchestrer la transformation des organisations. L'intelligence artificielle, l'hybridation du travail et les nouvelles attentes des collaborateurs imposent de repenser intégralement l'expérience employé.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Selon de récentes études menées auprès de plus de 500 DRH au Maroc et en Afrique francophone, 72% des entreprises considèrent la rétention des talents comme leur priorité absolue. Face à ce défi, la réponse traditionnelle par les avantages financiers ne suffit plus. La quête de sens, la flexibilité et la culture du feedback continu sont désormais les véritables moteurs de l'engagement.
          </p>
          <h3 style={{ fontSize: '24px', marginTop: '40px', marginBottom: '16px', color: 'var(--gray-900)' }}>L'IA : Menace ou Opportunité ?</h3>
          <p style={{ marginBottom: '24px' }}>
            L'automatisation de certaines tâches administratives permet aujourd'hui aux équipes RH de se recentrer sur leur cœur de métier : l'humain. « <em>La technologie nous redonne le temps nécessaire pour écouter, analyser et accompagner les trajectoires de carrières de manière systémique</em> », souligne un expert du secteur.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Cependant, cette transition nécessite un accompagnement de proximité. La formation continue et le reskilling deviennent des investissements stratégiques indispensables pour garantir l'employabilité des équipes à l'ère numérique.
          </p>
          <div style={{ 
            padding: '24px', 
            background: 'var(--gray-50)', 
            borderLeft: '4px solid var(--primary)', 
            borderRadius: '0 8px 8px 0',
            marginTop: '40px' 
          }}>
            <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--gray-900)' }}>💡 À retenir</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--gray-600)' }}>
              <li style={{ marginBottom: '8px' }}>La flexibilité est le premier critère de rétention pour la Gen Z.</li>
              <li style={{ marginBottom: '8px' }}>L'IA libère 30% du temps administratif RH.</li>
              <li>La marque employeur se construit d'abord en interne.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};
