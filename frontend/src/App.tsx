import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { UsersProvider } from './contexts/UsersContext';
import { JobsProvider } from './contexts/JobsContext';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { Resources } from './pages/Resources';
import { Membership } from './pages/Membership';
import { MyAccount } from './pages/MyAccount';
import { Directory } from './pages/Directory';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { PathLanding } from './pages/PathLanding';
import { ContentDetail } from './pages/ContentDetail';
import { CategoryPage } from './pages/CategoryPage';
import { CodeTravailPage } from './pages/CodeTravailPage';
import { LoiGreve2025Page } from './pages/LoiGreve2025Page';
import { OffresEmploi } from './pages/OffresEmploi';
import './styles/index.css';

// ── Error Boundary ────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif', background: '#f8f5ff', padding: 32,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: '#1a0a2e', fontSize: 22, marginBottom: 8 }}>Une erreur s'est produite</h1>
          <p style={{ color: '#666', marginBottom: 24, maxWidth: 420, textAlign: 'center' }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('hr_user');
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg,#7B2D8E,#00B4A6)', color: '#fff',
              padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}
          >
            Réinitialiser la session
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Scroll To Top on Route Change ────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UsersProvider>
          <JobsProvider>
            <PostsProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<PathLanding />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/my-account" element={<MyAccount />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Dynamic Category Routes */}
                  <Route path="/actualite-maroc" element={<CategoryPage type="actualite-maroc" />} />
                  <Route path="/actualite-france" element={<CategoryPage type="actualite-france" />} />
                  <Route path="/nominations" element={<CategoryPage type="nominations" />} />
                  <Route path="/offres-emploi" element={<OffresEmploi />} />
                  <Route path="/textes-loi/code-travail" element={<CodeTravailPage />} />
                  <Route path="/textes-loi/loi-droit-de-greve" element={<LoiGreve2025Page />} />
                  <Route path="/textes-loi/:id" element={<CategoryPage type="textes-loi" />} />
                  <Route path="/textes-loi" element={<CategoryPage type="textes-loi" />} />
                  
                  {/* Dynamic Content Detail Routes */}
                  <Route path="/articles/:id" element={<ContentDetail />} />
                  <Route path="/interview/:id" element={<ContentDetail />} />
                  <Route path="/etude/:id" element={<ContentDetail />} />
                  <Route path="/offres/:id" element={<ContentDetail />} />
                </Routes>
              </Router>
            </PostsProvider>
          </JobsProvider>
        </UsersProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
