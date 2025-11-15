import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RelativeTime from '../RelativeTime';

describe('RelativeTime', () => {
  it('displays relative time', () => {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    render(<RelativeTime dateString={oneHourAgo.toISOString()} />);

    expect(screen.getByText(/about 1 hour ago/i)).toBeInTheDocument();
  });

  it('shows exact timestamp in title attribute', () => {
    const date = new Date('2024-01-15T15:30:00Z');

    render(<RelativeTime dateString={date.toISOString()} />);

    const element = screen.getByText(/ago/i);
    expect(element).toHaveAttribute('title');
    const title = element.getAttribute('title');
    expect(title).toMatch(/2024/);
    expect(title).toMatch(/jan|january/i);
  });

  it('applies custom className', () => {
    const date = new Date();
    render(<RelativeTime dateString={date.toISOString()} className="custom-class" />);

    const element = screen.getByText(/ago/i);
    expect(element).toHaveClass('custom-class');
  });

  it('handles invalid dates gracefully', () => {
    render(<RelativeTime dateString="invalid-date" />);
    expect(screen.getByText('unknown time')).toBeInTheDocument();
  });
});

