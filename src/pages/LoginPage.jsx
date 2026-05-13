import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch { }
  }

  return (
    <AuthShell title="Welcome back">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {error && (
          <div className="rounded border border-error/20 bg-error/5 px-3 py-2 text-xs text-error font-medium" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Input
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            isDisabled={isLoading}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              isDisabled={isLoading}
            />
            <div className="flex justify-end">
               <Link to="/forgot-password" size="sm" className="text-[10px] uppercase font-bold text-muted hover:text-primary transition-colors">
                Forgot?
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            isDisabled={!email || !password}
            className="w-full"
          >
            Sign In
          </Button>

          <p className="text-center text-[11px] text-muted">
            New here?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

export default LoginPage;

