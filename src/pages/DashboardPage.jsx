import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { StreakTracker } from '../components/dashboard/StreakTracker.jsx';
import { ProgressChart } from '../components/dashboard/ProgressChart.jsx';
import { SessionHistoryList } from '../components/dashboard/SessionHistoryList.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useReports } from '../hooks/useReports.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';
import { listSessions } from '../services/session.api.js';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, isLoading: reportsLoading, error: reportsError } = useReports();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSessions() {
      setSessionsLoading(true);
      setSessionsError(null);
      try {
        const data = await listSessions();
        if (!cancelled) setSessions(data);
      } catch (err) {
        if (!cancelled) setSessionsError(err);
      } finally {
        if (!cancelled) setSessionsLoading(false);
      }
    }
    fetchSessions();
    return () => { cancelled = true; };
  }, []);

  const isLoading = sessionsLoading || reportsLoading;
  const fetchError = sessionsError || reportsError;
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const hasCompletedSessions = completedSessions.length > 0;
  const recentSessions = sessions.slice(0, 5);

  const chartPoints = completedSessions
    .slice(0, 10)
    .reverse()
    .map((s) => ({
      date: new Date(s.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric',
      }),
      score: s.overallScore,
    }));

  const feedbackHistory = reports.flatMap((r) => r.topFeedback ?? []).slice(0, 8);

  return (
    <AppShell>
      <div className="flex flex-col gap-8 md:gap-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Welcome, <span className="text-primary">{user?.name?.split(' ')[0] || 'Explorer'}</span>
            </h1>
            <p className="text-sm text-muted mt-1">
              Your interview performance at a glance.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => navigate('/sessions/new')} className="w-full md:w-auto">
            Start New Session
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StreakTracker
            streakCount={user?.streakCount ?? 0}
            lastActiveDate={user?.lastActiveDate ?? null}
          />
          <Card padding="lg" className="md:col-span-2 flex flex-col justify-center relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-300">
            {/* Ambient Background Gradient Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-300 pointer-events-none" />
            
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Average Score</p>
                <h3 className="text-4xl font-bold text-text tracking-tight flex items-baseline gap-1">
                  <span>
                    {completedSessions.length > 0 
                      ? Math.round(completedSessions.reduce((acc, s) => acc + s.overallScore, 0) / completedSessions.length)
                      : 0}
                  </span>
                  <span className="text-xl text-muted font-semibold">%</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full border border-primary/35 bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shadow-[0_0_15px_rgba(107,216,203,0.15)] tracking-wider">
                AI
              </div>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : fetchError ? (
          <Card className="border-error/20 bg-error/5 py-4">
            <p className="text-error text-xs font-medium">Unable to load dashboard. Please refresh.</p>
          </Card>
        ) : !hasCompletedSessions ? (
          <EmptyState
            title="Ready to start?"
            description="Complete your first mock interview to see your progress here."
            ctaLabel="Start Session"
            onCta={() => navigate('/sessions/new')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              <Card padding="md" className="border-white/5 bg-surface-container-low/50 backdrop-blur-md">
                <h3 className="text-base font-bold text-text mb-6">Score History</h3>
                <ProgressChart
                  points={chartPoints}
                  isReducedMotion={prefersReducedMotion}
                />
              </Card>

              <Card padding="md" className="border-white/5 bg-surface-container-low/50 backdrop-blur-md">
                 <h3 className="text-base font-bold text-text mb-4">Recent Activity</h3>
                 <SessionHistoryList
                  sessions={recentSessions}
                  onOpen={(id) => navigate(`/sessions/${id}/review`)}
                />
              </Card>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
               <Card padding="md" className="bg-primary/5 border-primary/10">
                 <h3 className="text-base font-bold text-text mb-2">Next Steps</h3>
                 <p className="text-xs text-muted leading-relaxed">
                   Consistency is key. Aim for <strong>one session per day</strong> to maximize your growth and retain confidence.
                 </p>
               </Card>

               {feedbackHistory.length > 0 && (
                <Card padding="md" className="border-white/5 bg-surface-container-low/50 backdrop-blur-md">
                  <h3 className="text-base font-bold text-text mb-4">Key Insights</h3>
                  <ul className="flex flex-col gap-3" role="list">
                    {feedbackHistory.map((feedback, index) => (
                      <li key={index} className="flex gap-2 text-xs text-muted leading-relaxed">
                        <span className="text-primary font-bold">•</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default DashboardPage;
