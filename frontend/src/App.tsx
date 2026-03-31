import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { Resources } from './pages/Resources';
import { Membership } from './pages/Membership';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PathLanding } from './pages/PathLanding';
import { ContentDetail } from './pages/ContentDetail';
import { CategoryPage } from './pages/CategoryPage';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PathLanding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dynamic Category Routes */}
          <Route path="/actualite-maroc" element={<CategoryPage type="actualite-maroc" />} />
          <Route path="/actualite-france" element={<CategoryPage type="actualite-france" />} />
          <Route path="/nominations" element={<CategoryPage type="nominations" />} />
          <Route path="/offres-emploi" element={<CategoryPage type="offres-emploi" />} />
          <Route path="/textes-loi/:id" element={<CategoryPage type="textes-loi" />} />
          <Route path="/textes-loi" element={<CategoryPage type="textes-loi" />} />
          
          {/* Dynamic Content Detail Routes */}
          <Route path="/articles/:id" element={<ContentDetail />} />
          <Route path="/interview/:id" element={<ContentDetail />} />
          <Route path="/etude/:id" element={<ContentDetail />} />
          <Route path="/offres/:id" element={<ContentDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
