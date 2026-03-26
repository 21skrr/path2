import React from 'react';

export function VerticalCutReveal({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <span {...props}>{children}</span>;
}
