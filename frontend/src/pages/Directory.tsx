import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Search, MapPin, Briefcase, Star } from 'lucide-react';
import './Directory.css';

// ─── Types ──────────────────────────────────────────────────
type MemberTier = 'COMMUNITY' | 'PROFESSIONAL' | 'SENIOR';

interface DirectoryMember {
  id: number;
  name: string;
  title: string;
  company: string;
  city: string;
  tier: MemberTier;
  expertise: string[];
  initials: string;
  gradientIndex: number;
  featured?: boolean;
}

// ─── Static member data (realistic, anonymized) ─────────────
const MEMBERS: DirectoryMember[] = [
  // Senior members (featured)
  { id: 1, name: 'Fatima Zahra E.', title: 'Directrice des Ressources Humaines', company: 'Attijariwafa Bank', city: 'Casablanca', tier: 'SENIOR', expertise: ['Transformation RH', 'Leadership', 'Benchmark'], initials: 'FZ', gradientIndex: 0, featured: true },
  { id: 2, name: 'Youssef B.', title: 'VP People & Culture', company: 'OCP Group', city: 'Casablanca', tier: 'SENIOR', expertise: ['Culture d\'entreprise', 'Talent Management', 'QVT'], initials: 'YB', gradientIndex: 1, featured: true },
  { id: 3, name: 'Amina K.', title: 'DRH & Fondatrice', company: 'Cabinet RH Excellence', city: 'Rabat', tier: 'SENIOR', expertise: ['Conseil RH', 'Droit du Travail', 'Formation'], initials: 'AK', gradientIndex: 2, featured: true },
  { id: 4, name: 'Karim M.', title: 'Directeur Talent Acquisition', company: 'Maroc Telecom', city: 'Rabat', tier: 'SENIOR', expertise: ['Recrutement', 'Employer Branding', 'Assessment'], initials: 'KM', gradientIndex: 3, featured: true },
  // Professional members
  { id: 5, name: 'Sara B.', title: 'Responsable RH', company: 'CIH Bank', city: 'Casablanca', tier: 'PROFESSIONAL', expertise: ['GPEC', 'Paie', 'Relations Sociales'], initials: 'SB', gradientIndex: 4 },
  { id: 6, name: 'Mohamed A.', title: 'HR Business Partner', company: 'Lafarge Holcim Maroc', city: 'Casablanca', tier: 'PROFESSIONAL', expertise: ['HRBP', 'Performance', 'Learning & Dev'], initials: 'MA', gradientIndex: 5 },
  { id: 7, name: 'Nadia R.', title: 'Chargée de Formation', company: 'BMCE Bank', city: 'Casablanca', tier: 'PROFESSIONAL', expertise: ['Ingénierie Formation', 'E-learning', 'SIRH'], initials: 'NR', gradientIndex: 6 },
  { id: 8, name: 'Khalid S.', title: 'Responsable Recrutement', company: 'Lydec', city: 'Casablanca', tier: 'PROFESSIONAL', expertise: ['Sourcing', 'Assessment Center', 'Onboarding'], initials: 'KS', gradientIndex: 7 },
  { id: 9, name: 'Houda T.', title: 'Manager Paie & Admin RH', company: 'Sonasid', city: 'Nador', tier: 'PROFESSIONAL', expertise: ['Paie', 'CNSS', 'AMO', 'Contrats'], initials: 'HT', gradientIndex: 8 },
  { id: 10, name: 'Anas F.', title: 'DRH Adjoint', company: 'Renault Maroc', city: 'Casablanca', tier: 'PROFESSIONAL', expertise: ['Transformation', 'NPS', 'Dialogue Social'], initials: 'AF', gradientIndex: 9 },
  // Community members
  { id: 11, name: 'Imane L.', title: 'Assistante RH', company: 'Startup Fintech', city: 'Casablanca', tier: 'COMMUNITY', expertise: ['Administration RH', 'Excel RH', 'Recrutement'], initials: 'IL', gradientIndex: 10 },
  { id: 12, name: 'Rachid O.', title: 'Étudiant MBA RH', company: 'ISCAE', city: 'Casablanca', tier: 'COMMUNITY', expertise: ['Droit Social', 'Stratégie RH'], initials: 'RO', gradientIndex: 11 },
  { id: 13, name: 'Salma D.', title: 'Chargée RH', company: 'Entreprise Industrielle', city: 'Fès', tier: 'COMMUNITY', expertise: ['Paie', 'Gestion des Absences'], initials: 'SD', gradientIndex: 12 },
  { id: 14, name: 'Mehdi C.', title: 'HR Consultant', company: 'Freelance', city: 'Marrakech', tier: 'COMMUNITY', expertise: ['Audit RH', 'Conseil PME'], initials: 'MC', gradientIndex: 13 },
  { id: 15, name: 'Zineb H.', title: 'Recruteuse', company: 'Cabinet de Recrutement', city: 'Casablanca', tier: 'COMMUNITY', expertise: ['Chasse de têtes', 'LinkedIn Recruiting'], initials: 'ZH', gradientIndex: 14 },
];

const GRADIENTS = [
  'linear-gradient(135deg, #7B2D8E, #00B4A6)',
  'linear-gradient(135deg, #d97706, #7B2D8E)',
  'linear-gradient(135deg, #00B4A6, #2563eb)',
  'linear-gradient(135deg, #dc2626, #7B2D8E)',
  'linear-gradient(135deg, #059669, #00B4A6)',
  'linear-gradient(135deg, #7c3aed, #00B4A6)',
  'linear-gradient(135deg, #0891b2, #7B2D8E)',
  'linear-gradient(135deg, #b45309, #00B4A6)',
  'linear-gradient(135deg, #4f46e5, #7B2D8E)',
  'linear-gradient(135deg, #0f766e, #7B2D8E)',
  'linear-gradient(135deg, #6b7280, #374151)',
  'linear-gradient(135deg, #374151, #6b7280)',
  'linear-gradient(135deg, #78350f, #6b7280)',
  'linear-gradient(135deg, #1e40af, #6b7280)',
  'linear-gradient(135deg, #065f46, #6b7280)',
];

const TIER_CONFIG: Record<MemberTier, { label: string; color: string; bg: string; border: string; icon: string }> = {
  SENIOR:       { label: 'Senior', color: '#92400e', bg: '#fef3c7', border: '#fcd34d', icon: '👑' },
  PROFESSIONAL: { label: 'Professionnel', color: '#7B2D8E', bg: '#f5f0ff', border: '#d0aff0', icon: '🎯' },
  COMMUNITY:    { label: 'Community', color: '#0f766e', bg: '#f0fdfa', border: '#a7f3d0', icon: '🤝' },
};

const CITIES = ['Toutes les villes', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Nador'];
const TIERS: Array<'ALL' | MemberTier> = ['ALL', 'SENIOR', 'PROFESSIONAL', 'COMMUNITY'];

// ─── Member Card ────────────────────────────────────────────
const MemberCard: React.FC<{ member: DirectoryMember }> = ({ member }) => {
  const tier = TIER_CONFIG[member.tier];
  const gradient = GRADIENTS[member.gradientIndex % GRADIENTS.length];

  return (
    <div className={`dir-card ${member.featured ? 'dir-card--featured' : ''}`}>
      {member.featured && (
        <div className="dir-card-featured-ribbon">
          <Star size={11} fill="currentColor" /> Featured
        </div>
      )}

      <div className="dir-card-header">
        <div className="dir-avatar" style={{ background: gradient }}>
          {member.initials}
        </div>
        <div className="dir-card-id">
          <h3 className="dir-name">{member.name}</h3>
          <p className="dir-title">{member.title}</p>
        </div>
      </div>

      <div className="dir-card-meta">
        <span className="dir-meta-item">
          <Briefcase size={12} /> {member.company}
        </span>
        <span className="dir-meta-item">
          <MapPin size={12} /> {member.city}
        </span>
      </div>

      <div className="dir-expertise">
        {member.expertise.map((e, i) => (
          <span key={i} className="dir-expertise-chip">{e}</span>
        ))}
      </div>

      <div className="dir-card-footer">
        <span className="dir-tier-badge" style={{ background: tier.bg, color: tier.color, borderColor: tier.border }}>
          {tier.icon} {tier.label}
        </span>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────
export const Directory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes les villes');
  const [tierFilter, setTierFilter] = useState<'ALL' | MemberTier>('ALL');

  const filtered = MEMBERS.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q)
      || m.title.toLowerCase().includes(q)
      || m.company.toLowerCase().includes(q)
      || m.expertise.some(e => e.toLowerCase().includes(q));
    const matchCity = cityFilter === 'Toutes les villes' || m.city === cityFilter;
    const matchTier = tierFilter === 'ALL' || m.tier === tierFilter;
    return matchSearch && matchCity && matchTier;
  });

  const featured = filtered.filter(m => m.featured);
  const regular = filtered.filter(m => !m.featured);

  const totalByTier = (t: MemberTier) => MEMBERS.filter(m => m.tier === t).length;

  return (
    <Layout>
      {/* ── Hero ── */}
      <div className="page-hero dir-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">👥 Annuaire des Membres</h1>
          <p className="page-hero-sub animate-fadeInUp delay-1">
            Connectez-vous avec les professionnels RH du réseau PATH Maroc.
          </p>
          {/* Stats bar */}
          <div className="dir-stats-bar animate-fadeInUp delay-2">
            <div className="dir-stat">
              <strong>{MEMBERS.length}</strong><span>Membres</span>
            </div>
            <div className="dir-stat-sep" />
            <div className="dir-stat">
              <strong>{totalByTier('SENIOR')}</strong><span>Senior 👑</span>
            </div>
            <div className="dir-stat-sep" />
            <div className="dir-stat">
              <strong>{totalByTier('PROFESSIONAL')}</strong><span>Professionnel 🎯</span>
            </div>
            <div className="dir-stat-sep" />
            <div className="dir-stat">
              <strong>{totalByTier('COMMUNITY')}</strong><span>Community 🤝</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container dir-container">
        {/* ── Filters ── */}
        <div className="dir-filters">
          {/* Search */}
          <div className="dir-search-wrap">
            <Search size={16} className="dir-search-icon" />
            <input
              type="text"
              className="dir-search"
              placeholder="Rechercher par nom, titre, entreprise, expertise..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* City filter */}
          <select className="dir-select" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Tier filter */}
          <div className="dir-tier-tabs">
            {TIERS.map(t => (
              <button
                key={t}
                className={`dir-tier-tab ${tierFilter === t ? 'active' : ''}`}
                onClick={() => setTierFilter(t)}
              >
                {t === 'ALL' ? `Tous (${MEMBERS.length})`
                  : `${TIER_CONFIG[t].icon} ${TIER_CONFIG[t].label} (${totalByTier(t)})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Featured Senior Members ── */}
        {featured.length > 0 && (
          <section className="dir-section">
            <div className="dir-section-header">
              <h2 className="dir-section-title">👑 Membres Senior — En Avant</h2>
              <p className="dir-section-sub">Experts RH avec droits éditoriaux et accès complet à la plateforme</p>
            </div>
            <div className="dir-grid dir-grid--featured">
              {featured.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}

        {/* ── All Other Members ── */}
        {regular.length > 0 && (
          <section className="dir-section">
            {featured.length > 0 && (
              <div className="dir-section-header">
                <h2 className="dir-section-title">🌟 Autres Membres du Réseau</h2>
              </div>
            )}
            <div className="dir-grid">
              {regular.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="dir-empty">
            <span>🔍</span>
            <h3>Aucun membre trouvé</h3>
            <p>Essayez de modifier vos filtres ou votre recherche.</p>
            <button onClick={() => { setSearch(''); setCityFilter('Toutes les villes'); setTierFilter('ALL'); }}>
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* ── Join CTA ── */}
        <div className="dir-join-cta">
          <div className="dir-join-cta-inner">
            <h3>Vous n'êtes pas encore membre PATH ?</h3>
            <p>Rejoignez la communauté des professionnels RH leaders au Maroc et apparaissez dans cet annuaire.</p>
            <a href="/membership" className="dir-join-btn">Voir les offres d'adhésion →</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
