import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { Footer } from './Footer.jsx';
import { LandingSidebar } from './LandingSidebar.jsx';

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

export function AuthShell({ children, title = "Welcome back" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-text overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[80px]" />
         <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="flex flex-1 flex-col lg:flex-row h-screen lg:overflow-hidden">
        {/* Left Side: Landing Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[60%] border-r border-white/5 bg-surface/50 backdrop-blur-3xl relative">
          <LandingSidebar />
        </div>

        {/* Right Side: Auth Form */}
        <main className="flex flex-1 items-center justify-center px-6 py-8 lg:px-12 xl:px-24 overflow-y-auto">
          <div className="flex w-full max-w-[400px] flex-col gap-6">
            <div className="lg:hidden flex items-center justify-between mb-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-on font-bold">E</div>
                <span className="text-xl font-bold tracking-tight text-text">EchoPrep</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-8 h-8 p-0">
                <ThemeGlyph theme={theme} />
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">Secure Portal</span>
              <h2 className="text-3xl font-bold tracking-tight leading-tight">{title}</h2>
              <p className="text-xs text-muted">Join thousands of candidates preparing for their dream role.</p>
            </div>

            <Card padding="md" className="w-full shadow-2xl shadow-primary/5 border-white/10 bg-surface/80 backdrop-blur-xl">
              <div className="w-full">{children}</div>
            </Card>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-muted max-w-[200px] leading-relaxed">
                By continuing, you agree to our 
                <span className="text-text hover:text-primary cursor-pointer transition-colors px-1 font-medium">Terms</span> 
                and 
                <span className="text-text hover:text-primary cursor-pointer transition-colors px-1 font-medium">Privacy</span>.
              </p>
              <div className="hidden lg:block">
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-8 h-8 p-0 opacity-50 hover:opacity-100 transition-opacity">
                  <ThemeGlyph theme={theme} />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default AuthShell;
