import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedbackPanel } from './FeedbackPanel.jsx';

describe('FeedbackPanel – rendering (Req 10.2)', () => {
  it('renders the feedback summary as a paragraph', () => {
    const feedback = {
      summary: 'Your answer was clear and well-structured.',
      improvementTips: [],
    };
    render(<FeedbackPanel feedback={feedback} />);
    expect(screen.getByText('Your answer was clear and well-structured.')).toBeTruthy();
  });

  it('renders improvement tips as a bulleted list', () => {
    const feedback = {
      summary: 'Good effort.',
      improvementTips: ['Be more concise', 'Add specific examples'],
    };
    render(<FeedbackPanel feedback={feedback} />);
    expect(screen.getByText('Be more concise')).toBeTruthy();
    expect(screen.getByText('Add specific examples')).toBeTruthy();
    // Verify list items are rendered
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  it('does not render the tips section when improvementTips is empty', () => {
    const feedback = {
      summary: 'Perfect answer.',
      improvementTips: [],
    };
    render(<FeedbackPanel feedback={feedback} />);
    expect(screen.queryByText('Improvement Tips')).toBeNull();
  });

  it('renders the Feedback Summary heading', () => {
    const feedback = {
      summary: 'Some summary.',
      improvementTips: ['Tip one'],
    };
    render(<FeedbackPanel feedback={feedback} />);
    expect(screen.getByText('Feedback Summary')).toBeTruthy();
  });

  it('renders the Improvement Tips heading when tips exist', () => {
    const feedback = {
      summary: 'Some summary.',
      improvementTips: ['Tip one'],
    };
    render(<FeedbackPanel feedback={feedback} />);
    expect(screen.getByText('Improvement Tips')).toBeTruthy();
  });
});

