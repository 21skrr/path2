import React, { useEffect, useState } from 'react';

interface JobListing {
  externalId: string;
  title: string;
  company: string;
  location: string | null;
  applyUrl: string | null;
  sourceType: string;
  fetchedAt: string;
}

export const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const url = searchTerm 
          ? `http://localhost:8080/api/local-jobs?q=${encodeURIComponent(searchTerm)}`
          : 'http://localhost:8080/api/local-jobs';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small debounce if typing
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Offres d'Emploi Locales</h2>
        <input 
          type="text" 
          placeholder="Rechercher par titre, entreprise ou lieu..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-path-purple focus:border-path-purple"
        />
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Chargement des offres...</div>}
      
      {error && <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">Erreur: {error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">Aucune offre trouvée.</div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.externalId} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-path-teal rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {(job.company || '?').charAt(0).toUpperCase()}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-path-purple">
                  {job.sourceType}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">{job.company}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <svg className="flex-shrink-0 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location || 'Lieu non spécifié'}
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(job.fetchedAt).toLocaleDateString()}
                </span>
                {job.applyUrl ? (
                  <a 
                    href={job.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-path-purple hover:bg-path-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-path-purple transition-colors"
                  >
                    Postuler
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">Lien indisponible</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};