import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import './TextesLoi.css';

// ── Data: Structure of the Moroccan Labour Code (Loi 65-99)
// Source: Official Moroccan Labour Code structure
const CODE_TRAVAIL = [
  {
    id: 'livre1',
    label: 'Livre I',
    title: 'Relations Individuelles de Travail',
    titres: [
      {
        id: 't1',
        label: 'Titre I',
        name: 'Dispositions générales',
        articles: [
          { num: 'Art. 1', title: 'Champ d\'application du Code du Travail' },
          { num: 'Art. 2', title: 'Définition du salarié' },
          { num: 'Art. 3', title: 'Définition de l\'employeur' },
          { num: 'Art. 4', title: 'Égalité de traitement et non-discrimination' },
          { num: 'Art. 5', title: 'Interdiction du travail forcé' },
          { num: 'Art. 6', title: 'Interdiction du harcèlement moral et sexuel' },
        ],
      },
      {
        id: 't2',
        label: 'Titre II',
        name: 'Contrat de travail',
        articles: [
          { num: 'Art. 16', title: 'Définition du contrat de travail' },
          { num: 'Art. 17', title: 'Contrat à durée indéterminée (CDI)' },
          { num: 'Art. 18', title: 'Contrat à durée déterminée (CDD)' },
          { num: 'Art. 19', title: 'Conditions de validité du CDD' },
          { num: 'Art. 20', title: 'Période d\'essai' },
          { num: 'Art. 21-22', title: 'Durée de la période d\'essai selon le poste' },
          { num: 'Art. 25', title: 'Contrat de travail à temps partiel' },
          { num: 'Art. 33', title: 'Transfert du contrat de travail' },
        ],
      },
      {
        id: 't3',
        label: 'Titre III',
        name: 'Durée du travail',
        articles: [
          { num: 'Art. 184', title: 'Durée normale de travail (2 244 h/an)' },
          { num: 'Art. 185', title: 'Répartition de la durée du travail' },
          { num: 'Art. 196', title: 'Heures supplémentaires' },
          { num: 'Art. 201', title: 'Repos hebdomadaire obligatoire' },
          { num: 'Art. 205', title: 'Jours fériés et chômés' },
          { num: 'Art. 206', title: 'Congés annuels payés' },
          { num: 'Art. 207', title: 'Durée des congés annuels' },
          { num: 'Art. 271', title: 'Travail de nuit' },
        ],
      },
      {
        id: 't4',
        label: 'Titre IV',
        name: 'Salaire',
        articles: [
          { num: 'Art. 345', title: 'Liberté de fixation du salaire' },
          { num: 'Art. 356', title: 'SMIG – Salaire minimum interprofessionnel garanti' },
          { num: 'Art. 357', title: 'SMAG – Salaire minimum agricole garanti' },
          { num: 'Art. 360', title: 'Modalités de paiement du salaire' },
          { num: 'Art. 367', title: 'Bulletin de paie obligatoire' },
          { num: 'Art. 373', title: 'Prescription des créances salariales' },
        ],
      },
      {
        id: 't5',
        label: 'Titre V',
        name: 'Rupture du contrat de travail',
        articles: [
          { num: 'Art. 34', title: 'Causes de rupture du contrat de travail' },
          { num: 'Art. 35-36', title: 'Procédure de licenciement pour faute grave' },
          { num: 'Art. 37', title: 'Délai de préavis' },
          { num: 'Art. 41', title: 'Indemnité de licenciement' },
          { num: 'Art. 43', title: 'Indemnité compensatrice de congés payés' },
          { num: 'Art. 44', title: 'Certificat de travail obligatoire' },
          { num: 'Art. 62', title: 'Licenciement abusif – sanctions' },
          { num: 'Art. 66-71', title: 'Licenciement pour motifs économiques' },
        ],
      },
    ],
  },
  {
    id: 'livre2',
    label: 'Livre II',
    title: 'Relations Collectives de Travail',
    titres: [
      {
        id: 't6',
        label: 'Titre I',
        name: 'Syndicats professionnels',
        articles: [
          { num: 'Art. 396', title: 'Liberté syndicale' },
          { num: 'Art. 397', title: 'Constitution des syndicats' },
          { num: 'Art. 398', title: 'Personnalité morale des syndicats' },
          { num: 'Art. 406', title: 'Représentativité syndicale' },
          { num: 'Art. 416', title: 'Délégués syndicaux dans l\'entreprise' },
        ],
      },
      {
        id: 't7',
        label: 'Titre II',
        name: 'Délégués des salariés',
        articles: [
          { num: 'Art. 430', title: 'Obligation d\'élire des délégués du personnel' },
          { num: 'Art. 431', title: 'Conditions pour élire des délégués (10+ salariés)' },
          { num: 'Art. 434', title: 'Éligibilité des délégués du personnel' },
          { num: 'Art. 458', title: 'Attribution et rôle des délégués' },
          { num: 'Art. 459', title: 'Heures de délégation' },
          { num: 'Art. 462', title: 'Protection des délégués du personnel' },
        ],
      },
      {
        id: 't8',
        label: 'Titre III',
        name: 'Conventions collectives de travail',
        articles: [
          { num: 'Art. 104', title: 'Définition de la convention collective' },
          { num: 'Art. 105', title: 'Parties à la convention collective' },
          { num: 'Art. 106', title: 'Contenu de la convention collective' },
          { num: 'Art. 108', title: 'Dépôt et publicité' },
          { num: 'Art. 115', title: 'Extension et élargissement' },
        ],
      },
      {
        id: 't9',
        label: 'Titre IV',
        name: 'Grève et lock-out',
        articles: [
          { num: 'Art. 492', title: 'Droit de grève constitutionnel' },
          { num: 'Art. 493', title: 'Procédure préalable à la grève' },
          { num: 'Art. 496', title: 'Préavis de grève (10 jours)' },
          { num: 'Art. 497', title: 'Services essentiels et service minimum' },
          { num: 'Art. 503', title: 'Lock-out – conditions et procédure' },
        ],
      },
    ],
  },
  {
    id: 'livre3',
    label: 'Livre III',
    title: 'Représentation et Négociation Collective',
    titres: [
      {
        id: 't10',
        label: 'Titre I',
        name: 'Comité d\'entreprise',
        articles: [
          { num: 'Art. 464', title: 'Obligation de créer un comité d\'entreprise (50+ salariés)' },
          { num: 'Art. 465', title: 'Composition du comité d\'entreprise' },
          { num: 'Art. 467', title: 'Réunions du comité d\'entreprise' },
          { num: 'Art. 468', title: 'Attributions économiques et sociales' },
        ],
      },
      {
        id: 't11',
        label: 'Titre II',
        name: 'Inspection du travail',
        articles: [
          { num: 'Art. 530', title: 'Mission de l\'inspection du travail' },
          { num: 'Art. 531', title: 'Pouvoirs des inspecteurs du travail' },
          { num: 'Art. 534', title: 'Obligation de secret professionnel' },
          { num: 'Art. 543', title: 'Procès-verbaux d\'infraction' },
        ],
      },
    ],
  },
  {
    id: 'livre4',
    label: 'Livre IV',
    title: 'Hygiène, Sécurité et Santé au Travail',
    titres: [
      {
        id: 't12',
        label: 'Titre I',
        name: 'Obligations générales de l\'employeur',
        articles: [
          { num: 'Art. 281', title: 'Obligation générale de sécurité de l\'employeur' },
          { num: 'Art. 282', title: 'Aménagement des locaux de travail' },
          { num: 'Art. 286', title: 'Éclairage, ventilation, chauffage' },
          { num: 'Art. 295', title: 'Équipements de protection individuelle (EPI)' },
          { num: 'Art. 296', title: 'Visite médicale d\'embauche' },
          { num: 'Art. 304', title: 'Médecine du travail obligatoire' },
          { num: 'Art. 326', title: 'Comité d\'hygiène et sécurité (CHST)' },
        ],
      },
      {
        id: 't13',
        label: 'Titre II',
        name: 'Accidents du travail et maladies professionnelles',
        articles: [
          { num: 'Art. 332', title: 'Définition de l\'accident du travail' },
          { num: 'Art. 333', title: 'Déclaration obligatoire à l\'CNSS' },
          { num: 'Art. 339', title: 'Maladies professionnelles reconnues' },
          { num: 'Art. 340', title: 'Réparation et indemnisation' },
        ],
      },
    ],
  },
  {
    id: 'livre5',
    label: 'Livre V',
    title: 'Travail de Certaines Catégories',
    titres: [
      {
        id: 't14',
        label: 'Titre I',
        name: 'Travail des femmes',
        articles: [
          { num: 'Art. 179', title: 'Interdiction de la discrimination à l\'embauche' },
          { num: 'Art. 152', title: 'Congé de maternité (14 semaines)' },
          { num: 'Art. 153', title: 'Congé d\'allaitement' },
          { num: 'Art. 157', title: 'Interdiction de licencier pour grossesse' },
        ],
      },
      {
        id: 't15',
        label: 'Titre II',
        name: 'Travail des mineurs',
        articles: [
          { num: 'Art. 143', title: 'Âge minimum d\'embauche (15 ans)' },
          { num: 'Art. 144', title: 'Travaux interdits aux mineurs' },
          { num: 'Art. 147', title: 'Durée du travail des mineurs réduite' },
          { num: 'Art. 148', title: 'Visite médicale obligatoire des mineurs' },
        ],
      },
      {
        id: 't16',
        label: 'Titre III',
        name: 'Travail des personnes en situation de handicap',
        articles: [
          { num: 'Art. 175', title: 'Obligation d\'emploi des travailleurs handicapés' },
          { num: 'Art. 176', title: 'Aménagement des postes de travail' },
          { num: 'Art. 177', title: 'Interdiction de discriminer en raison du handicap' },
        ],
      },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────

const BookSection: React.FC<{ book: typeof CODE_TRAVAIL[0] }> = ({ book }) => {
  const [open, setOpen] = useState(false);
  const [openTitres, setOpenTitres] = useState<Set<string>>(new Set());
  const [selectedArticle, setSelectedArticle] = useState<{num: string, title: string, content: string} | null>(null);
  const [articleData, setArticleData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/data/code_travail_articles.json')
      .then(res => res.json())
      .then(data => setArticleData(data))
      .catch(err => console.error("Failed to load article data", err));
  }, []);

  const toggleTitre = (id: string) => {
    setOpenTitres(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleArticleClick = (art: {num: string, title: string}) => {
    let content = articleData[art.num];
    if (!content && art.num.includes('-')) {
      const match = art.num.match(/Art\.\s+(\d+)-(\d+)/);
      if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        let combined = [];
        for (let i = start; i <= end; i++) {
          if (articleData[`Art. ${i}`]) {
            combined.push(`Article ${i}:\n${articleData[`Art. ${i}`]}`);
          }
        }
        if (combined.length > 0) {
          content = combined.join('\n\n');
        }
      }
    }
    content = content || "Texte non disponible pour cet article.";
    setSelectedArticle({ ...art, content });
  };

  return (
    <>
      <div className="loi-book">
        <div className="loi-book-header" onClick={() => setOpen(!open)}>
          <div className="loi-book-header-left">
            <span className="loi-book-label">{book.label}</span>
            <h3 className="loi-book-title">{book.title}</h3>
          </div>
          <span className={`loi-book-chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
        {open && (
          <div className="loi-book-body">
            {book.titres.map(titre => (
              <div key={titre.id} className="loi-titre">
                <div className="loi-titre-header" onClick={() => toggleTitre(titre.id)}>
                  <span className="loi-titre-label">{titre.label}</span>
                  <span className="loi-titre-name">{titre.name}</span>
                  <span className={`loi-titre-chevron ${openTitres.has(titre.id) ? 'open' : ''}`}>▾</span>
                </div>
                {openTitres.has(titre.id) && (
                  <div className="loi-articles-list">
                    {titre.articles.map(art => (
                      <div key={art.num} className="loi-article-item" onClick={() => handleArticleClick(art)}>
                        <span className="loi-article-num">{art.num}</span>
                        <span className="loi-article-title">{art.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedArticle && (
        <div className="loi-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="loi-modal-content" onClick={e => e.stopPropagation()}>
            <div className="loi-modal-header">
              <h3>{selectedArticle.num}</h3>
              <button className="loi-modal-close" onClick={() => setSelectedArticle(null)}>✕</button>
            </div>
            <div className="loi-modal-body">
              <h4 style={{ color: '#7B2D8E', marginBottom: 16 }}>{selectedArticle.title}</h4>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#374151' }}>
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CodeTravailPage: React.FC = () => {
  const themes = [
    { icon: '📋', title: 'Contrats de travail (CDI, CDD, temps partiel)' },
    { icon: '⏰', title: 'Durée du travail et heures supplémentaires' },
    { icon: '💰', title: 'Salaire, SMIG et modalités de paiement' },
    { icon: '🚪', title: 'Rupture du contrat et procédures de licenciement' },
    { icon: '🤝', title: 'Relations collectives et syndicats' },
    { icon: '🛡️', title: 'Hygiène, sécurité et médecine du travail' },
    { icon: '👶', title: 'Travail des femmes et protection de la maternité' },
    { icon: '⚖️', title: 'Inspection du travail et résolution des litiges' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="loi-hero">
        <div className="container">
          <span className="loi-badge">⚖️ Législation</span>
          <h1 className="animate-fadeInUp">Code du Travail Marocain</h1>
          <p className="loi-hero-sub animate-fadeInUp delay-1">
            Loi n° 65-99 – Structure complète et articles clés du Code du Travail en vigueur au Maroc.
          </p>
        </div>
      </div>

      <div className="loi-container">
        {/* Sidebar */}
        <aside className="loi-sidebar">
          <p className="loi-sidebar-title">Sommaire</p>
          {CODE_TRAVAIL.map(book => (
            <a
              key={book.id}
              className="loi-sidebar-link"
              onClick={() => document.getElementById(book.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="loi-sidebar-dot" />
              {book.label} – {book.title}
            </a>
          ))}
        </aside>

        {/* Main */}
        <main className="loi-main">
          {/* Stats */}
          <div className="loi-stats">
            <div className="loi-stat-card">
              <div className="loi-stat-val">5</div>
              <div className="loi-stat-label">Livres</div>
            </div>
            <div className="loi-stat-card">
              <div className="loi-stat-val">589</div>
              <div className="loi-stat-label">Articles</div>
            </div>
            <div className="loi-stat-card">
              <div className="loi-stat-val">2004</div>
              <div className="loi-stat-label">Année d'entrée en vigueur</div>
            </div>
          </div>

          {/* Intro */}
          <div className="loi-intro-card">
            <h2>📌 À propos de la Loi 65-99</h2>
            <p>
              Le Code du Travail marocain (Loi n° 65-99) est entré en vigueur en juin 2004. Il constitue le socle
              du droit du travail au Maroc en réglementant les relations entre employeurs et salariés, les conditions
              de travail, la rémunération, les droits collectifs et les mécanismes de résolution des conflits. Il
              s'applique à l'ensemble des salariés du secteur privé à l'exclusion du secteur agricole (régi par
              des dispositions spécifiques) et de la fonction publique.
            </p>
            <p className="loi-note">
              Cliquez sur chaque Livre pour dérouler les titres et articles correspondants.
            </p>
          </div>

          {/* Thèmes */}
          <div>
            <p style={{ fontWeight: 700, color: '#1a0a2e', marginBottom: 14, fontSize: 15 }}>
              🗂️ Principaux thèmes couverts
            </p>
            <div className="loi-themes-grid">
              {themes.map((t, i) => (
                <div key={i} className="loi-theme-card">
                  <span className="loi-theme-icon">{t.icon}</span>
                  <span className="loi-theme-title">{t.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Books */}
          {CODE_TRAVAIL.map(book => (
            <div key={book.id} id={book.id}>
              <BookSection book={book} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};
