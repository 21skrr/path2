import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="app-layout min-h-screen">{children}</div>;
}
