import React from 'react';
import { Navbar } from './Navbar';
import { PathHoverFooter } from './PathHoverFooter';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" style={{ paddingTop: '120px' }}>
        {children}
      </main>
      <PathHoverFooter />
    </div>
  );
}
