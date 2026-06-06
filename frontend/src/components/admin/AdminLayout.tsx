import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Plus, FolderOpen, Image, Users,
  Settings, ChevronDown, ChevronRight, ExternalLink, LogOut,
  Menu, X, Bell, User, CreditCard
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de Bord', icon: <LayoutDashboard size={18} />, href: '/admin' },
  {
    label: 'Articles',
    icon: <FileText size={18} />,
    children: [
      { label: 'Tous les Articles', href: '/admin/articles' },
      { label: 'Ajouter un Article', href: '/admin/articles/new' },
      { label: 'Catégories', href: '/admin/articles?filter=categories' },
    ],
  },
  { label: 'Médias', icon: <Image size={18} />, href: '/admin/media' },
  { label: 'Paiements', icon: <CreditCard size={18} />, href: '/admin/payments' },
  { label: 'Utilisateurs', icon: <Users size={18} />, href: '/admin/users' },
  { label: 'Réglages', icon: <Settings size={18} />, href: '/admin/settings' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Articles']);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="admin-logo-mark">
            <span>P</span>
          </div>
          {!sidebarCollapsed && (
            <span className="admin-logo-text">P@TH Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="admin-nav-group">
              {item.children ? (
                <>
                  <button
                    className={`admin-nav-item admin-nav-parent ${expandedMenus.includes(item.label) ? 'expanded' : ''}`}
                    onClick={() => toggleMenu(item.label)}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="admin-nav-label">{item.label}</span>
                        <span className="admin-nav-arrow">
                          {expandedMenus.includes(item.label) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      </>
                    )}
                  </button>
                  {!sidebarCollapsed && expandedMenus.includes(item.label) && (
                    <div className="admin-nav-children">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`admin-nav-child ${location.pathname === child.href ? 'active' : ''}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href!}
                  className={`admin-nav-item ${isActive(item.href!) ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="admin-nav-label">{item.label}</span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-topbar-menu"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={18} />
            </button>
            <a href="/home" target="_blank" rel="noopener noreferrer" className="admin-visit-site">
              <ExternalLink size={14} />
              <span>Voir le Site</span>
            </a>
          </div>
          <div className="admin-topbar-right">
            <button className="admin-topbar-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="admin-notif-dot" />
            </button>

            {/* Profile Dropdown */}
            <div className="admin-profile-wrapper" ref={profileRef}>
              <button
                className="admin-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="admin-profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="admin-profile-name">{user?.name || 'Admin'}</span>
                <ChevronDown size={14} className={profileOpen ? 'rotated' : ''} />
              </button>
              {profileOpen && (
                <div className="admin-profile-dropdown">
                  <div className="admin-profile-dropdown-header">
                    <div className="admin-profile-dropdown-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="admin-profile-dropdown-name">{user?.name}</p>
                      <p className="admin-profile-dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="admin-profile-dropdown-divider" />
                  <Link to="/admin" className="admin-profile-dropdown-item">
                    <User size={14} /> Mon Profil
                  </Link>
                  <Link to="/admin/settings" className="admin-profile-dropdown-item">
                    <Settings size={14} /> Réglages
                  </Link>
                  <div className="admin-profile-dropdown-divider" />
                  <button onClick={handleLogout} className="admin-profile-dropdown-item logout">
                    <LogOut size={14} /> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};
