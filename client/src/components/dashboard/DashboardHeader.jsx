import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Avatar = ({ photoUrl, initials, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: 'h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-10 w-10'
  };
  const textClasses = { sm: 'text-xs md:text-sm', md: 'text-sm', lg: 'text-sm' };

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt="Avatar"
        className={`${sizeClasses[size]} rounded-full border border-primary/30 object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`flex ${sizeClasses[size]} items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10`}>
      <span className={`${textClasses[size]} font-bold text-primary`}>{initials}</span>
    </div>
  );
};

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every 30 seconds instead of every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const getTimeString = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDateString = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, [logout, navigate]);

  const closeAllMenus = useCallback(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, []);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  // Close menus when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-user-menu]')) setMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0c10]/95 backdrop-blur-xl transition-all duration-300 safe-area-top">
      <div className="mx-auto w-full px-2 py-2.5 sm:px-4 sm:py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center gap-1.5 transition hover:opacity-90 sm:gap-2 md:gap-3" onClick={closeAllMenus}>
            <img
              src="/logo.png"
              alt="Document Finder"
              className="h-8 w-8 object-contain sm:h-9 sm:w-9 md:h-10 md:w-10"
            />
            <div className="hidden flex-col sm:flex">
              <p className="text-xs font-bold uppercase tracking-widest text-white sm:text-xs md:text-sm">Document Finder</p>
              <p className="text-xs font-semibold text-primary">Powered by Tesla</p>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMenuOpen(false); }}
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 md:hidden touch-manipulation tap-highlight"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex lg:gap-6">
            <Link to="/" className="text-xs font-medium text-slate-300 transition hover:text-white md:text-sm">
              Dashboard
            </Link>
            <Link to="/profile" className="text-xs font-medium text-slate-300 transition hover:text-white md:text-sm">
              Profile
            </Link>
            {isAdmin && (
              <Link to="/users" className="text-xs font-medium text-slate-300 transition hover:text-white md:text-sm">
                Users
              </Link>
            )}
          </nav>

          {/* Right Section - Clock and User */}
          <div className="hidden items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 md:flex">
            <div className="hidden flex-col items-end text-right sm:flex">
              <p className="text-xs font-mono font-bold text-primary md:text-sm">{getTimeString()}</p>
              <p className="hidden text-xs text-slate-400 md:block">{getDateString()}</p>
            </div>

            {/* User Menu */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-1.5 py-1 transition hover:bg-white/10 sm:gap-2 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 touch-manipulation tap-highlight"
                aria-label="User menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <Avatar photoUrl={user?.photoUrl} initials={initials} size="sm" />
                <span className="hidden text-xs font-semibold text-white sm:inline md:text-sm">{user?.firstName}</span>
                <svg
                  className={`h-3 w-3 text-slate-400 transition sm:h-4 sm:w-4 ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-white/10 bg-[#15161b]/95 shadow-xl backdrop-blur-xl sm:w-48 md:w-56 md:rounded-2xl animate-slide-down" role="menu">
                  <div className="border-b border-white/5 p-2.5 sm:p-3 md:p-4">
                    <p className="truncate text-xs font-semibold text-white sm:text-sm">{user?.name}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    <div className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold uppercase text-primary">
                      {user?.role}
                    </div>
                  </div>

                  <div className="space-y-0.5 p-1.5 sm:p-2">
                    <button
                      onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3 sm:py-2 md:text-sm touch-manipulation"
                      role="menuitem"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { navigate('/'); setMenuOpen(false); }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3 sm:py-2 md:text-sm touch-manipulation"
                      role="menuitem"
                    >
                      Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate('/users'); setMenuOpen(false); }}
                        className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3 sm:py-2 md:text-sm touch-manipulation"
                        role="menuitem"
                      >
                        Manage Users
                      </button>
                    )}
                  </div>

                  <div className="border-t border-white/5 p-1.5 sm:p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10 sm:px-3 sm:py-2 md:text-sm touch-manipulation"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeAllMenus}
            aria-hidden="true"
          />

          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[#15161b] shadow-xl animate-slide-left safe-area-top safe-area-bottom">
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Avatar photoUrl={user?.photoUrl} initials={initials} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={closeAllMenus}
                  className="rounded-lg p-2 text-slate-400 transition hover:text-white touch-manipulation tap-highlight"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Nav */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  <Link to="/" onClick={closeAllMenus} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white touch-manipulation">
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={closeAllMenus} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white touch-manipulation">
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/users" onClick={closeAllMenus} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white touch-manipulation">
                      Manage Users
                    </Link>
                  )}
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="border-t border-white/10 p-4">
                <div className="mb-4 text-center">
                  <p className="text-xs font-mono font-bold text-primary">{getTimeString()}</p>
                  <p className="text-xs text-slate-400">{getDateString()}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 touch-manipulation"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
