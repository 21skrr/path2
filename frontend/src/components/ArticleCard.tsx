import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { useAuth } from '../contexts/AuthContext';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const { isPremium: userIsPremium } = useAuth();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'NEWS': 'Actualité',
      'NOMINATION': 'Nomination',
      'ARTICLE': 'Interview',
    };
    return labels[category] || category;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'NEWS': '📰',
      'NOMINATION': '🏆',
      'ARTICLE': '🎙️',
    };
    return emojis[category] || '📄';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isLocked = article.isPremium && !userIsPremium;

  return (
    <div className={`article-card card ${variant === 'featured' ? 'article-card--featured' : ''} ${variant === 'compact' ? 'article-card--compact' : ''}`}>
      <div className="article-image-wrap">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="article-image" />
        ) : (
          <div className="article-image-placeholder">
            <span>{getCategoryEmoji(article.category)}</span>
          </div>
        )}
        <div className="article-badges">
          <span className={`badge badge-${article.category.toLowerCase()}`}>
            {getCategoryLabel(article.category)}
          </span>
          {article.isPremium && <span className="badge badge-premium">★ Premium</span>}
        </div>
        {isLocked && (
          <div className="article-lock-overlay">
            <div className="lock-icon">🔒</div>
            <span>Contenu Premium</span>
          </div>
        )}
      </div>
      <div className="article-body">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">
          {isLocked ? article.content.substring(0, 80) + '...' : article.content.substring(0, 150) + '...'}
        </p>
        <div className="article-footer">
          <span className="article-date">{formatDate(article.publishedAt)}</span>
          {isLocked ? (
            <Link to="/membership" className="article-cta-upgrade">Débloquer →</Link>
          ) : (
            <span className="article-read-more">Lire plus →</span>
          )}
        </div>
      </div>
    </div>
  );
};
