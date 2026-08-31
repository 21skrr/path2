import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PathHoverFooter as Footer } from '../components/PathHoverFooter';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié ?</h1>
          
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
              <p className="text-gray-600 mb-6">Si un compte est associé à cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe.</p>
              <button onClick={() => window.location.href = '/login'} className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
              
              {status === 'error' && (
                <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  Une erreur est survenue. Veuillez réessayer.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 rounded-md border bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-[#7B2D8E] to-[#00B4A6] hover:from-[#5C1F6A] hover:to-[#008F84] text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all disabled:opacity-70"
                >
                  {status === 'loading' ? 'Envoi...' : 'Envoyer le lien'}
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
