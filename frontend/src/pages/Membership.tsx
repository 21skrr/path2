import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import './Membership.css';

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 0,
    name: 'Gratuit',
    price: '0',
    period: '',
    description: 'Accès de base à l\'actualité RH',
    features: [
      'Articles d\'actualité gratuits',
      'Nominations récentes',
      'Ressources de base',
    ],
  },
  {
    id: 1,
    name: 'Mensuel',
    price: '99',
    period: '/mois',
    description: 'Accès complet pendant un mois',
    features: [
      'Tous les articles premium',
      'Templates RH professionnels',
      'Guides juridiques complets',
      'Interviews exclusives',
      'Support prioritaire',
    ],
  },
  {
    id: 2,
    name: 'Annuel',
    price: '999',
    period: '/an',
    description: 'Meilleur rapport qualité-prix',
    features: [
      'Tout le plan Mensuel',
      'Économisez 189 MAD',
      'Accès anticipé au contenu',
      'Webinaires exclusifs',
      'Certificat de formation',
      'Support dédié 24/7',
    ],
    recommended: true,
  },
];

const generateTxRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HR-';
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export const Membership: React.FC = () => {
  const { isAuthenticated, isPremium, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.price === '0') return;
    setSelectedPlan(plan);
    setTxRef(generateTxRef());
    setStep(1);
    setSubmitted(false);
    setReceiptFile(null);
    setReceiptPreview('');
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReceipt = () => {
    if (!receiptFile) return;
    setSubmitted(true);
    setStep(3);
  };

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Nos Forfaits d'Adhésion</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">
            {isPremium
              ? '★ Vous êtes membre Premium — Profitez de tous les avantages !'
              : 'Débloquez l\'accès complet aux ressources et contenus premium'
            }
          </p>
        </div>
      </div>

      <div className="container membership-page">
        {/* ── Current Status ── */}
        {isAuthenticated && user && (
          <div className={`membership-status ${isPremium ? 'status-premium' : 'status-free'}`}>
            <span className="status-icon">{isPremium ? '★' : '○'}</span>
            <div>
              <strong>{user.name}</strong> — Statut actuel: <strong>{isPremium ? 'Premium' : 'Gratuit'}</strong>
            </div>
          </div>
        )}

        {/* ── Plans Grid ── */}
        <div className="plans-grid">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`plan-card ${plan.recommended ? 'plan-card--recommended' : ''} ${plan.price === '0' ? 'plan-card--free' : ''}`}
            >
              {plan.recommended && <div className="plan-badge">Recommandé</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-pricing">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-currency">MAD{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.description}</p>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              {plan.price === '0' ? (
                <button className="plan-btn plan-btn--free" disabled>Plan actuel</button>
              ) : isPremium ? (
                <button className="plan-btn plan-btn--active" disabled>Déjà Premium ★</button>
              ) : (
                <button
                  className={`plan-btn ${plan.recommended ? 'plan-btn--gold' : 'plan-btn--primary'}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Sélectionner
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Payment Modal ── */}
        {showModal && selectedPlan && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card animate-scaleIn" onClick={e => e.stopPropagation()}>
              {/* Steps indicator */}
              <div className="modal-steps">
                <div className={`step-dot ${step >= 1 ? 'step-dot--active' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 2 ? 'step-dot--active' : ''}`}>2</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 3 ? 'step-dot--active' : ''}`}>3</div>
              </div>

              {step === 1 && (
                <div className="modal-step-content">
                  <h2>🏦 Détails du Virement</h2>
                  <p className="modal-plan-info">{selectedPlan.name} — {selectedPlan.price} MAD{selectedPlan.period}</p>

                  <div className="rib-details">
                    <div className="rib-row"><span>Bénéficiaire</span><strong>HR Platform Morocco SARL</strong></div>
                    <div className="rib-row"><span>Banque</span><strong>Attijariwafa Bank</strong></div>
                    <div className="rib-row"><span>IBAN</span><strong>MA64 0000 0000 0000 0000 0000</strong></div>
                    <div className="rib-row"><span>SWIFT/BIC</span><strong>BCMAMAMC</strong></div>
                  </div>

                  <div className="tx-ref-box">
                    <label>📌 Référence de Transaction</label>
                    <div className="tx-ref-value">{txRef}</div>
                    <p className="tx-ref-note">⚠️ Indiquez cette référence dans les notes de votre virement bancaire</p>
                  </div>

                  <button className="modal-next-btn" onClick={() => setStep(2)}>Continuer → Preuve de paiement</button>
                </div>
              )}

              {step === 2 && (
                <div className="modal-step-content">
                  <h2>📤 Preuve de Paiement</h2>
                  <p className="modal-subtitle">Téléchargez une capture d'écran ou photo de votre reçu bancaire</p>

                  <div className="upload-zone">
                    {receiptPreview ? (
                      <div className="upload-preview">
                        <img src={receiptPreview} alt="Receipt preview" />
                        <button className="change-file-btn" onClick={() => { setReceiptFile(null); setReceiptPreview(''); }}>Changer</button>
                      </div>
                    ) : (
                      <label className="upload-dropzone" htmlFor="receipt-input">
                        <span className="upload-icon">📎</span>
                        <span className="upload-text">Cliquez ou glissez votre fichier ici</span>
                        <span className="upload-hint">PNG, JPG ou PDF — Max 5MB</span>
                        <input
                          id="receipt-input"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="upload-hidden-input"
                        />
                      </label>
                    )}
                  </div>

                  <div className="modal-actions">
                    <button className="modal-back-btn" onClick={() => setStep(1)}>← Retour</button>
                    <button
                      className="modal-submit-btn"
                      onClick={handleSubmitReceipt}
                      disabled={!receiptFile}
                    >
                      Soumettre la preuve
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && submitted && (
                <div className="modal-step-content modal-success">
                  <div className="success-icon">✅</div>
                  <h2>Demande Soumise !</h2>
                  <p>Votre preuve de paiement a été envoyée avec succès.</p>
                  <div className="success-details">
                    <div className="success-row"><span>Référence</span><strong>{txRef}</strong></div>
                    <div className="success-row"><span>Plan</span><strong>{selectedPlan.name} — {selectedPlan.price} MAD</strong></div>
                    <div className="success-row"><span>Statut</span><strong className="status-pending">⏳ En attente d'approbation</strong></div>
                  </div>
                  <p className="success-note">Notre équipe vérifiera votre paiement sous 24-48h. Vous recevrez une notification une fois approuvé.</p>
                  <button className="modal-close-btn" onClick={() => setShowModal(false)}>Fermer</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
