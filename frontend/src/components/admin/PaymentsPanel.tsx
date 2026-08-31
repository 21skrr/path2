import React, { useState, useEffect } from 'react';
import { CheckCircle, Paperclip, XCircle, Loader, RefreshCw } from 'lucide-react';
import { fetchPendingPayments, approvePayment, rejectPayment } from '../../services/api';
import { PaymentSubmission } from '../../types';

export const PaymentsPanel: React.FC = () => {
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPendingPayments();
      setPayments(res.data);
    } catch {
      setError('Impossible de charger les paiements. Vérifiez la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await approvePayment(id, adminNotes[id] || '');
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    } catch {
      alert('Erreur lors de l\'approbation. Veuillez réessayer.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await rejectPayment(id, adminNotes[id] || '');
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    } catch {
      alert('Erreur lors du rejet. Veuillez réessayer.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const filtered = payments.filter(p => activeFilter === 'ALL' || p.status === activeFilter);
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Paiements & Adhésions</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {pendingCount > 0 && (
            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              {pendingCount} en attente
            </span>
          )}
          <button
            onClick={load}
            style={{ background: '#f0f0f1', border: '1px solid #ddd', borderRadius: 6, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#646970' }}
          >
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>
      </div>

      <div style={{ padding: '0 24px 32px' }}>
        {/* Loading / Error */}
        {loading && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Loader size={28} style={{ color: '#7B2D8E', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#646970', fontSize: 14 }}>Chargement des paiements...</p>
          </div>
        )}
        {error && !loading && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '20px', marginBottom: 16, color: '#991b1b', fontSize: 14 }}>
            ⚠️ {error}
            <button onClick={load} style={{ marginLeft: 12, fontSize: 13, color: '#7B2D8E', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Sub-filter Links */}
            <div style={{ paddingBottom: 8, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s, i, arr) => (
                <React.Fragment key={s}>
                  <button
                    className={`articles-subfilter-link ${activeFilter === s ? 'active' : ''}`}
                    onClick={() => setActiveFilter(s)}
                  >
                    {s === 'ALL' ? `Tous (${payments.length})`
                      : s === 'PENDING' ? `En attente (${payments.filter(p => p.status === 'PENDING').length})`
                      : s === 'APPROVED' ? `Approuvés (${payments.filter(p => p.status === 'APPROVED').length})`
                      : `Rejetés (${payments.filter(p => p.status === 'REJECTED').length})`}
                  </button>
                  {i < arr.length - 1 && <span className="articles-subfilter-sep">|</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Payments List */}
            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              {filtered.length === 0 && (
                <div className="wp-panel" style={{ padding: 40, textAlign: 'center' }}>
                  <CheckCircle size={40} style={{ color: '#22c55e', margin: '0 auto 12px' }} />
                  <p style={{ color: '#646970', fontWeight: 500 }}>Aucun paiement dans cette catégorie.</p>
                </div>
              )}
              {filtered.map((payment) => (
                <div key={payment.id} className="wp-panel" style={{ overflow: 'visible' }}>
                  <div style={{ padding: '16px 20px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7B2D8E, #00B4A6)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 16,
                        }}>
                          {payment.userId}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1d2327' }}>
                            Utilisateur #{payment.userId}
                          </p>
                          <p style={{ margin: 0, fontSize: 12.5, color: '#8c8f94' }}>
                            Plan #{payment.planId}
                          </p>
                        </div>
                      </div>
                      <span className={`wp-status-badge ${
                        payment.status === 'APPROVED' ? 'wp-status-published'
                          : payment.status === 'REJECTED' ? 'wp-status-pending'
                          : 'wp-status-draft'
                      }`} style={{ fontSize: 12 }}>
                        {payment.status === 'APPROVED' ? '✓ Approuvé'
                          : payment.status === 'REJECTED' ? '✗ Rejeté'
                          : '⏳ En attente'}
                      </span>
                    </div>

                    {/* Details grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '12px 0', borderTop: '1px solid #f0f0f1', borderBottom: '1px solid #f0f0f1', marginBottom: 12 }}>
                      {[
                        { label: 'Référence', value: payment.transactionReference || '—' },
                        { label: 'Soumis le', value: payment.submittedAt ? formatDate(payment.submittedAt) : '—' },
                        { label: 'Reçu', value: payment.receiptImageUrl ? 'Téléchargé ✓' : 'Non fourni' },
                      ].map(d => (
                        <div key={d.label}>
                          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#8c8f94', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 13.5, fontWeight: 600, color: '#1d2327', fontFamily: d.label === 'Référence' ? 'monospace' : 'inherit' }}>{d.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Receipt link */}
                    {payment.receiptImageUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#646970', marginBottom: 12 }}>
                        <Paperclip size={13} />
                        <a href={payment.receiptImageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2271b1' }}>
                          Voir le reçu
                        </a>
                      </div>
                    )}

                    {/* Admin notes if exists */}
                    {payment.reviewNotes && payment.status !== 'PENDING' && (
                      <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#646970', marginBottom: 12 }}>
                        📝 Note admin : {payment.reviewNotes}
                      </div>
                    )}

                    {/* Actions (only for PENDING) */}
                    {payment.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="Notes admin (optionnel)..."
                          value={adminNotes[payment.id] || ''}
                          onChange={e => setAdminNotes({ ...adminNotes, [payment.id]: e.target.value })}
                          style={{
                            flex: 1, minWidth: 180, height: 32, padding: '0 10px',
                            border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13,
                            fontFamily: 'inherit', color: '#1d2327',
                          }}
                        />
                        <button
                          className="wp-btn"
                          style={{ background: '#d1fae5', borderColor: '#6ee7b7', color: '#065f46', fontWeight: 700, opacity: processingId === payment.id ? 0.6 : 1 }}
                          onClick={() => handleApprove(payment.id)}
                          disabled={processingId === payment.id}
                        >
                          <CheckCircle size={13} /> Approuver
                        </button>
                        <button
                          className="wp-btn"
                          style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', fontWeight: 700, opacity: processingId === payment.id ? 0.6 : 1 }}
                          onClick={() => handleReject(payment.id)}
                          disabled={processingId === payment.id}
                        >
                          <XCircle size={13} /> Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
