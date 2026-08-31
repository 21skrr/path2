import React, { useState, useEffect } from 'react';
import { apiClient, fetchResources, Resource } from '../../services/api';
import { Loader, Scale, FileText, Download, Plus, Trash2, Link2 } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Textes de Loi',
  TEMPLATE: 'Template / Guide',
  ONBOARDING: 'Onboarding',
};

const emptyForm = { title: '', fileUrl: '', category: 'LEGAL', isPremium: false };

export const ResourcesList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await fetchResources();
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResources(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl.trim()) {
      alert('Le titre et le lien sont requis.');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/resources', {
        title: formData.title,
        fileUrl: formData.fileUrl,
        category: formData.category,
        isPremium: formData.isPremium,
      });
      setFormData({ ...emptyForm });
      setShowForm(false);
      loadResources();
    } catch (err) {
      console.error('Failed to create resource', err);
      alert("Erreur lors de l'ajout de la ressource.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette ressource ?')) return;
    try {
      await apiClient.delete(`/resources/${id}`);
      loadResources();
    } catch (err) {
      console.error('Failed to delete resource', err);
    }
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === 'LEGAL') return <Scale size={16} style={{ color: '#059669' }} />;
    return <FileText size={16} style={{ color: '#2563eb' }} />;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Textes de Loi &amp; Ressources</h1>
        <button className="wp-btn wp-btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? 'Annuler' : 'Ajouter une Ressource'}
        </button>
      </div>

      {showForm && (
        <div className="wp-panel" style={{ padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, marginBottom: 16 }}>Ajouter un Texte de Loi ou une Ressource</h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d2327', marginBottom: 4 }}>Titre *</label>
              <input
                required
                placeholder="Ex: Code du Travail Marocain — Loi 65-99"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d2327', marginBottom: 4 }}>
                <Link2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                URL du fichier / document *
              </label>
              <input
                required
                type="url"
                placeholder="https://documents.example.com/fichier.pdf"
                value={formData.fileUrl}
                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: 11, color: '#8c8f94', margin: '4px 0 0' }}>
                Lien vers le fichier heberge (PDF, DOCX, etc.)
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d2327', marginBottom: 4 }}>Categorie</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }}
                >
                  <option value="LEGAL">Textes de Loi</option>
                  <option value="TEMPLATE">Template / Guide</option>
                  <option value="ONBOARDING">Onboarding</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1d2327', marginBottom: 4 }}>Acces</label>
                <select
                  value={formData.isPremium ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, isPremium: e.target.value === 'true' })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }}
                >
                  <option value="false">Gratuit</option>
                  <option value="true">Premium</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="wp-btn wp-btn-primary" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Publier la ressource'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="wp-table-outer" style={{ marginTop: 24 }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Loader size={24} style={{ color: '#7B2D8E', animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: '#646970', fontSize: 14 }}>Chargement des ressources...</p>
          </div>
        ) : (
          <table className="wp-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Categorie</th>
                <th>Acces</th>
                <th>Lien / Fichier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#8c8f94' }}>
                    Aucune ressource disponible. Cliquez sur "Ajouter une Ressource" pour commencer.
                  </td>
                </tr>
              )}
              {resources.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600, color: '#1d2327' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {getCategoryIcon(res.category)}
                      {res.title}
                    </div>
                  </td>
                  <td><span className="wp-cat-badge">{CATEGORY_LABELS[res.category] || res.category}</span></td>
                  <td>
                    <span
                      className={`wp-status-badge ${res.isPremium ? 'wp-status-draft' : 'wp-status-published'}`}
                      style={{
                        background: res.isPremium ? '#fef3c7' : '#d1fae5',
                        color: res.isPremium ? '#b45309' : '#065f46'
                      }}
                    >
                      {res.isPremium ? 'Premium' : 'Gratuit'}
                    </span>
                  </td>
                  <td>
                    {res.fileUrl ? (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wp-row-action-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Download size={14} /> Voir le fichier
                      </a>
                    ) : (
                      <span style={{ color: '#8c8f94', fontSize: 13 }}>Aucun fichier</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="wp-row-action-btn trash"
                      onClick={() => handleDelete(res.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
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
