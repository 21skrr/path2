import React from 'react';
import { Layout } from '../components/Layout';
import { AuthCard } from '../components/ui/travel-connect-signin';
import './Login.css';

export const Register: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#f8f5ff] to-[#e4dcf1] min-h-screen">
        <AuthCard isLogin={false} />
      </div>
    </Layout>
  );
};
