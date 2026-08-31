import React, { useState } from 'react';
import { useUsers, User } from '../../contexts/UsersContext';
import { Loader, Trash2, Shield, User as UserIcon } from 'lucide-react';

export const UsersList: React.FC = () => {
  const { users, loading, deleteUser, updateMembership } = useUsers();
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter(u => filterRole === 'all' || u.role === filterRole);

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      await deleteUser(id);
    }
  };

  const toggleMembership = async (user: User) => {
    const newStatus = user.membershipStatus === 'FREE' ? 'PREMIUM' : 'FREE';
    if (window.confirm(`Passer l'utilisateur en statut ${newStatus} ?`)) {
      await updateMembership(user.id, newStatus);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Utilisateurs</h1>
      </div>

      <div className="articles-list-wrap" style={{ marginTop: 0 }}>
        <div className="articles-subfilter-bar" style={{ padding: '10px 0 4px' }}>
          <button className={`articles-subfilter-link ${filterRole === 'all' ? 'active' : ''}`} onClick={() => setFilterRole('all')}>Tous ({users.length})</button>
          <span className="articles-subfilter-sep">|</span>
          <button className={`articles-subfilter-link ${filterRole === 'ADMIN' ? 'active' : ''}`} onClick={() => setFilterRole('ADMIN')}>Admins ({users.filter(u => u.role === 'ADMIN').length})</button>
          <span className="articles-subfilter-sep">|</span>
          <button className={`articles-subfilter-link ${filterRole === 'MEMBER' ? 'active' : ''}`} onClick={() => setFilterRole('MEMBER')}>Membres ({users.filter(u => u.role === 'MEMBER').length})</button>
        </div>

        <div className="wp-table-outer" style={{ marginTop: 12 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Loader size={24} style={{ color: '#7B2D8E', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#646970', fontSize: 14 }}>Chargement des utilisateurs...</p>
            </div>
          ) : (
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8c8f94' }}>Aucun utilisateur trouvé.</td>
                  </tr>
                )}
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {user.role === 'ADMIN' ? <Shield size={16} style={{ color: '#7B2D8E' }} /> : <UserIcon size={16} style={{ color: '#8c8f94' }} />}
                        <span style={{ fontWeight: 600, color: '#1d2327' }}>{user.name}</span>
                      </div>
                    </td>
                    <td><a href={`mailto:${user.email}`} style={{ color: '#2271b1', textDecoration: 'none' }}>{user.email}</a></td>
                    <td>{user.role}</td>
                    <td>
                      <button 
                        onClick={() => toggleMembership(user)}
                        className={`wp-status-badge ${user.membershipStatus === 'PREMIUM' ? 'wp-status-published' : ''}`}
                        style={{ cursor: 'pointer', border: 'none', background: user.membershipStatus === 'PREMIUM' ? '#d1fae5' : '#f0f0f1', color: user.membershipStatus === 'PREMIUM' ? '#065f46' : '#646970' }}
                      >
                        {user.membershipStatus}
                      </button>
                    </td>
                    <td style={{ color: '#646970', fontSize: 13 }}>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="wp-row-actions" style={{ visibility: 'visible', position: 'static' }}>
                        <button className="wp-row-action-btn trash" onClick={() => handleDelete(user.id)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
