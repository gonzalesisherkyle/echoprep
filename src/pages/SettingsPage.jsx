import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import * as userApi from '../services/user.api.js';

function Toggle({ id, label, description, checked, onChange, isDisabled = false }) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center justify-between gap-4 p-3 rounded-lg transition-all duration-200
        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
      `}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-text">{label}</span>
        {description && (
          <span className="text-[11px] text-muted leading-relaxed max-w-[240px]">{description}</span>
        )}
      </div>

      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={isDisabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`h-5 w-10 rounded-full border-2 transition-all ${checked ? 'bg-primary/20 border-primary' : 'bg-surface-container-highest border-white/10'}`} />
        <div className={`absolute top-1 h-3 w-3 rounded-full transition-all ${checked ? 'left-6 bg-primary' : 'left-1 bg-muted'}`} />
      </div>
    </label>
  );
}

function FeedbackBanner({ type, message }) {
  const isSuccess = type === 'success';
  return (
    <div className={`rounded-lg border px-4 py-2 text-xs font-medium ${isSuccess ? 'border-primary/20 bg-primary/5 text-primary' : 'border-error/20 bg-error/5 text-error'}`}>
      {isSuccess ? '✓' : '!'} {message}
    </div>
  );
}

export function SettingsPage() {
  const [remote, setRemote] = useState(null);
  const [name, setName] = useState('');
  const [reminders, setReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProfile() {
      setIsFetching(true);
      try {
        const data = await userApi.getProfile();
        if (cancelled) return;
        const profile = data?.data ?? data;
        setRemote(profile);
        setName(profile.name ?? '');
        setReminders(profile.emailPreferences?.reminders ?? true);
        setWeeklyReport(profile.emailPreferences?.weeklyReport ?? true);
      } catch (err) {
        if (!cancelled) setFetchError(err.message || 'Failed to load profile.');
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    }
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFeedback(null);
    const patch = {};
    if (name !== (remote?.name ?? '')) patch.name = name;
    if (reminders !== (remote?.emailPreferences?.reminders ?? true) || weeklyReport !== (remote?.emailPreferences?.weeklyReport ?? true)) {
      patch.emailPreferences = { reminders, weeklyReport };
    }
    if (Object.keys(patch).length === 0) {
      setFeedback({ type: 'success', message: 'No changes detected.' });
      return;
    }
    setIsSaving(true);
    try {
      const data = await userApi.updateProfile(patch);
      setRemote(data?.data ?? data);
      setFeedback({ type: 'success', message: 'Preferences saved.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  }, [remote, name, reminders, weeklyReport]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl flex flex-col gap-8 md:gap-10">
        <header className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Preferences</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">Account</h1>
        </header>

        {isFetching ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary" /></div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card padding="md" className="flex flex-col gap-5">
                  <h2 className="text-sm font-bold text-text uppercase tracking-widest text-primary">Identity</h2>
                  <Input id="settings-name" label="Display Name" type="text" value={name} onChange={(e) => setName(e.target.value)} isDisabled={isSaving} />
               </Card>
               <Card padding="md" className="bg-primary/5 border-primary/10">
                  <h2 className="text-sm font-bold text-text mb-2">Practice Insights</h2>
                  <p className="text-xs text-muted leading-relaxed">Your profile data helps us personalize your interview experience and track progress over time.</p>
               </Card>
            </div>

            <Card padding="md" className="flex flex-col gap-4">
              <h2 className="text-sm font-bold text-text uppercase tracking-widest text-primary">Communication</h2>
              <div className="flex flex-col gap-1">
                <Toggle id="settings-reminders" label="Daily Reminders" description="Notifications to keep your practice streak alive." checked={reminders} onChange={setReminders} isDisabled={isSaving} />
                <Toggle id="settings-weekly-report" label="Weekly Report" description="Summary of your performance and growth areas." checked={weeklyReport} onChange={setWeeklyReport} isDisabled={isSaving} />
              </div>
            </Card>

            {feedback && <FeedbackBanner type={feedback.type} message={feedback.message} />}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} isDisabled={isSaving} className="w-full sm:w-auto min-w-[140px]">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}

export default SettingsPage;

