import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MOCK_ACTUALITE } from './Home';
import { usePosts } from '../contexts/PostsContext';

export const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { posts } = usePosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Try to find the article in context posts, then in mock data
  const matchedPost = posts.find((p) => String(p.id) === id);
  const parsedId = parseInt(id || '0', 10);
  const matchedMock = MOCK_ACTUALITE.find((a) => a.id === parsedId);

  const title = matchedPost?.title || matchedMock?.title || "Article introuvable";
  const category = matchedPost?.category || matchedMock?.category || "INCONNU";
  const date = matchedPost?.date || matchedMock?.date || "DATE INCONNUE";
  const readTime = matchedPost?.readTime || "5 min";
  
  // Use post content if available, otherwise mock content, otherwise fallback
  const content = matchedPost?.content || "Contenu de l'article introuvable.";

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
            <span>⏱️ {readTime} de lecture</span>
          </div>
        </div>

        {matchedPost?.image && (
          <div style={{ marginBottom: '40px' }}>
            <img 
              src={matchedPost.image} 
              alt={title}
              style={{ width: '100%', borderRadius: '16px', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        )}

        {!matchedPost?.image && (
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
        )}

        <div style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--gray-700)' }}>
          {/* Render the actual content. For now we split by newlines for paragraphs. */}
          {content.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '24px' }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Layout>
  );
};
