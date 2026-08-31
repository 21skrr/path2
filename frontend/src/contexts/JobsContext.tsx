import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchJobs, createJob as apiCreateJob, deleteJob as apiDeleteJob, Job } from '../services/api';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetchJobs();
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setError('Impossible de charger les offres d\'emploi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const addJob = async (job: Omit<Job, 'id' | 'createdAt'>) => {
    try {
      await apiCreateJob(job);
      loadJobs();
    } catch (err) {
      console.error('Failed to create job', err);
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await apiDeleteJob(id);
      loadJobs();
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  return (
    <JobsContext.Provider value={{ jobs, loading, error, addJob, deleteJob, refreshJobs: loadJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
