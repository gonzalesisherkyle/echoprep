import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TranscriptBlock } from './TranscriptBlock.jsx';

describe('TranscriptBlock – rendering (Req 9.3)', () => {
  const defaultProps = {
    transcript: 'I have experience leading cross-functional teams.',
    speechMetrics: { wpm: 142, fillerWordCount: 3, confidenceScore: 0.87 },
  };

  it('renders the transcript text', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(
      screen.getByText('I have experience leading cross-functional teams.')
    ).toBeTruthy();
  });

  it('renders WPM as a rounded integer with label', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(screen.getByText('142 WPM')).toBeTruthy();
  });

  it('renders filler word count', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(screen.getByText('3 filler words')).toBeTruthy();
  });

  it('renders confidence score as a percentage', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(screen.getByText('87% confidence')).toBeTruthy();
  });

  it('uses singular "word" when fillerWordCount is 1', () => {
    const props = {
      transcript: 'Some text.',
      speechMetrics: { wpm: 100, fillerWordCount: 1, confidenceScore: 0.5 },
    };
    render(<TranscriptBlock {...props} />);
    expect(screen.getByText('1 filler word')).toBeTruthy();
  });

  it('renders 0 filler words with success tone', () => {
    const props = {
      transcript: 'Clean speech.',
      speechMetrics: { wpm: 120, fillerWordCount: 0, confidenceScore: 0.95 },
    };
    render(<TranscriptBlock {...props} />);
    expect(screen.getByText('0 filler words')).toBeTruthy();
  });

  it('rounds confidence score to nearest integer percentage', () => {
    const props = {
      transcript: 'Test.',
      speechMetrics: { wpm: 100, fillerWordCount: 0, confidenceScore: 0.456 },
    };
    render(<TranscriptBlock {...props} />);
    expect(screen.getByText('46% confidence')).toBeTruthy();
  });

  it('renders the Transcript heading', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(screen.getByText('Transcript')).toBeTruthy();
  });

  it('renders the Speech Metrics heading', () => {
    render(<TranscriptBlock {...defaultProps} />);
    expect(screen.getByText('Speech Metrics')).toBeTruthy();
  });
});

