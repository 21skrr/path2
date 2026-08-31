import React from 'react';
import { Save } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Réglages du site</h1>
      </div>

      <div className="wp-panel" style={{ padding: 24, marginTop: 24, maxWidth: 800 }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Titre du site</label>
            <input type="text" defaultValue="PATH RH" style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Email de contact</label>
            <input type="email" defaultValue="contact@path-rh.ma" style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
          </div>
          <hr style={{ border: 0, borderTop: '1px solid #f0f0f1', margin: '12px 0' }} />
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Paramètres d'abonnement</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Prix Pack Professionnel (MAD)</label>
                <input type="number" defaultValue={2500} style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Prix Pack Senior (MAD)</label>
                <input type="number" defaultValue={4000} style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <button className="wp-btn wp-btn-primary" style={{ justifySelf: 'start', marginTop: 12 }}>
            <Save size={14} style={{ marginRight: 6 }} /> Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};
