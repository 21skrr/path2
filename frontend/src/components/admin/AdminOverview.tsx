import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../contexts/PostsContext';
import { Users, Star, DollarSign, Clock, FileText, TrendingUp, ArrowRight, Plus } from 'lucide-react';

const STATS = [
  { label: 'Utilisateurs', value: '842', icon: <Users size={20} />, color: '#2563eb', bg: '#dbeafe' },
  { label: 'Membres Premium', value: '156', icon: <Star size={20} />, color: '#b45309', bg: '#fef3c7' },
  { label: 'Revenus (MAD)', value: '48,200', icon: <DollarSign size={20} />, color: '#059669', bg: '#d1fae5' },
  { label: 'En Attente', value: '3', icon: <Clock size={20} />, color: '#d97706', bg: '#fef3c7' },
];

const RECENT_ACTIVITY = [
  { text: 'Nouvel utilisateur inscrit: Sara Benmoussa', color: '#7B2D8E', time: 'il y a 5 min' },
  { text: 'Article publié: L\'IA et le recrutement en 2026', color: '#00B4A6', time: 'il y a 23 min' },
  { text: 'Paiement reçu: Karim El Mansouri (999 MAD)', color: '#059669', time: 'il y a 1h' },
  { text: 'Nouveau commentaire soumis pour validation', color: '#d97706', time: 'il y a 2h' },
  { text: 'Mise à jour de profil: Mohamed Alaoui', color: '#2563eb', time: 'il y a 3h' },
];

export const AdminOverview: React.FC = () => {
  const { posts } = usePosts();

  const recentPosts = posts.slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tableau de Bord</h1>
        <Link to="/admin/articles/new" className="wp-btn wp-btn-teal" style={{ textDecoration: 'none', height: 32, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Nouvel Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-row">
        {STATS.map((stat, i) => (
          <div key={i} className="admin-stat-tile">
            <div className="admin-stat-tile-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-stat-tile-info">
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Grid */}
      <div className="admin-overview">
        <div className="admin-overview-grid">
          {/* Recent Articles */}
          <div className="wp-panel">
            <div className="wp-panel-head">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <FileText size={15} style={{ color: '#7B2D8E' }} />
                Articles Récents
              </h2>
              <Link to="/admin/articles" style={{ fontSize: 12, color: '#2271b1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                Voir tous <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{ padding: '4px 16px 12px' }}>
              {recentPosts.length === 0 ? (
                <p style={{ color: '#8c8f94', fontSize: 13, padding: '16px 0' }}>
                  Aucun article pour l'instant.{' '}
                  <Link to="/admin/articles/new" style={{ color: '#7B2D8E' }}>Créer le premier →</Link>
                </p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="admin-activity-item">
                    <div className="admin-activity-dot" style={{ background: '#7B2D8E' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/admin/articles/edit/${post.id}`} style={{ fontSize: 13.5, fontWeight: 600, color: '#1d2327', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                      <div style={{ fontSize: 12, color: '#8c8f94', marginTop: 2 }}>
                        <span className="wp-cat-badge" style={{ fontSize: 10.5 }}>{post.category}</span>
                        <span style={{ marginLeft: 8 }}>{post.date}</span>
                      </div>
                    </div>
                    <Link to={`/admin/articles/edit/${post.id}`} style={{ fontSize: 12, color: '#2271b1', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                      Modifier
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="wp-panel">
            <div className="wp-panel-head">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <TrendingUp size={15} style={{ color: '#00B4A6' }} />
                Activité Récente
              </h2>
            </div>
            <div style={{ padding: '4px 16px 12px' }}>
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="admin-activity-item" style={{ alignItems: 'flex-start' }}>
                  <div className="admin-activity-dot" style={{ background: item.color, marginTop: 7 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, color: '#1d2327', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                    <p style={{ fontSize: 11.5, color: '#8c8f94', margin: '3px 0 0' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="wp-panel">
            <div className="wp-panel-head">
              <h2 style={{ fontSize: 14 }}>Actions Rapides</h2>
            </div>
            <div style={{ padding: '12px 16px', display: 'grid', gap: 8 }}>
              {[
                { label: 'Ajouter un article', href: '/admin/articles/new', color: '#7B2D8E', bg: '#f8f4fb' },
                { label: 'Gérer les utilisateurs', href: '/admin/users', color: '#2563eb', bg: '#dbeafe' },
                { label: 'Voir les paiements', href: '/admin/payments', color: '#059669', bg: '#d1fae5' },
                { label: 'Réglages du site', href: '/admin/settings', color: '#d97706', bg: '#fef3c7' },
              ].map(action => (
                <Link
                  key={action.href}
                  to={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    background: action.bg, borderRadius: 8, textDecoration: 'none',
                    color: action.color, fontSize: 13.5, fontWeight: 600,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <ArrowRight size={14} />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="wp-panel">
            <div className="wp-panel-head">
              <h2 style={{ fontSize: 14 }}>Statistiques Articles</h2>
            </div>
            <div style={{ padding: '12px 16px' }}>
              {[
                { label: 'Total articles', value: posts.length, color: '#7B2D8E' },
                { label: 'Actualité RH', value: posts.filter(p => p.category === 'ACTUALITÉ RH').length, color: '#2563eb' },
                { label: 'Interviews', value: posts.filter(p => p.category === 'INTERVIEW').length, color: '#00B4A6' },
                { label: 'Nominations', value: posts.filter(p => p.category === 'NOMINATION').length, color: '#d97706' },
                { label: 'Etudes', value: posts.filter(p => p.category === 'ETUDE').length, color: '#059669' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f1' }}>
                  <span style={{ fontSize: 13.5, color: '#1d2327' }}>{stat.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
