import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { forgotPassword, resetPassword, verifyResetCode } from '../services/auth.api.js';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState('request');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const emailAddress = email.trim();
  const canRequestCode = Boolean(emailAddress) && !isLoading;
  const canVerifyCode = Boolean(emailAddress) && code.length === 6 && !isLoading;
  const canResetPassword =
    Boolean(emailAddress) &&
    Boolean(resetToken) &&
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    !isLoading;

  async function handleRequestCode(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNotice(null);
    try {
      await forgotPassword({ email: emailAddress });
      setCode('');
      setPassword('');
      setConfirmPassword('');
      setResetToken('');
      setStep('verify');
      setNotice('Enter the 6-digit code sent to your inbox.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    setIsLoading(true);
    setError(null);
    setNotice(null);
    try {
      await forgotPassword({ email: emailAddress });
      setCode('');
      setResetToken('');
      setNotice('A new code was sent if that email is registered.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);
    try {
      const result = await verifyResetCode({ email: emailAddress, code });
      setResetToken(result.resetToken);
      setCode('');
      setStep('reset');
      setNotice('Email verified. Choose a new password.');
    } catch (err) {
      setError(err.message || 'Could not verify the code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ email: emailAddress, resetToken, password });
      setStep('done');
      setPassword('');
      setConfirmPassword('');
      setResetToken('');
    } catch (err) {
      setError(err.message || 'Could not reset your password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCodeChange(e) {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  }

  if (step === 'done') {
    return (
      <AuthShell title="Password reset">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-bold text-text">Password Updated</h1>
          <p className="text-sm text-muted">
            Your password has been reset. You can now sign in with your new
            password.
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

  if (step === 'verify') {
    return (
      <AuthShell title="Verify your email">
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-text">Enter Verification Code</h1>
            <p className="text-sm text-muted">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-text">{emailAddress}</span>.
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
              {notice}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <Input
              id="reset-code"
              label="Verification Code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="123456"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              isDisabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              isDisabled={!canVerifyCode}
              className="w-full"
            >
              Verify Code
            </Button>

            <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setError(null);
                  setNotice(null);
                  setCode('');
                  setResetToken('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="font-bold uppercase tracking-widest hover:text-primary transition-colors"
                disabled={isLoading}
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="font-bold uppercase tracking-widest hover:text-primary transition-colors disabled:opacity-50"
                disabled={!emailAddress || isLoading}
              >
                Resend Code
              </button>
            </div>
          </div>
        </form>
      </AuthShell>
    );
  }

  if (step === 'reset') {
    return (
      <AuthShell title="Create new password">
        <form onSubmit={handleResetPassword} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-text">Set New Password</h1>
            <p className="text-sm text-muted">
              Your email is verified. Create a new password for{' '}
              <span className="font-medium text-text">{emailAddress}</span>.
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
              {notice}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <Input
              id="reset-password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              isDisabled={isLoading}
            />

            <Input
              id="reset-confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
              minLength={8}
              isDisabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              isDisabled={!canResetPassword}
              className="w-full"
            >
              Reset Password
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep('verify');
                setResetToken('');
                setPassword('');
                setConfirmPassword('');
                setError(null);
                setNotice(null);
              }}
              className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
              disabled={isLoading}
            >
              Use A Different Code
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset password">
      <form onSubmit={handleRequestCode} className="flex flex-col gap-4" noValidate>
        <h1 className="text-xl font-bold text-text">Reset Password</h1>
        <p className="text-sm text-muted">
          Enter the email address associated with your account and we&apos;ll send
          a verification code to confirm it belongs to you.
        </p>

        {error && (
          <p className="rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm text-error" role="alert">
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
          isDisabled={!canRequestCode}
        >
          Send Verification Code
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

