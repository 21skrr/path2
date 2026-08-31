import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts, PostCategory, PostPlacement, SUBCATEGORIES_MAP } from '../../contexts/PostsContext';
import {
  Link2, Image, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Undo2, Redo2, ChevronDown, Upload, Plus, Save, Eye
} from 'lucide-react';

const HR_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'ACTUALITE',  label: 'Actualite RH' },
  { value: 'INTERVIEW',  label: 'Interviews' },
  { value: 'ETUDE',      label: 'Etudes & Publications' },
  { value: 'NOMINATION', label: 'Nominations' },
  { value: 'ANNUAIRE', label: 'Annuaire' },
  { value: 'OFFRE_EMPLOI', label: "Offres d'Emploi" },
  { value: 'TEXTE_LOI', label: 'Textes de Loi' },
  { value: 'ARTICLE', label: 'Articles' },
];

const ALL_CAT_LABELS = [
  'Actualite RH', 'Interviews', 'Etudes & Publications', 'Nominations', 'Annuaire', "Offres d'Emploi", 'Textes de Loi', 'Articles'
];

interface PostEditorProps {
  editId?: string;
}

export const PostEditor: React.FC<PostEditorProps> = ({ editId }) => {
  const { posts, addPost, updatePost } = usePosts();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const resolvedId = editId || params.id;
  const existingPost = resolvedId ? posts.find(p => String(p.id) === String(resolvedId)) : null;

  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [category, setCategory] = useState<PostCategory>(existingPost?.category || 'ACTUALITE');
  const [subCategory, setSubCategory] = useState<string>(existingPost?.subCategory || '');
  const [placement, setPlacement] = useState<PostPlacement>(existingPost?.placement || 'STANDARD');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedCats, setSelectedCats] = useState<string[]>(['Actualité RH']);
  const [featuredImage, setFeaturedImage] = useState<string | null>(existingPost?.image || null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Accordion panels state
  const [openPanels, setOpenPanels] = useState(['status', 'categories', 'placement', 'featured-image', 'excerpt']);

  const togglePanel = (id: string) => {
    setOpenPanels(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSave = async () => {
    if (!title.trim()) { alert('Le titre est requis.'); return; }
    setSaving(true);
    try {
      // Build publishedAt as a full ISO string from the date picker value
      const publishedAt = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();
      if (existingPost) {
        await updatePost(existingPost.id, { title, content, excerpt, category, subCategory, placement, image: featuredImage || undefined, publishedAt });
      } else {
        await addPost({ title, content, excerpt, category, subCategory, placement, image: featuredImage || undefined, publishedAt });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (!existingPost) navigate('/admin/articles');
    } finally {
      setSaving(false);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {existingPost ? 'Modifier l\'Article' : 'Ajouter un Article'}
        </h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
          {saved && (
            <span style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: 4, fontWeight: 600 }}>
              ✓ Enregistré
            </span>
          )}
          <button className="wp-btn" style={{ gap: 4 }} onClick={() => navigate('/admin/articles')}>
            ← Retour
          </button>
          <button
            className="wp-btn"
            style={{ gap: 4 }}
            onClick={() => {
              if (existingPost) {
                window.open(`/articles/${existingPost.id}`, '_blank');
              } else if (title.trim()) {
                alert('Enregistrez d\'abord l\'article pour le prévisualiser.');
              } else {
                alert('Ajoutez un titre pour prévisualiser l\'article.');
              }
            }}
          >
            <Eye size={13} /> Prévisualiser
          </button>
          <button
            className="wp-btn wp-btn-primary"
            style={{ gap: 4 }}
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={13} />
            {saving ? 'Enregistrement...' : existingPost ? 'Mettre à jour' : 'Publier'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="post-editor-wrap">
        {/* Main Column */}
        <div className="post-editor-main">
          {/* Title */}
          <input
            className="post-editor-title-input"
            type="text"
            placeholder="Titre de l'article"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          {/* Block Editor */}
          <div className="block-editor-area">
            {/* Toolbar */}
            <div className="block-editor-toolbar">
              <button className="block-editor-tool" title="Annuler"><Undo2 size={14} /></button>
              <button className="block-editor-tool" title="Rétablir"><Redo2 size={14} /></button>
              <div className="block-editor-tool-sep" />
              <button className="block-editor-tool" title="Gras" style={{ fontWeight: 900 }}>B</button>
              <button className="block-editor-tool" title="Italique" style={{ fontStyle: 'italic', fontWeight: 600 }}>I</button>
              <button className="block-editor-tool" title="Lien"><Link2 size={14} /></button>
              <div className="block-editor-tool-sep" />
              <button className="block-editor-tool" title="Alignement gauche"><AlignLeft size={14} /></button>
              <button className="block-editor-tool" title="Centré"><AlignCenter size={14} /></button>
              <button className="block-editor-tool" title="Droite"><AlignRight size={14} /></button>
              <div className="block-editor-tool-sep" />
              <button className="block-editor-tool" title="Liste à puces"><List size={14} /></button>
              <button className="block-editor-tool" title="Liste numérotée"><ListOrdered size={14} /></button>
              <button className="block-editor-tool" title="Citation"><Quote size={14} /></button>
              <div className="block-editor-tool-sep" />
              <button className="block-editor-tool" title="Insérer une image"><Image size={14} /></button>
            </div>

            {/* Content Area */}
            <div className="block-editor-content">
              <textarea
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '360px',
                  font: 'inherit',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#1d2327',
                  background: 'transparent',
                  padding: 0,
                }}
                placeholder="Commencez à rédiger votre article ou appuyez sur / pour insérer un bloc..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              {/* Add Block Button */}
              <button className="block-add-btn" type="button">
                <Plus size={14} /> Ajouter un bloc
              </button>
            </div>
          </div>

          {/* Content Type Selector */}
          <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['Paragraphe', 'Titre H2', 'Image', 'Citation', 'Liste', 'Séparateur'] as const).map(block => (
              <button key={block} className="wp-btn" style={{ fontSize: 12 }}>
                + {block}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="post-editor-sidebar">
          {/* ── Status & Visibility ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('status') ? 'open' : ''}`}
              onClick={() => togglePanel('status')}
            >
              <h3>Statut & Visibilité</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('status') && (
              <div className="sidebar-panel-body">
                <div className="status-row">
                  <label>Visibilité</label>
                  <select value={visibility} onChange={e => setVisibility(e.target.value as any)}>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="status-row">
                  <label>Statut</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div className="status-row">
                  <label>Date de publication</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={e => setPublishDate(e.target.value)}
                  />
                </div>
                <div className="publish-actions">
                  <button className="wp-btn" style={{ fontSize: 12 }}>
                    Enregistrer le brouillon
                  </button>
                  <button
                    className="wp-btn wp-btn-primary"
                    style={{ fontSize: 12 }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? '...' : existingPost ? 'Mettre à jour' : 'Publier'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Categories ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('categories') ? 'open' : ''}`}
              onClick={() => togglePanel('categories')}
            >
              <h3>Catégories</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('categories') && (
              <div className="sidebar-panel-body">
                <div className="cat-checklist">
                  {ALL_CAT_LABELS.map(cat => (
                    <label key={cat} className="cat-item" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(cat)}
                        onChange={() => toggleCat(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f0f1' }}>
                  <p style={{ fontSize: 12, color: '#646970', marginBottom: 6, fontWeight: 600 }}>Type principal :</p>
                  <select
                    value={category}
                    onChange={e => {
                      const newCat = e.target.value as PostCategory;
                      setCategory(newCat);
                      setSubCategory('');
                    }}
                    style={{ width: '100%', height: 30, padding: '0 8px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', color: '#1d2327' }}
                  >
                    {HR_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  
                  {SUBCATEGORIES_MAP[category]?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 12, color: '#646970', marginBottom: 6, fontWeight: 600 }}>Sous-catégorie :</p>
                      <select
                        value={subCategory}
                        onChange={e => setSubCategory(e.target.value)}
                        style={{ width: '100%', height: 30, padding: '0 8px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', color: '#1d2327' }}
                      >
                        <option value="">Sélectionnez une sous-catégorie</option>
                        {SUBCATEGORIES_MAP[category].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Placement (Home Page) ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('placement') ? 'open' : ''}`}
              onClick={() => togglePanel('placement')}
            >
              <h3>Emplacement (Page d'accueil)</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('placement') && (
              <div className="sidebar-panel-body">
                <p style={{ fontSize: 12, color: '#646970', marginBottom: 8 }}>
                  Choisissez où cet article doit apparaître sur la page d'accueil :
                </p>
                <select
                  value={placement}
                  onChange={e => setPlacement(e.target.value as PostPlacement)}
                  style={{ width: '100%', height: 30, padding: '0 8px', border: '1px solid #8c8f94', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', color: '#1d2327' }}
                >
                  <option value="STANDARD">Standard (Flux de catégorie)</option>
                  <option value="SLIDER">Slider principal</option>
                  <option value="FEATURED_MAIN">À la Une (Article principal)</option>
                  <option value="FEATURED_SECONDARY">À la Une (Articles secondaires)</option>
                  <option value="TRENDING">Tendances (Barre latérale)</option>
                </select>
              </div>
            )}
          </div>

          {/* ── Featured Image ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('featured-image') ? 'open' : ''}`}
              onClick={() => togglePanel('featured-image')}
            >
              <h3>Image à la Une</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('featured-image') && (
              <div className="sidebar-panel-body">
                {featuredImage ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={featuredImage}
                      alt="Featured"
                      style={{ width: '100%', borderRadius: 6, objectFit: 'cover', maxHeight: 140 }}
                    />
                    <button
                      onClick={() => setFeaturedImage(null)}
                      style={{
                        position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)',
                        color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, lineHeight: 1,
                      }}
                    >×</button>
                    <button
                      className="wp-btn"
                      style={{ width: '100%', marginTop: 8, fontSize: 12 }}
                      onClick={() => setFeaturedImage(null)}
                    >
                      Supprimer l'image
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="featured-image-upload"
                    className={`featured-image-drop ${dragOver ? 'dragover' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleImageDrop}
                    style={{ cursor: 'pointer' }}
                  >
                    <Upload size={22} style={{ color: '#8c8f94', marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13, color: '#1d2327' }}>
                      Déposer une image ici
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#8c8f94' }}>ou cliquer pour sélectionner</p>
                    <input
                      id="featured-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageFile}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* ── Excerpt ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('excerpt') ? 'open' : ''}`}
              onClick={() => togglePanel('excerpt')}
            >
              <h3>Extrait</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('excerpt') && (
              <div className="sidebar-panel-body">
                <p style={{ fontSize: 12, color: '#646970', margin: '0 0 8px' }}>
                  Résumé court de l'article affiché dans les listes.
                </p>
                <textarea
                  className="excerpt-textarea"
                  placeholder="Saisissez un extrait..."
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                />
                <p style={{ fontSize: 11, color: '#8c8f94', margin: '4px 0 0' }}>
                  {excerpt.length} caractères
                </p>
              </div>
            )}
          </div>

          {/* ── Discussion ── */}
          <div className="sidebar-panel">
            <div
              className={`sidebar-panel-head ${openPanels.includes('discussion') ? 'open' : ''}`}
              onClick={() => togglePanel('discussion')}
            >
              <h3>Discussion</h3>
              <ChevronDown size={14} />
            </div>
            {openPanels.includes('discussion') && (
              <div className="sidebar-panel-body">
                <label className="cat-item" style={{ cursor: 'pointer', gap: 10 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#7B2D8E' }} />
                  <span style={{ fontSize: 13, color: '#1d2327' }}>Autoriser les commentaires</span>
                </label>
                <label className="cat-item" style={{ cursor: 'pointer', gap: 10 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#7B2D8E' }} />
                  <span style={{ fontSize: 13, color: '#1d2327' }}>Autoriser les rétroliens</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
