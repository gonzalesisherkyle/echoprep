import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';

// Mocks — isolate SessionRunPage from external dependencies

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ sessionId: 'test-session-id' }),
  useNavigate: () => mockNavigate,
}));

// Mock useSession — return a session with one question so the page renders
vi.mock('../../src/hooks/useSession.js', () => ({
  useSession: () => ({
    session: { _id: 'test-session-id', status: 'in_progress' },
    questions: [{ _id: 'q1', text: 'Tell me about yourself', type: 'behavioral', order: 1 }],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Mock useAnswerUpload
vi.mock('../../src/hooks/useAnswerUpload.js', () => ({
  useAnswerUpload: () => ({
    upload: vi.fn().mockResolvedValue(undefined),
    isUploading: false,
    error: null,
    lastAnswerId: null,
  }),
}));

// Mock useScoring
vi.mock('../../src/hooks/useScoring.js', () => ({
  useScoring: () => ({
    evaluate: vi.fn().mockResolvedValue(undefined),
    isScoring: false,
    error: null,
  }),
}));

// Mock usePrefersReducedMotion
vi.mock('../../src/hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => false,
}));

// Capture the onRecorded callback from AudioRecorder
let capturedOnRecorded = null;
vi.mock('../../src/components/session/AudioRecorder.jsx', () => ({
  AudioRecorder: ({ onRecorded, isDisabled }) => {
    capturedOnRecorded = onRecorded;
    return (
      <div data-testid="audio-recorder" data-disabled={isDisabled}>
        Mock AudioRecorder
      </div>
    );
  },
}));

// Mock QuestionCard
vi.mock('../../src/components/session/QuestionCard.jsx', () => ({
  QuestionCard: ({ question }) => (
    <div data-testid="question-card">{question.text}</div>
  ),
}));

// Mock AppShell
vi.mock('../../src/components/layout/AppShell.jsx', () => ({
  AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));

// Mock Card
vi.mock('../../src/components/ui/Card.jsx', () => ({
  Card: ({ children }) => <div>{children}</div>,
}));

// Mock Button — render a real button so we can check disabled state
vi.mock('../../src/components/ui/Button.jsx', () => ({
  Button: ({ children, isDisabled, onClick, ...props }) => (
    <button disabled={isDisabled} onClick={onClick} data-testid="upload-btn">
      {children}
    </button>
  ),
}));

// Import the component under test AFTER mocks are set up
import { SessionRunPage } from '../../src/pages/SessionRunPage.jsx';

// Constants matching the implementation
const MIN_DURATION_MS = 2_000;
const MAX_DURATION_MS = 300_000;

// **Validates: Requirements 7.5**

describe('Property 19: Duration bounds enforcement', () => {
  beforeEach(() => {
    capturedOnRecorded = null;
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('for any durationMs < 2000, a validation message is displayed and upload is prevented', () => {
    fc.assert(
      fc.property(
        // Generate durations strictly less than MIN_DURATION_MS (0 to 1999)
        fc.integer({ min: 0, max: MIN_DURATION_MS - 1 }),
        (durationMs) => {
          const { unmount } = render(<SessionRunPage />);

          // Simulate a recording with the generated duration
          const fakeBlob = new Blob(['audio-data'], { type: 'audio/webm' });
          act(() => {
            capturedOnRecorded(fakeBlob, durationMs);
          });

          // A validation error message should be displayed
          const alert = screen.getByRole('alert');
          expect(alert).toBeDefined();
          expect(alert.textContent).toContain('too short');

          // The upload button should be disabled (prevented from uploading)
          const uploadBtn = screen.queryByTestId('upload-btn');
          if (uploadBtn) {
            expect(uploadBtn.disabled).toBe(true);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any durationMs > 300000, a validation message is displayed and upload is prevented', () => {
    fc.assert(
      fc.property(
        // Generate durations strictly greater than MAX_DURATION_MS
        fc.integer({ min: MAX_DURATION_MS + 1, max: 1_000_000 }),
        (durationMs) => {
          const { unmount } = render(<SessionRunPage />);

          // Simulate a recording with the generated duration
          const fakeBlob = new Blob(['audio-data'], { type: 'audio/webm' });
          act(() => {
            capturedOnRecorded(fakeBlob, durationMs);
          });

          // A validation error message should be displayed
          const alert = screen.getByRole('alert');
          expect(alert).toBeDefined();
          expect(alert.textContent).toContain('too long');

          // The upload button should be disabled (prevented from uploading)
          const uploadBtn = screen.queryByTestId('upload-btn');
          if (uploadBtn) {
            expect(uploadBtn.disabled).toBe(true);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any durationMs in [2000, 300000], no validation error is shown and upload is allowed', () => {
    fc.assert(
      fc.property(
        // Generate durations within the valid range [MIN_DURATION_MS, MAX_DURATION_MS]
        fc.integer({ min: MIN_DURATION_MS, max: MAX_DURATION_MS }),
        (durationMs) => {
          const { unmount } = render(<SessionRunPage />);

          // Simulate a recording with the generated duration
          const fakeBlob = new Blob(['audio-data'], { type: 'audio/webm' });
          act(() => {
            capturedOnRecorded(fakeBlob, durationMs);
          });

          // No validation error should be displayed
          const alert = screen.queryByRole('alert');
          expect(alert).toBeNull();

          // The upload button should be present and enabled
          const uploadBtn = screen.getByTestId('upload-btn');
          expect(uploadBtn).toBeDefined();
          expect(uploadBtn.disabled).toBe(false);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

