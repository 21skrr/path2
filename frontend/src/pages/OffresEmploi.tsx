import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { JobSearchFilters, SearchFilters } from '../components/JobSearchFilters';
import './OffresEmploi.css';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Persisted job listing (from /api/job-listings — scheduled fetch) */
interface JobListing {
  externalId: string;
  title: string;
  company: string;
  location: string | null;
  applyUrl: string | null;
  sourceType: string;
  fetchedAt: string;
}

/** Live search result (from /api/search — user-triggered) */
interface JobDTO {
  id: string;
  title: string;
  company: string;
  location: string | null;
  applyUrl: string | null;
  sourceType: string;
  salary: string | null;
  datePosted: string | null;
}

const BASE = 'http://localhost:8080';

// ── Card sub-component (reusable) ─────────────────────────────────────────────

const JobCard: React.FC<{
  id: string;
  title: string;
  company: string;
  location: string | null;
  applyUrl: string | null;
  badge: string;
  meta: string;
  salary?: string | null;
}> = ({ id, title, company, location, applyUrl, badge, meta, salary }) => (
  <div className="oe-card" key={id}>
    <div className="oe-card-header">
      <div className="oe-card-logo">{(company || '?').charAt(0).toUpperCase()}</div>
      <div className="oe-card-meta">
        <span className="oe-card-company">{company}</span>
        {location && (
          <span className="oe-card-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {location}
          </span>
        )}
        {salary && (
          <span className="oe-card-salary">💰 {salary}</span>
        )}
      </div>
      <span className="oe-card-badge">{badge}</span>
    </div>
    <h2 className="oe-card-title">{title}</h2>
    <div className="oe-card-footer">
      <span className="oe-card-date">{meta}</span>
      {applyUrl ? (
        <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="oe-card-apply">
          Postuler →
        </a>
      ) : (
        <span className="oe-card-apply oe-card-apply--disabled">Non disponible</span>
      )}
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export const OffresEmploi: React.FC = () => {

  // ── Saved jobs (scheduled fetch) ──────────────────────────────────────────
  const [savedJobs, setSavedJobs]       = useState<JobListing[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError]     = useState<string | null>(null);

  // ── Live search ────────────────────────────────────────────────────────────
  const [searchResults, setSearchResults]       = useState<JobDTO[] | null>(null);
  const [searchLoading, setSearchLoading]       = useState(false);
  const [searchError, setSearchError]           = useState<string | null>(null);
  const [searchOffset, setSearchOffset]         = useState(0);
  const [hasMore, setHasMore]                   = useState(false);
  const [loadingMore, setLoadingMore]           = useState(false);
  const PAGE_SIZE = 100;

  // ── Filters state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<SearchFilters>({
    location: 'Morocco',
    hasSalary: false,
    timeFrame: 'month',
  });

  // ── Text search within saved jobs ─────────────────────────────────────────
  const [textSearch, setTextSearch] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Load persisted jobs on mount ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE}/api/job-listings`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d: JobListing[]) => { setSavedJobs(d); setSavedLoading(false); })
      .catch(e  => { setSavedError(e.message);  setSavedLoading(false); });
  }, []);

  // ── Live search handler ────────────────────────────────────────────────────
  const doSearch = (newOffset: number, append: boolean) => {
    if (append) setLoadingMore(true); else setSearchLoading(true);
    setSearchError(null);

    const params = new URLSearchParams({
      location:  filters.location || 'Morocco',
      hasSalary: String(filters.hasSalary),
      timeFrame: filters.timeFrame,
      offset:    String(newOffset),
      limit:     String(PAGE_SIZE),
    });

    fetch(`${BASE}/api/search?${params}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d: JobDTO[]) => {
        setSearchResults(prev => append && prev ? [...prev, ...d] : d);
        setSearchOffset(newOffset + d.length);
        setHasMore(d.length === PAGE_SIZE); // if full page returned, there may be more
        if (append) setLoadingMore(false); else setSearchLoading(false);
        if (!append) setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      })
      .catch(e  => {
        setSearchError(e.message);
        if (append) setLoadingMore(false); else setSearchLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchOffset(0);
    setHasMore(false);
    doSearch(0, false);
  };

  const handleLoadMore = () => doSearch(searchOffset, true);

  // ── Filtered saved jobs ────────────────────────────────────────────────────
  const filteredSaved = savedJobs.filter(j =>
    !textSearch ||
    j.title.toLowerCase().includes(textSearch.toLowerCase()) ||
    j.company.toLowerCase().includes(textSearch.toLowerCase()) ||
    (j.location ?? '').toLowerCase().includes(textSearch.toLowerCase())
  );

  // Determine which section is active
  const showSearchResults = searchResults !== null;

  return (
    <Layout>
      {/* ── Hero ── */}
      <div className="oe-hero">
        <div className="oe-hero-inner">
          <span className="oe-hero-badge">Opportunités RH</span>
          <h1 className="oe-hero-title">Offres d'Emploi</h1>
          <p className="oe-hero-sub">
            Recherchez en temps réel ou parcourez les offres sauvegardées, actualisées quotidiennement.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="oe-body">
        <div className="oe-container">

          {/* ── Filter Panel ── */}
          <JobSearchFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            loading={searchLoading}
          />

          {/* ── Live Search Results ── */}
          {showSearchResults && (
            <div ref={resultsRef}>
              <div className="oe-section-header">
                <span className="oe-section-title">
                  🔍 Résultats en temps réel
                  <span className="oe-section-pill">{searchResults.length}</span>
                </span>
                <button
                  className="oe-section-reset"
                  onClick={() => setSearchResults(null)}
                >
                  ✕ Effacer les résultats
                </button>
              </div>

              {searchError && (
                <div className="oe-state oe-state--error">
                  <p>⚠️ Erreur lors de la recherche : {searchError}</p>
                </div>
              )}

              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div className="oe-state">
                  <p>🔍 Aucune offre trouvée pour ces filtres.</p>
                </div>
              )}

              {!searchError && searchResults.length > 0 && (
                <div className="oe-grid">
                  {searchResults.map(job => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      applyUrl={job.applyUrl}
                      badge={job.sourceType || 'LinkedIn'}
                      meta={job.datePosted ? `Publié le ${job.datePosted}` : ''}
                      salary={job.salary}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {!searchError && (hasMore || loadingMore) && (
                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="oe-load-more"
                  >
                    {loadingMore ? (
                      <>
                        <span className="oe-load-spinner"/>
                        Chargement...
                      </>
                    ) : (
                      <>Charger plus d'offres</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Saved Jobs Section ── */}
          <div className="oe-section-header" style={{ marginTop: showSearchResults ? '48px' : 0 }}>
            <span className="oe-section-title">
              📋 Offres sauvegardées
              {!savedLoading && <span className="oe-section-pill">{filteredSaved.length}</span>}
            </span>
            {/* Quick text search inside saved */}
            <div className="oe-inline-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Filtrer..."
                value={textSearch}
                onChange={e => setTextSearch(e.target.value)}
              />
              {textSearch && (
                <button onClick={() => setTextSearch('')}>✕</button>
              )}
            </div>
          </div>

          {savedLoading && (
            <div className="oe-state">
              <div className="oe-spinner"/>
              <p>Chargement des offres sauvegardées...</p>
            </div>
          )}

          {savedError && (
            <div className="oe-state oe-state--error">
              <p>⚠️ {savedError}</p>
            </div>
          )}

          {!savedLoading && !savedError && filteredSaved.length === 0 && (
            <div className="oe-state">
              <p>📭 Aucune offre sauvegardée{textSearch ? ` pour « ${textSearch} »` : ''}.</p>
              {!textSearch && <small>Les offres seront importées automatiquement dans 30 s au prochain démarrage du serveur.</small>}
            </div>
          )}

          {!savedLoading && !savedError && filteredSaved.length > 0 && (
            <div className="oe-grid">
              {filteredSaved.map(job => (
                <JobCard
                  key={job.externalId}
                  id={job.externalId}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  applyUrl={job.applyUrl}
                  badge={job.sourceType}
                  meta={new Date(job.fetchedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};