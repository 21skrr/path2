import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ArticlesList } from '../components/admin/ArticlesList';
import { PostEditor } from '../components/admin/PostEditor';
import { PaymentsPanel } from '../components/admin/PaymentsPanel';
import { Lock } from 'lucide-react';
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

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <AccessDenied />;

  return (
    <AdminLayout>
      <Routes>
        {/* Default: overview */}
        <Route index element={<AdminOverview />} />
        
        {/* Articles */}
        <Route path="articles" element={<ArticlesList />} />
        <Route path="articles/new" element={<PostEditor />} />
        <Route path="articles/edit/:id" element={<PostEditor />} />
        
        {/* Payments */}
        <Route path="payments" element={<PaymentsPanel />} />
        
        {/* Placeholders */}
        <Route path="media" element={<PlaceholderPage title="Médiathèque" />} />
        <Route path="users" element={<PlaceholderPage title="Utilisateurs" />} />
        <Route path="settings" element={<PlaceholderPage title="Réglages" />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};
