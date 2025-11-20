'use client';

import { useEffect } from 'react';

const HomePage = () => {
  
  useEffect(() => {
    // Guaranteed redirect to /main
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
        window.location.replace('/main');
    }
    
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-500 dark:text-gray-400">Redirecting...</p>
    </div>
  );
};

export default HomePage;