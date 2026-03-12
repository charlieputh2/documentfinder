import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="relative border-t border-white/5 bg-gradient-to-b from-[#0a0b10] to-[#050607] backdrop-blur-xl">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="border-b border-white/5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand + Document Types */}
              <div className="space-y-4 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Document Finder Logo" className="h-8 w-8 object-contain drop-shadow-lg" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Tesla Ops</p>
                    <p className="text-xs text-slate-400">Document Finder</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Secure document management and quality control for Tesla operations.
                </p>

                {/* Document Types Highlight */}
                <div className="space-y-2.5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">Supported Document Types</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-blue-500/10 text-[0.6rem] font-bold text-blue-400 border border-blue-400/20">MN</span>
                      <span className="text-[0.65rem] text-slate-400">Manufacturing Notice</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-indigo-500/10 text-[0.6rem] font-bold text-indigo-400 border border-indigo-400/20">MI</span>
                      <span className="text-[0.65rem] text-slate-400">Manufacturing Instructions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-emerald-500/10 text-[0.6rem] font-bold text-emerald-400 border border-emerald-400/20">QI</span>
                      <span className="text-[0.65rem] text-slate-400">Quality Instructions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-amber-500/10 text-[0.6rem] font-bold text-amber-400 border border-amber-400/20">QAN</span>
                      <span className="text-[0.65rem] text-slate-400">Quality Alert Notice</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-purple-500/10 text-[0.6rem] font-bold text-purple-400 border border-purple-400/20">VA</span>
                      <span className="text-[0.65rem] text-slate-400">Visual Aide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-9 items-center justify-center rounded bg-rose-500/10 text-[0.6rem] font-bold text-rose-400 border border-rose-400/20">PCA</span>
                      <span className="text-[0.65rem] text-slate-400">Process Change Approval</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Quick Links</p>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-xs text-slate-400 transition hover:text-primary hover:underline underline-offset-2">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-xs text-slate-400 transition hover:text-primary hover:underline underline-offset-2">
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Features</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Secure JWT Auth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Role-Based Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Live Previews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>AI Assistant</span>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Contact</p>
                <div className="space-y-2 text-xs text-slate-400">
                  <p>🏢 Tesla Giga Nevada</p>
                  <p>📍 Nevada, USA</p>
                  <a href="mailto:contact@tesla.com" className="flex items-center gap-1 transition hover:text-primary">
                    📧 contact@tesla.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="border-b border-white/5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4 text-center sm:text-left">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Created By</p>
                <p className="font-heading text-lg text-white">Melanie Chavaria Birmingham</p>
                <p className="text-xs text-slate-400">Quality Engineering · Tesla Operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>© {currentYear} Tesla Manufacturing & Quality Vault. All rights reserved.</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>System Status: Operational</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 text-center text-xs text-slate-600">
                <p>
                  Designed & Developed by <span className="font-semibold text-slate-400">Melanie Chavaria Birmingham</span> · Quality Engineering Team
                </p>
                <p className="mt-1">Document Finder v1.0 · Powered by Tesla Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top - positioned above AI button on mobile */}
      {showScrollTop && (
        <div className="fixed bottom-[5.5rem] right-4 z-30 sm:bottom-6 sm:right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#15161b]/90 text-sm text-slate-300 shadow-lg transition hover:bg-primary hover:text-white hover:border-primary/50 backdrop-blur-sm sm:h-10 sm:w-10 touch-manipulation active:scale-95"
            aria-label="Scroll to top"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer;
