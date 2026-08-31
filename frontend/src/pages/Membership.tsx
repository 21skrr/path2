import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { MembershipTier, AccountType } from '../types';
import { initiatePayment, uploadReceipt } from '../services/api';
import './Membership.css';

// ─── Plan Definitions ─────────────────────────────────────
interface PlanVariant {
  accountType: AccountType;
  price: number;
}

interface Plan {
  id: number;
  tierId: MembershipTier;
  name: string;
  tagline: string;
  icon: string;
  accentColor: string;
  variants: PlanVariant[];
  description: string;
  features: { text: string; highlighted?: boolean }[];
  warning?: string;
  recommended?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 1,
    tierId: 'COMMUNITY',
    name: 'Pack Community',
    tagline: 'Rejoignez la communauté',
    icon: '🤝',
    accentColor: '#00B4A6',
    variants: [{ accountType: 'INDIVIDUAL', price: 100 }],
    description: 'Accès à la communauté WhatsApp et agenda des meetups',
    features: [
      { text: 'Accès au groupe WhatsApp exclusif PATH' },
      { text: 'Agenda & programme des meetups' },
      { text: 'Newsletter premium mensuelle' },
      { text: 'Annuaire des membres de la communauté' },
    ],
    warning: '⚠️ La participation aux meetups est payante : 400 dh par meetup',
  },
  {
    id: 2,
    tierId: 'PROFESSIONAL',
    name: 'Pack Professionnel / Benchmark',
    tagline: 'Pour les DRH & professionnels RH',
    icon: '🎯',
    accentColor: '#7B2D8E',
    variants: [
      { accountType: 'INDIVIDUAL', price: 2500 },
      { accountType: 'COMPANY', price: 3500 },
    ],
    description: 'Tous les meetups inclus + accès aux benchmarks RH',
    features: [
      { text: 'Tout le Pack Community' },
      { text: 'Tous les meetups inclus gratuitement', highlighted: true },
      { text: 'Accès aux discussions Benchmark RH' },
      { text: 'Contenus premium & études exclusives' },
      { text: 'Templates RH professionnels' },
      { text: 'Guides juridiques complets' },
      { text: 'Webinaires experts mensuels' },
    ],
    recommended: true,
    badge: 'Le plus populaire',
  },
  {
    id: 3,
    tierId: 'SENIOR',
    name: 'Pack Senior / Recruteur',
    tagline: 'Accès éditorial complet',
    icon: '👑',
    accentColor: '#d97706',
    variants: [
      { accountType: 'INDIVIDUAL', price: 4000 },
      { accountType: 'COMPANY', price: 5000 },
    ],
    description: 'Tous les avantages Pro + droits de publication sur la plateforme',
    features: [
      { text: 'Tout le Pack Professionnel' },
      { text: 'Publication d\'annonces de recrutement', highlighted: true },
      { text: 'Publication d\'articles & contenu éditorial', highlighted: true },
      { text: 'Accès à la base de données RH avancée', highlighted: true },
      { text: 'Profil DRH mis en avant dans l\'annuaire' },
      { text: 'Badge Senior visible sur la plateforme' },
      { text: 'Support dédié 24/7' },
    ],
    badge: 'Éditorial',
  },
];

const generateTxRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PATH-';
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const REFERRAL_REWARDS = [
  { threshold: 1, reward: '250 MAD de crédit', icon: '💰' },
  { threshold: 3, reward: '1 Pass Meetup offert (400 MAD)', icon: '🎟️' },
  { threshold: 6, reward: '1 mois gratuit', icon: '🎁' },
  { threshold: 10, reward: 'Statut Ambassadeur PATH', icon: '🏅' },
];

// ─── Sub-components ───────────────────────────────────────

const PlanCard: React.FC<{
  plan: Plan;
  selectedAccountType: AccountType;
  onSelect: (plan: Plan, variant: PlanVariant) => void;
  currentTier?: MembershipTier;
}> = ({ plan, selectedAccountType, onSelect, currentTier }) => {
  const variant = plan.variants.find(v => v.accountType === selectedAccountType)
    || plan.variants[0];
  const isCurrentPlan = currentTier === plan.tierId;

  return (
    <div className={`mem-plan-card ${plan.recommended ? 'mem-plan-featured' : ''} ${isCurrentPlan ? 'mem-plan-current' : ''}`}>
      {plan.badge && <div className="mem-plan-badge">{plan.badge}</div>}
      {isCurrentPlan && <div className="mem-plan-active-badge">✓ Plan actuel</div>}

      <div className="mem-plan-icon" style={{ background: `${plan.accentColor}18`, color: plan.accentColor }}>
        {plan.icon}
      </div>

      <h3 className="mem-plan-name">{plan.name}</h3>
      <p className="mem-plan-tagline">{plan.tagline}</p>

      <div className="mem-plan-pricing">
        <div className="mem-plan-price-row">
          <span className="mem-plan-price">{variant.price.toLocaleString('fr-MA')}</span>
          <span className="mem-plan-currency"> dh<span className="mem-plan-period">/mois</span></span>
        </div>
        {plan.variants.length > 1 && (
          <div className="mem-plan-variants-note">
            {plan.variants.map(v => (
              <span key={v.accountType} className={`mem-variant-chip ${v.accountType === selectedAccountType ? 'active' : ''}`}>
                {v.accountType === 'INDIVIDUAL' ? 'Individuel' : 'Entreprise'}: {v.price.toLocaleString('fr-MA')} dh
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="mem-plan-desc">{plan.description}</p>

      <ul className="mem-plan-features">
        {plan.features.map((f, i) => (
          <li key={i} className={f.highlighted ? 'mem-feature-highlighted' : ''}>
            <span className="mem-check" style={{ color: plan.accentColor }}>✓</span>
            {f.text}
          </li>
        ))}
      </ul>

      {plan.warning && (
        <div className="mem-plan-warning">{plan.warning}</div>
      )}

      {isCurrentPlan ? (
        <button className="mem-plan-btn mem-plan-btn-current" disabled>Plan actuel ✓</button>
      ) : (
        <button
          className={`mem-plan-btn ${plan.recommended ? 'mem-plan-btn-featured' : plan.tierId === 'SENIOR' ? 'mem-plan-btn-senior' : 'mem-plan-btn-default'}`}
          onClick={() => onSelect(plan, variant)}
        >
          Sélectionner ce plan →
        </button>
      )}
    </div>
  );
};

const ReferralDashboard: React.FC<{ user: NonNullable<ReturnType<typeof useAuth>['user']> }> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  // Safe fallback in case referralInfo wasn't migrated yet
  const ri = user.referralInfo ?? {
    referralCode: 'PATH-??????',
    referredCount: 0,
    credits: 0,
    freeMonthsEarned: 0,
  };
  const nextMilestone = REFERRAL_REWARDS.find(r => r.threshold > ri.referredCount);

  const copyCode = () => {
    navigator.clipboard.writeText(ri.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = nextMilestone
    ? (ri.referredCount / nextMilestone.threshold) * 100
    : 100;

  return (
    <div className="mem-referral-box">
      <div className="mem-referral-header">
        <div>
          <h3 className="mem-referral-title">🔗 Votre Code de Parrainage</h3>
          <p className="mem-referral-subtitle">Partagez votre code et gagnez des récompenses à chaque inscription</p>
        </div>
        {ri.credits > 0 && (
          <div className="mem-credit-badge">
            <span>💰</span>
            <span>{ri.credits} MAD de crédits</span>
          </div>
        )}
      </div>

      <div className="mem-referral-code-row">
        <div className="mem-referral-code">{ri.referralCode}</div>
        <button className={`mem-referral-copy ${copied ? 'mem-referral-copied' : ''}`} onClick={copyCode}>
          {copied ? '✓ Copié !' : '📋 Copier'}
        </button>
      </div>

      <div className="mem-referral-stats">
        <div className="mem-ref-stat">
          <span className="mem-ref-stat-val">{ri.referredCount}</span>
          <span className="mem-ref-stat-label">Parrainages</span>
        </div>
        <div className="mem-ref-stat">
          <span className="mem-ref-stat-val">{ri.credits} MAD</span>
          <span className="mem-ref-stat-label">Crédits gagnés</span>
        </div>
        <div className="mem-ref-stat">
          <span className="mem-ref-stat-val">{ri.freeMonthsEarned}</span>
          <span className="mem-ref-stat-label">Mois gratuits</span>
        </div>
      </div>

      {nextMilestone && (
        <div className="mem-referral-progress">
          <div className="mem-progress-label">
            <span>Prochain palier : <strong>{nextMilestone.icon} {nextMilestone.reward}</strong></span>
            <span>{ri.referredCount}/{nextMilestone.threshold} parrainages</span>
          </div>
          <div className="mem-progress-bar">
            <div className="mem-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mem-referral-milestones">
        {REFERRAL_REWARDS.map((r, i) => (
          <div key={i} className={`mem-milestone ${ri.referredCount >= r.threshold ? 'mem-milestone-done' : ''}`}>
            <span className="mem-milestone-icon">{r.icon}</span>
            <span className="mem-milestone-text">{r.threshold} parrainages → {r.reward}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
export const Membership: React.FC = () => {
  const { isAuthenticated, isPremium, user, setPendingLocally, getDiscount } = useAuth();

  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('INDIVIDUAL');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PlanVariant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const tierLabel: Record<string, string> = {
    FREE: 'Gratuit',
    COMMUNITY: 'Community',
    PROFESSIONAL: 'Professionnel',
    SENIOR: 'Senior / Recruteur',
  };

  const handleSelectPlan = async (plan: Plan, variant: PlanVariant) => {
    setSelectedPlan(plan);
    setSelectedVariant(variant);
    setTxRef(generateTxRef());
    setStep(1);
    setSubmitted(false);
    setReceiptFile(null);
    setReceiptPreview('');
    setPromoCode(user?.appliedPromoCode || '');
    const existingDiscount = user?.appliedPromoCode ? await getDiscount(user.appliedPromoCode) : 0;
    setPromoDiscount(existingDiscount);
    setPromoApplied(existingDiscount > 0);
    setShowModal(true);
  };

  const handleApplyPromo = async () => {
    const discount = await getDiscount(promoCode);
    if (discount > 0) {
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      setPromoDiscount(0);
      setPromoApplied(false);
      alert('Code invalide ou déjà utilisé.');
    }
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

  const handleSubmitReceipt = async () => {
    if (!receiptFile || !selectedPlan || !user) return;
    try {
      // Step 1: Initiate payment record on the server
      const initiateRes = await initiatePayment(user.id, selectedPlan.id);
      const paymentId = initiateRes.data.id;
      // Step 2: Upload receipt URL (we send the base64 preview as URL for now)
      await uploadReceipt(paymentId, user.id, receiptPreview);
      // Step 3: Mark user as PENDING locally (not PREMIUM — admin must approve)
      setPendingLocally(selectedPlan.tierId);
    } catch {
      // Even if API fails, mark locally as pending so UX doesn't break
      setPendingLocally(selectedPlan.tierId);
    }
    setSubmitted(true);
    setStep(3);
  };

  const finalPrice = selectedVariant
    ? Math.round(selectedVariant.price * (1 - promoDiscount / 100))
    : 0;

  return (
    <Layout>
      {/* ── Hero ── */}
      <div className="page-hero membership-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Nos Forfaits d'Adhésion</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">
            {isPremium
              ? `★ Membre ${tierLabel[user?.membershipTier || 'FREE']} — Profitez de tous vos avantages !`
              : 'Rejoignez la communauté des professionnels RH leaders au Maroc'
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
              <strong>{user.name}</strong> — Statut : <strong>{tierLabel[user.membershipTier]}</strong>
              {user.referralInfo?.credits > 0 && (
                <span className="status-credits"> · 💰 {user.referralInfo.credits} MAD de crédits disponibles</span>
              )}
            </div>
          </div>
        )}

        {/* ── Account Type Toggle ── */}
        <div className="mem-account-toggle-section">
          <p className="mem-toggle-label">Vous êtes :</p>
          <div className="mem-account-toggle">
            <button
              className={`mem-toggle-btn ${selectedAccountType === 'INDIVIDUAL' ? 'active' : ''}`}
              onClick={() => setSelectedAccountType('INDIVIDUAL')}
            >
              👤 Particulier / Individuel
            </button>
            <button
              className={`mem-toggle-btn ${selectedAccountType === 'COMPANY' ? 'active' : ''}`}
              onClick={() => setSelectedAccountType('COMPANY')}
            >
              🏢 Entreprise
            </button>
          </div>
        </div>

        {/* ── Plans Grid ── */}
        <div className="mem-plans-grid">
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selectedAccountType={selectedAccountType}
              onSelect={handleSelectPlan}
              currentTier={user?.membershipTier}
            />
          ))}
        </div>

        {/* ── Referral Dashboard ── */}
        {isAuthenticated && user && (
          <ReferralDashboard user={user} />
        )}

        {/* ── Referral Explanation (not logged in) ── */}
        {!isAuthenticated && (
          <div className="mem-promo-info">
            <h3>🎁 Programme de Parrainage PATH</h3>
            <p>Inscrivez-vous avec le code d'un membre et bénéficiez de <strong>10% de réduction</strong> sur votre premier abonnement. Le parrain reçoit <strong>250 MAD de crédits</strong> à chaque parrainage réussi.</p>
          </div>
        )}
      </div>

      {/* ── Payment Modal ── */}
      {showModal && selectedPlan && selectedVariant && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card animate-scaleIn mem-modal" onClick={e => e.stopPropagation()}>

            {/* Steps indicator */}
            <div className="modal-steps">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div className={`step-dot ${step >= s ? 'step-dot--active' : ''}`}>{s}</div>
                  {s < 3 && <div className="step-line" />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Payment details + promo */}
            {step === 1 && (
              <div className="modal-step-content">
                <h2>🏦 Détails du Virement</h2>
                <p className="modal-plan-info">
                  {selectedPlan.name} — {selectedPlan.icon}
                  <span className="mem-modal-account-type"> ({selectedAccountType === 'INDIVIDUAL' ? 'Individuel' : 'Entreprise'})</span>
                </p>

                {/* Promo code section */}
                <div className="mem-promo-section">
                  <label>🏷️ Code promo / parrainage</label>
                  <div className="mem-promo-row">
                    <input
                      type="text"
                      placeholder="Ex: PATH-XXXXXX"
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false); }}
                      className="mem-promo-input"
                      disabled={promoApplied}
                    />
                    {!promoApplied ? (
                      <button className="mem-promo-apply-btn" onClick={handleApplyPromo}>Appliquer</button>
                    ) : (
                      <span className="mem-promo-success">✓ -{promoDiscount}%</span>
                    )}
                  </div>
                  {promoApplied && (
                    <div className="mem-promo-applied">
                      🎉 Réduction de {promoDiscount}% appliquée !
                    </div>
                  )}
                </div>

                {/* Price summary */}
                <div className="mem-price-summary">
                  <div className="mem-price-row">
                    <span>Prix de base</span>
                    <span>{selectedVariant.price.toLocaleString('fr-MA')} MAD</span>
                  </div>
                  {promoApplied && (
                    <div className="mem-price-row mem-price-discount">
                      <span>Réduction ({promoDiscount}%)</span>
                      <span>-{(selectedVariant.price * promoDiscount / 100).toLocaleString('fr-MA')} MAD</span>
                    </div>
                  )}
                  <div className="mem-price-row mem-price-total">
                    <span>Total à payer</span>
                    <span className="mem-total-amount">{finalPrice.toLocaleString('fr-MA')} MAD</span>
                  </div>
                </div>

                <div className="rib-details">
                  <div className="rib-row"><span>Bénéficiaire</span><strong>P@TH Morocco SARL</strong></div>
                  <div className="rib-row"><span>Banque</span><strong>Attijariwafa Bank</strong></div>
                  <div className="rib-row"><span>IBAN</span><strong>MA64 0000 0000 0000 0000 0000</strong></div>
                  <div className="rib-row"><span>SWIFT/BIC</span><strong>BCMAMAMC</strong></div>
                </div>

                <div className="tx-ref-box">
                  <label>📌 Référence de Transaction (obligatoire)</label>
                  <div className="tx-ref-value">{txRef}</div>
                  <p className="tx-ref-note">⚠️ Indiquez cette référence dans les notes de votre virement bancaire</p>
                </div>

                <button className="modal-next-btn" onClick={() => setStep(2)}>Continuer → Preuve de paiement</button>
              </div>
            )}

            {/* Step 2: Upload receipt */}
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
                      <input id="receipt-input" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="upload-hidden-input" />
                    </label>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="modal-back-btn" onClick={() => setStep(1)}>← Retour</button>
                  <button className="modal-submit-btn" onClick={handleSubmitReceipt} disabled={!receiptFile}>
                    Soumettre la preuve
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && submitted && (
              <div className="modal-step-content modal-success">
                <div className="success-icon">✅</div>
                <h2>Demande Soumise !</h2>
                <p>Votre preuve de paiement a été envoyée avec succès.</p>
                <div className="success-details">
                  <div className="success-row"><span>Référence</span><strong>{txRef}</strong></div>
                  <div className="success-row"><span>Plan</span><strong>{selectedPlan.name}</strong></div>
                  <div className="success-row"><span>Montant</span><strong>{finalPrice.toLocaleString('fr-MA')} MAD</strong></div>
                  <div className="success-row"><span>Statut</span><strong className="status-pending">⏳ En attente d'approbation</strong></div>
                </div>
                <p className="success-note">Notre équipe vérifiera votre paiement sous 24–48h. Vous recevrez une notification une fois approuvé.</p>
                {isAuthenticated && user && (
                  <div className="mem-success-referral">
                    <p>🔗 <strong>Partagez votre code</strong> pour gagner des crédits !</p>
                    <div className="mem-success-code">{user.referralInfo?.referralCode}</div>
                  </div>
                )}
                <button className="modal-close-btn" onClick={() => setShowModal(false)}>Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Meetup Pay-as-you-go CTA (Community members) ── */}
      {user?.membershipTier === 'COMMUNITY' && (
        <div className="container">
          <div className="mem-meetup-cta">
            <div className="mem-meetup-cta-left">
              <h3>🎟️ Participer à un Meetup</h3>
              <p>En tant que membre Community, chaque participation aux meetups PATH est disponible à 400 dh par session.</p>
            </div>
            <button className="mem-meetup-pay-btn" onClick={() => alert('Paiement meetup — fonctionnalité à venir')}>
              Réserver ma place — 400 dh
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};
