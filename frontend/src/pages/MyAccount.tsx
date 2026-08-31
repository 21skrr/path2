import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserPaymentHistory } from '../services/api';
import { PaymentSubmission } from '../types';
import { Link, Navigate } from 'react-router-dom';
import './MyAccount.css';

const TIER_LABELS: Record<string, string> = {
  FREE: 'Gratuit',
  COMMUNITY: 'Community',
  PROFESSIONAL: 'Professionnel',
  SENIOR: 'Senior / Recruteur',
};

const TIER_COLORS: Record<string, string> = {
  FREE: '#6b7280',
  COMMUNITY: '#00B4A6',
  PROFESSIONAL: '#7B2D8E',
  SENIOR: '#d97706',
};

const WHATSAPP_LINKS: Record<string, string | null> = {
  FREE: null,
  COMMUNITY: 'https://chat.whatsapp.com/XXXXX', // Replace with real link
  PROFESSIONAL: 'https://chat.whatsapp.com/XXXXX',
  SENIOR: 'https://chat.whatsapp.com/XXXXX',
};

export const MyAccount: React.FC = () => {
  const { user, isAuthenticated, isPremium, isPending } = useAuth();
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingPayments(true);
    fetchUserPaymentHistory(user.id)
      .then(res => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoadingPayments(false));
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return null;

  const tier = user.membershipTier;
  const tierColor = TIER_COLORS[tier] ?? '#6b7280';
  const whatsappLink = WHATSAPP_LINKS[tier];
  const referralCode = user.referralInfo?.referralCode ?? '—';

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBadge = () => {
    if (user.membershipStatus === 'PREMIUM') return { label: '★ Actif', bg: '#d1fae5', color: '#065f46' };
    if (user.membershipStatus === 'PENDING') return { label: '⏳ En attente de validation', bg: '#fef3c7', color: '#92400e' };
    return { label: '○ Gratuit', bg: '#f0f0f1', color: '#646970' };
  };
  const badge = statusBadge();

  return (
    <Layout>
      {/* Hero */}
      <div className="page-hero myaccount-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Mon Espace</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">
            Gérez votre abonnement, consultez vos avantages et suivez vos paiements.
          </p>
        </div>
      </div>

      <div className="container myaccount-container">

        {/* ── Profile Card ── */}
        <section className="myaccount-section">
          <div className="myaccount-card myaccount-profile-card">
            <div className="myaccount-avatar" style={{ background: `linear-gradient(135deg, ${tierColor}, #1a0a2e)` }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="myaccount-profile-info">
              <h2 className="myaccount-name">{user.name}</h2>
              <p className="myaccount-email">{user.email}</p>
            </div>
            <div className="myaccount-status-block">
              <span className="myaccount-tier-badge" style={{ background: `${tierColor}18`, color: tierColor, borderColor: `${tierColor}40` }}>
                {TIER_LABELS[tier]}
              </span>
              <span className="myaccount-status-pill" style={{ background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
          </div>
        </section>

        {/* ── PENDING Notice ── */}
        {isPending && (
          <div className="myaccount-pending-notice">
            <span className="myaccount-pending-icon">⏳</span>
            <div>
              <strong>Paiement en cours de vérification</strong>
              <p>Notre équipe examine votre preuve de virement. Vous serez notifié(e) sous 24–48h une fois votre abonnement activé.</p>
            </div>
          </div>
        )}

        <div className="myaccount-grid">
          {/* ── Avantages ── */}
          <section className="myaccount-section">
            <h2 className="myaccount-section-title">🎁 Vos Avantages</h2>
            <div className="myaccount-card">
              {/* WhatsApp */}
              <div className="myaccount-benefit-row">
                <span className="myaccount-benefit-icon">💬</span>
                <div className="myaccount-benefit-info">
                  <strong>Groupe WhatsApp Exclusif</strong>
                  <p>Rejoignez la communauté des professionnels RH PATH</p>
                </div>
                {whatsappLink && (isPremium || isPending) ? (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="myaccount-benefit-btn myaccount-benefit-btn--active">
                    Rejoindre →
                  </a>
                ) : (
                  <span className="myaccount-benefit-btn myaccount-benefit-btn--locked">🔒 Community+</span>
                )}
              </div>

              {/* Contenu Premium */}
              <div className="myaccount-benefit-row">
                <span className="myaccount-benefit-icon">📚</span>
                <div className="myaccount-benefit-info">
                  <strong>Contenu & Ressources Premium</strong>
                  <p>Articles exclusifs, études, templates RH professionnels</p>
                </div>
                {isPremium ? (
                  <Link to="/resources" className="myaccount-benefit-btn myaccount-benefit-btn--active">
                    Accéder →
                  </Link>
                ) : (
                  <Link to="/membership" className="myaccount-benefit-btn myaccount-benefit-btn--upgrade">
                    Passer Premium
                  </Link>
                )}
              </div>

              {/* Publication (Senior only) */}
              <div className="myaccount-benefit-row">
                <span className="myaccount-benefit-icon">✍️</span>
                <div className="myaccount-benefit-info">
                  <strong>Droits de Publication</strong>
                  <p>Publiez articles et offres d'emploi sur la plateforme</p>
                </div>
                {tier === 'SENIOR' ? (
                  <Link to="/admin" className="myaccount-benefit-btn myaccount-benefit-btn--active">
                    Publier →
                  </Link>
                ) : (
                  <span className="myaccount-benefit-btn myaccount-benefit-btn--locked">🔒 Senior</span>
                )}
              </div>

              {/* Annuaire */}
              <div className="myaccount-benefit-row">
                <span className="myaccount-benefit-icon">👥</span>
                <div className="myaccount-benefit-info">
                  <strong>Annuaire des Membres</strong>
                  <p>Consultez les profils des professionnels RH du réseau</p>
                </div>
                <Link to="/directory" className="myaccount-benefit-btn myaccount-benefit-btn--active">
                  Explorer →
                </Link>
              </div>
            </div>
          </section>

          {/* ── Code Parrainage ── */}
          <section className="myaccount-section">
            <h2 className="myaccount-section-title">🔗 Code de Parrainage</h2>
            <div className="myaccount-card">
              <p className="myaccount-referral-desc">
                Partagez votre code et gagnez <strong>250 MAD de crédits</strong> pour chaque nouvelle inscription.
              </p>
              <div className="myaccount-referral-row">
                <div className="myaccount-referral-code">{referralCode}</div>
                <button className={`myaccount-copy-btn ${copied ? 'copied' : ''}`} onClick={copyCode}>
                  {copied ? '✓ Copié !' : '📋 Copier'}
                </button>
              </div>
              <div className="myaccount-referral-stats">
                <div className="myaccount-ref-stat">
                  <span className="myaccount-ref-stat-val">{user.referralInfo?.referredCount ?? 0}</span>
                  <span className="myaccount-ref-stat-label">Parrainages</span>
                </div>
                <div className="myaccount-ref-stat">
                  <span className="myaccount-ref-stat-val">{user.referralInfo?.credits ?? 0} MAD</span>
                  <span className="myaccount-ref-stat-label">Crédits gagnés</span>
                </div>
                <div className="myaccount-ref-stat">
                  <span className="myaccount-ref-stat-val">{user.referralInfo?.freeMonthsEarned ?? 0}</span>
                  <span className="myaccount-ref-stat-label">Mois gratuits</span>
                </div>
              </div>
            </div>

            {/* Upgrade CTA if free */}
            {tier === 'FREE' && (
              <div className="myaccount-upgrade-cta">
                <p>Vous n'avez pas encore d'abonnement actif.</p>
                <Link to="/membership" className="myaccount-upgrade-btn">
                  Voir les Offres d'Adhésion →
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* ── Historique des Paiements ── */}
        <section className="myaccount-section">
          <h2 className="myaccount-section-title">📋 Historique des Paiements</h2>
          <div className="myaccount-card">
            {loadingPayments ? (
              <div className="myaccount-loading">
                <div className="myaccount-spinner" />
                <p>Chargement de l'historique...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="myaccount-empty">
                <span>💳</span>
                <p>Aucun paiement trouvé. <Link to="/membership">Souscrire à un abonnement →</Link></p>
              </div>
            ) : (
              <table className="myaccount-payments-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Plan</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Reçu</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td><code>{p.transactionReference || '—'}</code></td>
                      <td>Plan #{p.planId}</td>
                      <td>{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('fr-FR') : '—'}</td>
                      <td>
                        <span className={`myaccount-payment-status ${
                          p.status === 'APPROVED' ? 'status--approved'
                          : p.status === 'REJECTED' ? 'status--rejected'
                          : 'status--pending'
                        }`}>
                          {p.status === 'APPROVED' ? '✓ Approuvé'
                            : p.status === 'REJECTED' ? '✗ Rejeté'
                            : '⏳ En attente'}
                        </span>
                      </td>
                      <td>
                        {p.receiptImageUrl
                          ? <a href={p.receiptImageUrl} target="_blank" rel="noopener noreferrer" className="myaccount-receipt-link">Voir →</a>
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
};
