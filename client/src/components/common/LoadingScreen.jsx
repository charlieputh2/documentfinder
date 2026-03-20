import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-secondary text-white safe-area-top safe-area-bottom">
      <img src="/logo.png" alt="Document Finder" className="h-14 w-14 object-contain opacity-80" />
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
      <div className="text-center">
        <p className="font-heading text-sm tracking-[0.3em] text-slate-300">Loading</p>
        <p className="mt-1 text-xs text-slate-500">
          {slow ? 'Server is waking up, this may take a moment...' : 'Please wait...'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
