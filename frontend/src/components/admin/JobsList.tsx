import React, { useState } from 'react';
import { useJobs } from '../../contexts/JobsContext';
import { Loader, Plus, Trash2, MapPin, Building2 } from 'lucide-react';

export const JobsList: React.FC = () => {
  const { jobs, loading, deleteJob, addJob } = useJobs();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', type: 'CDI' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addJob(formData);
    setShowForm(false);
    setFormData({ title: '', company: '', location: '', type: 'CDI' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Mettre cette offre à la corbeille ?')) {
      await deleteJob(id);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Offres d'Emploi</h1>
        <button className="wp-btn wp-btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? 'Annuler' : 'Ajouter une Offre'}
        </button>
      </div>

      {showForm && (
        <div className="wp-panel" style={{ padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, marginBottom: 16 }}>Créer une Offre d'Emploi</h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
            <input required placeholder="Titre de l'offre (ex: Responsable RH)" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
            <input required placeholder="Entreprise" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
            <input required placeholder="Ville / Lieu" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }}>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
            <button type="submit" className="wp-btn wp-btn-primary" style={{ justifySelf: 'start' }}>Publier l'offre</button>
          </form>
        </div>
      )}

      <div className="wp-table-outer">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Loader size={24} style={{ color: '#7B2D8E', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          </div>
        ) : (
          <table className="wp-table">
            <thead>
              <tr>
                <th>Poste</th>
                <th>Entreprise</th>
                <th>Lieu</th>
                <th>Type</th>
                <th>Date d'ajout</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8c8f94' }}>Aucune offre d'emploi.</td></tr>
              )}
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: '#1d2327' }}>{job.title}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} style={{ color: '#8c8f94' }} /> {job.company}</div></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} style={{ color: '#8c8f94' }} /> {job.location}</div></td>
                  <td><span className={`wp-status-badge ${job.type === 'CDI' ? 'wp-status-published' : ''}`} style={{ background: job.type === 'CDI' ? '#d1fae5' : '#e0e7ff', color: job.type === 'CDI' ? '#065f46' : '#3730a3' }}>{job.type}</span></td>
                  <td style={{ color: '#646970', fontSize: 13 }}>{new Date(job.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button className="wp-row-action-btn trash" onClick={() => handleDelete(job.id)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
