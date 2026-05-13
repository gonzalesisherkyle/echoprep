import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch { }
  }

  return (
    <AuthShell title="Create account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {error && (
          <div className="rounded border border-error/20 bg-error/5 px-3 py-2 text-xs text-error font-medium" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Input
            id="reg-name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            isDisabled={isLoading}
          />

          <Input
            id="reg-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            isDisabled={isLoading}
          />

          <Input
            id="reg-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            isDisabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            isDisabled={!name || !email || !password}
            className="w-full"
          >
            Sign Up
          </Button>

          <p className="text-center text-[11px] text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;

