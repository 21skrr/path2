import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PathHoverFooter as Footer } from '../components/PathHoverFooter';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      setStatus('error');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Lien invalide ou expiré.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Une erreur est survenue.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex flex-col font-inter">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h1>
          
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Mot de passe modifié</h2>
              <p className="text-gray-600 mb-6">Votre mot de passe a été réinitialisé avec succès.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-[#7B2D8E] text-white py-3 rounded-lg font-bold hover:bg-[#5C1F6A] transition-colors">
                Se connecter
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                Veuillez entrer votre nouveau mot de passe.
              </p>
              
              {status === 'error' && (
                <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {errorMsg}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-10 rounded-md border bg-gray-50 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full h-10 rounded-md border bg-gray-50 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-[#7B2D8E] to-[#00B4A6] hover:from-[#5C1F6A] hover:to-[#008F84] text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all disabled:opacity-70 mt-6"
                >
                  {status === 'loading' ? 'Enregistrement...' : 'Enregistrer'}
                  {!status && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};
