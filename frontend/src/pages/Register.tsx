import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import './Login.css';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password, company);
      if (success) {
        navigate('/');
      } else {
        setError('Erreur lors de l\'inscription');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card animate-scaleIn">
          <div className="auth-header">
            <div className="auth-icon">📋</div>
            <h1>Créer un compte</h1>
            <p>Rejoignez la communauté RH du Maroc</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ahmed Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Entreprise</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Votre entreprise"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Adresse email *</label>
              <input
                id="reg-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Mot de passe *</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
