import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '../../contexts/PostsContext';
import { Plus, Search, ChevronLeft, ChevronRight, Filter, Loader } from 'lucide-react';

const CATEGORIES = ['Toutes', 'ACTUALITÉ RH', 'INTERVIEW', 'ETUDE', 'NOMINATION'];
const PAGE_SIZE = 10;

export const ArticlesList: React.FC = () => {
  const { posts, deletePost, loading } = usePosts();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [quickEditId, setQuickEditId] = useState<string | number | null>(null);
  const [quickEditData, setQuickEditData] = useState({ title: '', category: '', status: 'Published' });

  // Filtering logic
  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'Toutes' || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [posts, search, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleQuickEdit = (post: typeof posts[0]) => {
    setQuickEditId(post.id);
    setQuickEditData({ title: post.title, category: post.category, status: 'Published' });
  };

  const handleTrash = async (id: string | number) => {
    if (window.confirm('Mettre cet article à la corbeille ?')) {
      await deletePost(id);
    }
  };

  const formatDate = (dateStr: string) => dateStr || '—';

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Articles</h1>
        <button
          className="wp-btn wp-btn-primary"
          style={{ height: 32, fontSize: 13 }}
          onClick={() => navigate('/admin/articles/new')}
        >
          <Plus size={14} /> Ajouter un Article
        </button>
      </div>

      <div className="articles-list-wrap" style={{ marginTop: 0 }}>
        {/* Sub-Filter Links */}
        <div className="articles-subfilter-bar" style={{ padding: '10px 0 4px' }}>
          {(['all', 'published', 'draft'] as const).map((s, i, arr) => (
            <React.Fragment key={s}>
              <button
                className={`articles-subfilter-link ${filterStatus === s ? 'active' : ''}`}
                onClick={() => { setFilterStatus(s); setPage(1); }}
              >
                {s === 'all' ? `Tous (${posts.length})` : s === 'published' ? `Publiés (${posts.length})` : 'Brouillons (0)'}
              </button>
              {i < arr.length - 1 && <span className="articles-subfilter-sep">|</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="articles-filter-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: 8, color: '#8c8f94', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Rechercher des articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: 28, width: 240 }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Toutes les catégories' : c}</option>)}
          </select>
          <select style={{ minWidth: 120 }}>
            <option>Toutes les dates</option>
            <option>Mars 2026</option>
            <option>Février 2026</option>
            <option>Janvier 2026</option>
          </select>
          <button className="wp-btn">
            <Filter size={12} /> Filtrer
          </button>
        </div>

        {/* Table */}
        <div className="wp-table-outer" style={{ marginTop: 4 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Loader size={24} style={{ color: '#7B2D8E', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#646970', fontSize: 14, margin: 0 }}>Chargement des articles...</p>
            </div>
          ) : (
            <>
              {/* Bulk Action bar */}
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f1', display: 'flex', gap: 8, background: '#fafafa' }}>
                <select className="wp-btn" style={{ border: '1px solid #8c8f94', height: 28 }}>
                  <option>Actions groupées</option>
                  <option>Modifier</option>
                  <option>Corbeille</option>
                </select>
                <button className="wp-btn">Appliquer</button>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#646970', alignSelf: 'center' }}>
                  {filtered.length} article{filtered.length > 1 ? 's' : ''}
                </span>
              </div>

              <table className="wp-table">
                <thead>
                  <tr>
                    <th style={{ width: 24 }}>
                      <input type="checkbox" style={{ accentColor: '#7B2D8E' }} />
                    </th>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8c8f94', fontSize: 14 }}>
                        Aucun article trouvé.
                      </td>
                    </tr>
                  )}
                  {paginated.map((post) => (
                    <React.Fragment key={post.id}>
                      <tr>
                        <td>
                          <input type="checkbox" style={{ accentColor: '#7B2D8E' }} />
                        </td>
                        <td>
                          <Link to={`/admin/articles/edit/${post.id}`} className="wp-row-title-link">
                            {post.title}
                          </Link>
                          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#8c8f94', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>
                            {post.excerpt}
                          </p>
                          {/* Row Actions */}
                          <div className="wp-row-actions">
                            <Link to={`/admin/articles/edit/${post.id}`} className="wp-row-actions a">Modifier</Link>
                            <span className="wp-row-actions-sep">|</span>
                            <button
                              className="wp-row-action-btn"
                              onClick={() => quickEditId === post.id ? setQuickEditId(null) : handleQuickEdit(post)}
                            >
                              Modification rapide
                            </button>
                            <span className="wp-row-actions-sep">|</span>
                            <button className="wp-row-action-btn trash" onClick={() => handleTrash(post.id)}>
                              Corbeille
                            </button>
                            <span className="wp-row-actions-sep">|</span>
                            <Link to={post.href} className="wp-row-actions a">Afficher</Link>
                          </div>
                        </td>
                        <td style={{ color: '#2271b1', fontSize: 13, whiteSpace: 'nowrap' }}>
                          Admin HR
                        </td>
                        <td>
                          <span className="wp-cat-badge">{post.category}</span>
                        </td>
                        <td>
                          <span className="wp-status-badge wp-status-published">Publié</span>
                        </td>
                        <td style={{ fontSize: 13, color: '#646970', whiteSpace: 'nowrap' }}>
                          {formatDate(post.date)}
                        </td>
                      </tr>

                      {/* Quick Edit Inline Row */}
                      {quickEditId === post.id && (
                        <tr className="wp-quickedit-row">
                          <td colSpan={6}>
                            <div style={{ padding: '16px 20px', background: '#f6f7f7', borderTop: '2px solid #7B2D8E' }}>
                              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1d2327', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Modification rapide
                              </p>
                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
                                <div className="wp-quickedit-field">
                                  <label>Titre</label>
                                  <input
                                    type="text"
                                    value={quickEditData.title}
                                    onChange={e => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                  />
                                </div>
                                <div className="wp-quickedit-field">
                                  <label>Catégorie</label>
                                  <select
                                    value={quickEditData.category}
                                    onChange={e => setQuickEditData({ ...quickEditData, category: e.target.value })}
                                  >
                                    <option value="ACTUALITÉ RH">Actualité RH</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="ETUDE">Etude</option>
                                    <option value="NOMINATION">Nomination</option>
                                  </select>
                                </div>
                                <div className="wp-quickedit-field">
                                  <label>Statut</label>
                                  <select
                                    value={quickEditData.status}
                                    onChange={e => setQuickEditData({ ...quickEditData, status: e.target.value })}
                                  >
                                    <option>Published</option>
                                    <option>Draft</option>
                                  </select>
                                </div>
                              </div>
                              <div className="wp-quickedit-actions">
                                <button className="wp-btn wp-btn-primary">Mettre à jour</button>
                                <button className="wp-btn" onClick={() => setQuickEditId(null)}>Annuler</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="wp-pagination">
                  <span>{filtered.length} article{filtered.length > 1 ? 's' : ''}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      className="wp-pagination-btn"
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="wp-pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          className={`wp-pagination-btn ${page === p ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      className="wp-pagination-btn"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
