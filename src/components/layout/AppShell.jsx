import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { Button } from '../ui/Button.jsx';
import { Footer } from './Footer.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sessions/new', label: 'New Session' },
  { to: '/settings', label: 'Settings' },
];

function navLinkClass({ isActive }) {
  const base = 'relative px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-md';
  return isActive
    ? `${base} text-primary bg-primary/5`
    : `${base} text-muted hover:text-text hover:bg-white/5`;
}

function ThemeGlyph({ theme }) {
  if (theme === 'dark') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function AppShell({ children }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-text selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 relative">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex flex-col transition-transform active:scale-95">
              <span className="text-xl font-bold tracking-tight text-text">
                EchoPrep
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={navLinkClass} end>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-8 h-8 p-0">
              <ThemeGlyph theme={theme} />
            </Button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={logout} className="h-7 md:h-8 text-[10px] md:text-[11px] px-2 md:px-3">
                Sign Out
              </Button>
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-text hover:bg-white/5 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>

            {isMenuOpen && (
              <nav className="absolute top-[110%] right-4 w-48 py-2 md:hidden bg-surface-container rounded-xl shadow-2xl animate-in slide-in-from-top duration-200 z-[100] ring-1 ring-white/10">
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => 
                          `block w-full px-4 py-2 text-sm font-bold transition-colors ${
                            isActive ? 'text-primary' : 'text-muted hover:text-text hover:bg-white/5'
                          }`
                        }
                        end
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-10">
        {children}
      </main>

      <Footer />

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AppShell;

