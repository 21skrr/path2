import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ArticlesList } from '../components/admin/ArticlesList';
import { PostEditor } from '../components/admin/PostEditor';
import { PaymentsPanel } from '../components/admin/PaymentsPanel';
import { UsersList } from '../components/admin/UsersList';
import { JobsList } from '../components/admin/JobsList';
import { ResourcesList } from '../components/admin/ResourcesList';
import { SettingsPanel } from '../components/admin/SettingsPanel';
import { Lock, PenSquare } from 'lucide-react';
import '../components/admin/admin.css';

/* ── Placeholder pages for nav items not yet built ── */
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div>
    <div className="admin-page-header">
      <h1 className="admin-page-title">{title}</h1>
    </div>
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <p style={{ color: '#646970', fontSize: 14 }}>Cette section est en cours de construction.</p>
    </div>
  </div>
);

/* ── Access Denied ── */
const AccessDenied: React.FC = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f0f0f1', flexDirection: 'column', gap: 16,
  }}>
    <Lock size={48} style={{ color: '#8c8f94' }} />
    <h2 style={{ color: '#1d2327', fontFamily: 'Inter, sans-serif', margin: 0 }}>Accès Restreint</h2>
    <p style={{ color: '#646970', fontFamily: 'Inter, sans-serif', margin: 0 }}>
      Cette page est réservée aux administrateurs.
    </p>
    <Link
      to="/login"
      style={{
        background: '#7B2D8E', color: '#fff', padding: '10px 24px',
        borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Se connecter en tant qu'admin
    </Link>
  </div>
);

/* ── Senior Member Landing (restricted dashboard) ── */
const SeniorLanding: React.FC = () => (
  <div>
    <div className="admin-page-header">
      <h1 className="admin-page-title">Espace Publication</h1>
    </div>
    <div style={{
      margin: '0 24px 32px',
      background: 'linear-gradient(135deg, #f5f0ff 0%, #f0fffe 100%)',
      border: '1px solid #e0d0f0',
      borderRadius: 12,
      padding: '32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7B2D8E, #d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PenSquare size={24} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: '#1d2327' }}>👑 Espace Senior / Recruteur</h2>
          <p style={{ margin: '4px 0 0', color: '#646970', fontSize: 14 }}>
            Bienvenue dans votre espace de publication dédié.
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Link to="/admin/articles/new" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', border: '1px solid #e0d0f0', borderRadius: 10,
          padding: '18px 20px', textDecoration: 'none',
        }}>
          <span style={{ fontSize: 28 }}>📝</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1d2327', fontSize: 15 }}>Publier un Article</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#646970' }}>Rédigez et publiez du contenu éditorial</p>
          </div>
        </Link>
        <Link to="/admin/jobs" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', border: '1px solid #e0d0f0', borderRadius: 10,
          padding: '18px 20px', textDecoration: 'none',
        }}>
          <span style={{ fontSize: 28 }}>💼</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1d2327', fontSize: 15 }}>Publier une Offre d'Emploi</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#646970' }}>Postez vos annonces de recrutement</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { isAdmin, isSenior } = useAuth();

  // Full admin: all routes
  if (isAdmin) {
    return (
      <AdminLayout>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/new" element={<PostEditor />} />
          <Route path="articles/edit/:id" element={<PostEditor />} />
          <Route path="payments" element={<PaymentsPanel />} />
          <Route path="users" element={<UsersList />} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="resources" element={<ResourcesList />} />
          <Route path="settings" element={<SettingsPanel />} />
          <Route path="media" element={<PlaceholderPage title="Médiathèque" />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  // Senior member: restricted — only articles & jobs
  if (isSenior) {
    return (
      <AdminLayout seniorMode>
        <Routes>
          <Route index element={<SeniorLanding />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/new" element={<PostEditor />} />
          <Route path="articles/edit/:id" element={<PostEditor />} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  return <AccessDenied />;
};
