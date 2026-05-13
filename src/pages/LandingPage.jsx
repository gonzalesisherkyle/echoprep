import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

const FEATURES = [
  {
    title: 'AI Questions',
    description: 'Paste a job description and get role-specific interview questions tailored to the position.',
    icon: '🎯'
  },
  {
    title: 'Speak Out Loud',
    description: 'Record your answers in the browser. No extra software needed — just your voice.',
    icon: '🎙️'
  },
  {
    title: 'Instant Feedback',
    description: 'Get scored on clarity, relevance, and confidence with actionable improvement tips.',
    icon: '⚡'
  },
  {
    title: 'Progress Tracking',
    description: 'Build a daily practice streak and watch your scores improve over time.',
    icon: '📈'
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch { }
  }

  return (
    <AppShell>
      <div className="relative flex flex-col items-center gap-16 md:gap-24 py-8 md:py-16 overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/5 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-secondary/5 blur-[100px] rounded-full -z-10" />

        {/* Hero Section: Split Layout on Desktop */}
        <section className="w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Side: Branding and Value Prop */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-2">
              AI-Powered Preparation
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-text leading-tight tracking-tight">
              Practice out loud.<br />
              <span className="text-primary">Land the role.</span>
            </h1>
            
            <p className="max-w-xl text-base md:text-lg text-muted leading-relaxed">
              EchoPrep turns any job description into a realistic mock interview.
              Record spoken answers, get AI scoring, and build confidence.
            </p>



            <div className="lg:hidden flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:min-w-[180px]">
                  Start Practicing
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:min-w-[180px]">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side: Quick Login Form (Visible on Desktop) */}
          <div className="hidden lg:block w-full max-w-[400px]">
            <Card padding="lg" className="shadow-2xl shadow-primary/5 border-white/10 bg-surface/50 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold tracking-tight">Welcome back</h2>
                  <p className="text-[11px] text-muted">Sign in to resume your preparation.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded border border-error/20 bg-error/5 px-3 py-2 text-[11px] text-error font-medium" role="alert">
                      {error}
                    </div>
                  )}

                  <Input
                    id="landing-email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    isDisabled={isLoading}
                    className="h-10"
                  />

                  <div className="flex flex-col gap-1.5">
                    <Input
                      id="landing-password"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      isDisabled={isLoading}
                      className="h-10"
                    />
                    <div className="flex justify-end">
                      <Link to="/forgot-password" size="sm" className="text-[9px] uppercase font-bold text-muted hover:text-primary transition-colors">
                        Forgot?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    isDisabled={!email || !password}
                    className="w-full mt-2 shadow-lg shadow-primary/20"
                  >
                    Sign In
                  </Button>

                  <div className="relative flex items-center gap-4 my-1">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <p className="text-center text-[11px] text-muted">
                    New here?{' '}
                    <Link to="/register" className="text-primary font-bold hover:underline">
                      Create account
                    </Link>
                  </p>
                </form>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl px-4" aria-labelledby="features-heading">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-text mb-3">
              Master the Interview
            </h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              Everything you need to improve your speaking skills in one place.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} padding="md" className="flex flex-col gap-3 hover:border-primary/30 transition-colors group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-bold text-text">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="w-full max-w-2xl px-4">
          <Card padding="lg" className="text-center flex flex-col items-center gap-6 border-primary/10 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl -ml-16 -mt-16" />
            <h2 className="text-xl md:text-2xl font-bold text-text relative z-10">
              Ready to crush your next interview?
            </h2>
            <Link to="/register" className="relative z-10">
              <Button variant="primary" size="lg" className="shadow-xl shadow-primary/20">
                Create Free Account
              </Button>
            </Link>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

export default LandingPage;
