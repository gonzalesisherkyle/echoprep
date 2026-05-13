import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScoreCard } from './ScoreCard.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { EmptyState } from './EmptyState.jsx';

// ScoreCard

describe('ScoreCard – reduced motion (Req 20.8)', () => {
  it('displays the final score immediately when isReducedMotion=true', () => {
    render(<ScoreCard label="Overall" score={75} isReducedMotion={true} />);
    expect(screen.getByText('75')).toBeTruthy();
  });

  it('renders the label text', () => {
    render(<ScoreCard label="Clarity" score={50} isReducedMotion={true} />);
    expect(screen.getByText('Clarity')).toBeTruthy();
  });

  it('shows score 0 immediately when score=0 and isReducedMotion=true', () => {
    render(<ScoreCard label="Score" score={0} isReducedMotion={true} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('shows score 100 immediately when score=100 and isReducedMotion=true', () => {
    render(<ScoreCard label="Score" score={100} isReducedMotion={true} />);
    expect(screen.getByText('100')).toBeTruthy();
  });
});

describe('ScoreCard – count-up animation (Req 20.7)', () => {
  let rafCallbacks;
  let rafId;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;

    // Stub requestAnimationFrame to collect callbacks without auto-running them.
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      rafId += 1;
      rafCallbacks.push({ id: rafId, cb });
      return rafId;
    });

    vi.stubGlobal('cancelAnimationFrame', (id) => {
      rafCallbacks = rafCallbacks.filter((entry) => entry.id !== id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts at 0 before any animation frame fires', () => {
    render(<ScoreCard label="Score" score={80} isReducedMotion={false} />);
    // The initial state is 0 before any rAF fires.
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('reaches the final score after the animation completes (~600ms)', async () => {
    render(<ScoreCard label="Score" score={60} isReducedMotion={false} />);

    // Drive the animation to completion by simulating timestamps past 600ms.
    await act(async () => {
      // First frame: t=0 (sets startTime)
      const firstBatch = [...rafCallbacks];
      rafCallbacks = [];
      firstBatch.forEach(({ cb }) => cb(0));

      // Second frame: t=700ms (past 600ms duration → progress=1 → final value)
      const secondBatch = [...rafCallbacks];
      rafCallbacks = [];
      secondBatch.forEach(({ cb }) => cb(700));
    });

    expect(screen.getByText('60')).toBeTruthy();
  });

  it('shows an intermediate value during animation', async () => {
    render(<ScoreCard label="Score" score={100} isReducedMotion={false} />);

    await act(async () => {
      // First frame: establishes startTime=0
      const first = [...rafCallbacks];
      rafCallbacks = [];
      first.forEach(({ cb }) => cb(0));

      // Second frame: t=300ms → 50% through 600ms → eased ~87.5 (ease-out cubic)
      const second = [...rafCallbacks];
      rafCallbacks = [];
      second.forEach(({ cb }) => cb(300));
    });

    // The displayed value should be between 0 and 100 (exclusive) at 300ms.
    const scoreEl = screen.getByText(/^\d+$/);
    const val = parseInt(scoreEl.textContent, 10);
    expect(val).toBeGreaterThan(0);
    expect(val).toBeLessThan(100);
  });
});

describe('ScoreCard – accessibility', () => {
  it('has aria-live="polite" on the score element', () => {
    render(<ScoreCard label="Score" score={42} isReducedMotion={true} />);
    const liveEl = document.querySelector('[aria-live="polite"]');
    expect(liveEl).toBeTruthy();
  });

  it('has aria-atomic="true" on the score element', () => {
    render(<ScoreCard label="Score" score={42} isReducedMotion={true} />);
    const atomicEl = document.querySelector('[aria-atomic="true"]');
    expect(atomicEl).toBeTruthy();
  });
});

// ProgressBar

describe('ProgressBar – rendering', () => {
  it('renders with correct ARIA attributes', () => {
    render(<ProgressBar value={40} ariaLabel="Upload progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeTruthy();
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-label')).toBe('Upload progress');
  });

  it('renders an optional label text', () => {
    render(<ProgressBar value={60} label="Completion" ariaLabel="Completion progress" />);
    expect(screen.getByText('Completion')).toBeTruthy();
  });

  it('does not render a label element when label prop is omitted', () => {
    render(<ProgressBar value={60} ariaLabel="Progress" />);
    // No span with label text should appear.
    expect(screen.queryByText('Completion')).toBeNull();
  });

  it('clamps value above 100 to 100', () => {
    render(<ProgressBar value={150} ariaLabel="Clamped" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamps value below 0 to 0', () => {
    render(<ProgressBar value={-10} ariaLabel="Clamped" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('renders value=0 correctly', () => {
    render(<ProgressBar value={0} ariaLabel="Empty" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('renders value=100 correctly', () => {
    render(<ProgressBar value={100} ariaLabel="Full" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });
});

// EmptyState

describe('EmptyState – rendering', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No sessions yet" description="Start your first practice session." />);
    expect(screen.getByText('No sessions yet')).toBeTruthy();
    expect(screen.getByText('Start your first practice session.')).toBeTruthy();
  });

  it('renders the icon when provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="Nothing here."
        icon={<span data-testid="icon">📭</span>}
      />
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('does not render an icon container when icon is omitted', () => {
    render(<EmptyState title="Empty" description="Nothing here." />);
    // No icon wrapper div should be present.
    expect(screen.queryByTestId('icon')).toBeNull();
  });

  it('renders a CTA button when ctaLabel and onCta are provided', () => {
    const handleCta = vi.fn();
    render(
      <EmptyState
        title="Empty"
        description="Nothing here."
        ctaLabel="Get started"
        onCta={handleCta}
      />
    );
    expect(screen.getByRole('button', { name: 'Get started' })).toBeTruthy();
  });

  it('does not render a CTA button when ctaLabel is omitted', () => {
    render(<EmptyState title="Empty" description="Nothing here." onCta={() => {}} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does not render a CTA button when onCta is omitted', () => {
    render(<EmptyState title="Empty" description="Nothing here." ctaLabel="Go" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onCta when the CTA button is clicked', async () => {
    const handleCta = vi.fn();
    const { getByRole } = render(
      <EmptyState
        title="Empty"
        description="Nothing here."
        ctaLabel="Start"
        onCta={handleCta}
      />
    );
    await act(async () => {
      getByRole('button', { name: 'Start' }).click();
    });
    expect(handleCta).toHaveBeenCalledTimes(1);
  });
});

