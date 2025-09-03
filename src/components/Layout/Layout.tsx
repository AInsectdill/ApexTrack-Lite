import React from 'react';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-white text-gray-600 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            Copyright © 2024 ApexTrack Lite. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Version 1.2.4
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;