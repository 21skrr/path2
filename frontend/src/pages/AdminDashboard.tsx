import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

interface MockPayment {
  id: number;
  userName: string;
  userEmail: string;
  planName: string;
  amount: string;
  txRef: string;
  receiptUrl: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const MOCK_PAYMENTS: MockPayment[] = [
  {
    id: 1,
    userName: 'Karim El Mansouri',
    userEmail: 'karim@entreprise.ma',
    planName: 'Annuel',
    amount: '999 MAD',
    txRef: 'HR-ABCD1234',
    receiptUrl: '',
    submittedAt: '2026-03-25T14:30:00',
    status: 'PENDING',
  },
  {
    id: 2,
    userName: 'Sara Benjelloun',
    userEmail: 'sara@societe.ma',
    planName: 'Mensuel',
    amount: '99 MAD',
    txRef: 'HR-EFGH5678',
    receiptUrl: '',
    submittedAt: '2026-03-25T09:15:00',
    status: 'PENDING',
  },
  {
    id: 3,
    userName: 'Mohamed Alaoui',
    userEmail: 'malaoui@corp.ma',
    planName: 'Annuel',
    amount: '999 MAD',
    txRef: 'HR-IJKL9012',
    receiptUrl: '',
    submittedAt: '2026-03-24T16:45:00',
    status: 'PENDING',
  },
];

const STATS = [
  { label: 'Utilisateurs', value: '842', icon: '👥', color: '#2563eb' },
  { label: 'Membres Premium', value: '156', icon: '⭐', color: '#c9a227' },
  { label: 'Revenus (MAD)', value: '48,200', icon: '💰', color: '#059669' },
  { label: 'En Attente', value: '3', icon: '⏳', color: '#d97706' },
];

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<MockPayment[]>(MOCK_PAYMENTS);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});

  if (!isAdmin) {
    return (
      <Layout>
        <div className="page-hero">
          <div className="container">
            <h1>Accès Restreint</h1>
            <p className="page-hero-sub">Cette page est réservée aux administrateurs</p>
          </div>
        </div>
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</p>
          <h2>Authentification requise</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>Connectez-vous avec un compte admin pour accéder au tableau de bord.</p>
          <Link to="/login" className="btn-primary">Se connecter en tant qu'admin</Link>
        </div>
      </Layout>
    );
  }

  const handleApprove = (id: number) => {
    setPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'APPROVED' as const } : p
    ));
  };

  const handleReject = (id: number) => {
    setPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'REJECTED' as const } : p
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  return (
    <Layout>
      <div className="page-hero admin-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">⚙ Tableau de Bord Admin</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">Gestion des paiements et des adhésions</p>
        </div>
      </div>

      <div className="container admin-page">
        {/* ── Stats Grid ── */}
        <div className="admin-stats-grid">
          {STATS.map((stat, i) => (
            <div key={i} className={`admin-stat-card animate-fadeInUp delay-${i + 1}`}>
              <div className="admin-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pending Payments ── */}
        <div className="admin-section">
          <div className="section-header">
            <h2>⏳ Paiements en Attente <span className="pending-count">{pendingCount}</span></h2>
          </div>

          {payments.filter(p => p.status === 'PENDING').length === 0 ? (
            <div className="admin-empty">
              <span>✅</span>
              <p>Aucun paiement en attente</p>
            </div>
          ) : (
            <div className="admin-payments-list">
              {payments.filter(p => p.status === 'PENDING').map(payment => (
                <div key={payment.id} className="admin-payment-card">
                  <div className="payment-card-header">
                    <div className="payment-user">
                      <div className="payment-avatar">{payment.userName.charAt(0)}</div>
                      <div>
                        <div className="payment-name">{payment.userName}</div>
                        <div className="payment-email">{payment.userEmail}</div>
                      </div>
                    </div>
                    <span className="payment-status-badge status-pending-badge">En attente</span>
                  </div>

                  <div className="payment-details-grid">
                    <div className="payment-detail">
                      <span className="payment-detail-label">Plan</span>
                      <span className="payment-detail-value">{payment.planName}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Montant</span>
                      <span className="payment-detail-value">{payment.amount}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Référence</span>
                      <span className="payment-detail-value payment-ref">{payment.txRef}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Date</span>
                      <span className="payment-detail-value">{formatDate(payment.submittedAt)}</span>
                    </div>
                  </div>

                  <div className="payment-receipt-area">
                    <div className="receipt-placeholder">
                      📎 Reçu téléchargé — <span>Voir le document</span>
                    </div>
                  </div>

                  <div className="payment-admin-actions">
                    <div className="admin-notes-input">
                      <input
                        type="text"
                        placeholder="Notes admin (optionnel)..."
                        value={adminNotes[payment.id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [payment.id]: e.target.value })}
                      />
                    </div>
                    <div className="action-buttons">
                      <button className="admin-approve-btn" onClick={() => handleApprove(payment.id)}>
                        ✓ Approuver
                      </button>
                      <button className="admin-reject-btn" onClick={() => handleReject(payment.id)}>
                        ✗ Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Processed Payments ── */}
        {payments.filter(p => p.status !== 'PENDING').length > 0 && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📋 Historique Traité</h2>
            </div>
            <div className="admin-payments-list">
              {payments.filter(p => p.status !== 'PENDING').map(payment => (
                <div key={payment.id} className={`admin-payment-card admin-payment-card--processed`}>
                  <div className="payment-card-header">
                    <div className="payment-user">
                      <div className="payment-avatar">{payment.userName.charAt(0)}</div>
                      <div>
                        <div className="payment-name">{payment.userName}</div>
                        <div className="payment-email">{payment.userEmail}</div>
                      </div>
                    </div>
                    <span className={`payment-status-badge ${payment.status === 'APPROVED' ? 'status-approved-badge' : 'status-rejected-badge'}`}>
                      {payment.status === 'APPROVED' ? '✓ Approuvé' : '✗ Rejeté'}
                    </span>
                  </div>
                  <div className="payment-details-grid">
                    <div className="payment-detail">
                      <span className="payment-detail-label">Plan</span>
                      <span className="payment-detail-value">{payment.planName}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Montant</span>
                      <span className="payment-detail-value">{payment.amount}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Référence</span>
                      <span className="payment-detail-value payment-ref">{payment.txRef}</span>
                    </div>
                    <div className="payment-detail">
                      <span className="payment-detail-label">Date</span>
                      <span className="payment-detail-value">{formatDate(payment.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
