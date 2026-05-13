import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { forgotPassword } from '../services/auth.api.js';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-bold text-text">Check Your Email</h1>
          <p className="text-sm text-muted">
            If an account exists for <span className="font-medium text-text">{email}</span>,
            we&apos;ve sent a password reset link. Check your inbox and follow the
            instructions to reset your password.
          </p>
          <Link
            to="/login"
            className="rounded-md text-sm font-medium text-primary underline hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <h1 className="text-xl font-bold text-text">Reset Password</h1>
        <p className="text-sm text-muted">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password.
        </p>

        {error && (
          <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <Input
          id="forgot-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          isDisabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          isDisabled={!email}
        >
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-muted">
          Remember your password?{' '}
          <Link
            to="/login"
            className="rounded-md font-medium text-primary underline hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default ForgotPasswordPage;

