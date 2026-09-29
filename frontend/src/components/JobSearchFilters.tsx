import React from 'react';

export interface SearchFilters {
  location: string;
  hasSalary: boolean;
  timeFrame: string;
}

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const TIME_FRAME_OPTIONS = [
  { value: '24h',   label: 'Dernières 24h' },
  { value: '1w',    label: 'Cette semaine' },
  { value: '1m',    label: 'Ce mois-ci' },
  { value: '6m',    label: '6 derniers mois' },
];

/**
 * Job search filter panel built with Tailwind CSS.
 * Exposes location, hasSalary and timeFrame controls.
 */
export const JobSearchFilters: React.FC<Props> = ({ filters, onChange, onSearch, loading }) => {
  const set = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 mb-8">
      <p className="text-xs font-bold uppercase tracking-widest text-path-purple mb-4">
        Filtrer les offres
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-end">

        {/* Location */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Localisation
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              type="text"
              value={filters.location}
              onChange={e => set({ location: e.target.value })}
              onKeyDown={handleKey}
              placeholder="Ex: Morocco, France..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-path-purple/30 focus:border-path-purple transition"
            />
          </div>
        </div>

        {/* Time Frame */}
        <div className="w-full sm:w-44">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Période
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <select
              value={filters.timeFrame}
              onChange={e => set({ timeFrame: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-path-purple/30 focus:border-path-purple appearance-none cursor-pointer transition"
            >
              {TIME_FRAME_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* Has Salary */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 invisible sm:visible">
            &nbsp;
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 select-none hover:border-path-purple/50 transition group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={filters.hasSalary}
                onChange={e => set({ hasSalary: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                filters.hasSalary
                  ? 'bg-path-teal border-path-teal'
                  : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600'
              }`}>
                {filters.hasSalary && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
              Avec salaire
            </span>
          </label>
        </div>

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-path-purple hover:bg-path-purple-dark text-white text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-path-purple/30 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </div>
    </div>
  );
};