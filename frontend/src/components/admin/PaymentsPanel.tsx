import React, { useState } from 'react';
import { CheckCircle, Paperclip, XCircle } from 'lucide-react';

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
  { id: 1, userName: 'Karim El Mansouri', userEmail: 'karim@entreprise.ma', planName: 'Annuel', amount: '999 MAD', txRef: 'HR-ABCD1234', receiptUrl: '', submittedAt: '2026-03-25T14:30:00', status: 'PENDING' },
  { id: 2, userName: 'Sara Benjelloun', userEmail: 'sara@societe.ma', planName: 'Mensuel', amount: '99 MAD', txRef: 'HR-EFGH5678', receiptUrl: '', submittedAt: '2026-03-25T09:15:00', status: 'PENDING' },
  { id: 3, userName: 'Mohamed Alaoui', userEmail: 'malaoui@corp.ma', planName: 'Annuel', amount: '999 MAD', txRef: 'HR-IJKL9012', receiptUrl: '', submittedAt: '2026-03-24T16:45:00', status: 'PENDING' },
  { id: 4, userName: 'Fatima Zahra Ait', userEmail: 'fz@consultma.ma', planName: 'Mensuel', amount: '99 MAD', txRef: 'HR-MNOP3456', receiptUrl: '', submittedAt: '2026-03-20T10:00:00', status: 'APPROVED' },
];

export const PaymentsPanel: React.FC = () => {
  const [payments, setPayments] = useState<MockPayment[]>(MOCK_PAYMENTS);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const handleApprove = (id: number) =>
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));

  const handleReject = (id: number) =>
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));

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
        {pendingCount > 0 && (
          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            {pendingCount} en attente
          </span>
        )}
      </div>

      <div style={{ padding: '0 24px 32px' }}>
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
                      {payment.userName.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1d2327' }}>{payment.userName}</p>
                      <p style={{ margin: 0, fontSize: 12.5, color: '#8c8f94' }}>{payment.userEmail}</p>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '12px 0', borderTop: '1px solid #f0f0f1', borderBottom: '1px solid #f0f0f1', marginBottom: 12 }}>
                  {[
                    { label: 'Plan', value: payment.planName },
                    { label: 'Montant', value: payment.amount },
                    { label: 'Référence', value: payment.txRef },
                    { label: 'Date', value: formatDate(payment.submittedAt) },
                  ].map(d => (
                    <div key={d.label}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#8c8f94', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 13.5, fontWeight: 600, color: '#1d2327', fontFamily: d.label === 'Référence' ? 'monospace' : 'inherit' }}>{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Receipt */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#646970', marginBottom: 12 }}>
                  <Paperclip size={13} />
                  <span>Reçu téléchargé — <span style={{ color: '#2271b1', cursor: 'pointer' }}>Voir le document</span></span>
                </div>

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
                      style={{ background: '#d1fae5', borderColor: '#6ee7b7', color: '#065f46', fontWeight: 700 }}
                      onClick={() => handleApprove(payment.id)}
                    >
                      <CheckCircle size={13} /> Approuver
                    </button>
                    <button
                      className="wp-btn"
                      style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', fontWeight: 700 }}
                      onClick={() => handleReject(payment.id)}
                    >
                      <XCircle size={13} /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
