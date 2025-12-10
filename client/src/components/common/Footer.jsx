import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const footerLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Documents', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' }
  ];

  const socialLinks = [
    { icon: '🔗', label: 'LinkedIn', href: '#' },
    { icon: '🐙', label: 'GitHub', href: '#' },
    { icon: '📧', label: 'Email', href: 'mailto:contact@tesla.com' }
  ];

  return (
    <footer className="relative border-t border-white/5 bg-gradient-to-b from-[#0a0b10] to-[#050607] backdrop-blur-xl">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative">
        {/* Top section - Credits and branding */}
        <div className="border-b border-white/5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand section */}
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Tesla"
                    className="h-8 w-8 object-contain drop-shadow-lg"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Tesla Ops</p>
                    <p className="text-xs text-slate-400">Document Finder</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Secure document management and quality control for Tesla operations.
                </p>
              </div>

              {/* Quick links */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Quick Links</p>
                <ul className="space-y-2">
                  {footerLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-xs text-slate-400 transition hover:text-primary hover:underline underline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
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
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Connect</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm transition hover:border-primary hover:bg-primary/10"
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle section - Credits */}
        <div className="border-b border-white/5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4 text-center sm:text-left">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Created By</p>
                <p className="font-heading text-lg text-white">Melanie Chavaria Birmingham</p>
                <p className="text-xs text-slate-400">Quality Engineering • Tesla Operations</p>
              </div>
              <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                <span>🏢 Tesla Giga Nevada</span>
                <span className="hidden sm:inline">•</span>
                <span>📍 Nevada, USA</span>
                <span className="hidden sm:inline">•</span>
                <span>🚀 Manufacturing & Quality Vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Copyright and legal */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4">
              {/* Copyright */}
              <div className="flex flex-col gap-3 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {currentYear} Tesla Manufacturing & Quality Vault. All rights reserved.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                  <a href="#" className="transition hover:text-primary hover:underline underline-offset-2">
                    Privacy Policy
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a href="#" className="transition hover:text-primary hover:underline underline-offset-2">
                    Terms of Service
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a href="#" className="transition hover:text-primary hover:underline underline-offset-2">
                    Contact
                  </a>
                </div>
              </div>

              {/* Version and status */}
              <div className="flex flex-col gap-2 text-center text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Document Finder v1.0 • Powered by Tesla Operations
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>System Status: Operational</span>
                </div>
              </div>

              {/* Developer credit */}
              <div className="border-t border-white/5 pt-4 text-center text-xs text-slate-600">
                <p>
                  Designed & Developed by <span className="font-semibold text-slate-400">Melanie Chavaria Birmingham</span> • Quality Engineering Team
                </p>
                <p className="mt-1">
                  🔐 Secure • 🚀 Fast • 💡 Innovative
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {scrollPosition > 100 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-sm text-primary transition hover:bg-primary hover:text-white"
            title="Scroll to top"
          >
            ↑
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer;
