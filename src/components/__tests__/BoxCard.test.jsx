import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BoxCard from '../BoxCard';
import { AllTheProviders } from '../../test/utils/testUtils';

const mockBox = {
  id: 1,
  name: 'Test Box',
  slug: 'test-box',
  description: 'This is a test box description',
  owner: 'testuser',
  access: 'PUBLIC',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('BoxCard', () => {
  it('renders box information correctly', () => {
    render(
      <AllTheProviders>
        <BoxCard box={mockBox} />
      </AllTheProviders>
    );

    expect(screen.getByText('b/test-box')).toBeInTheDocument();
    expect(screen.getByText('Test Box')).toBeInTheDocument();
    expect(screen.getByText('This is a test box description')).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });

  it('renders access level badge', () => {
    render(
      <AllTheProviders>
        <BoxCard box={mockBox} />
      </AllTheProviders>
    );

    expect(screen.getByText('PUBLIC')).toBeInTheDocument();
  });

  it('links to the correct box page', () => {
    render(
      <AllTheProviders>
        <BoxCard box={mockBox} />
      </AllTheProviders>
    );

    const link = screen.getByText('b/test-box').closest('a');
    expect(link).toHaveAttribute('href', '/b/test-box');
  });

  it('renders without description', () => {
    const boxWithoutDescription = { ...mockBox, description: null };
    render(
      <AllTheProviders>
        <BoxCard box={boxWithoutDescription} />
      </AllTheProviders>
    );

    expect(screen.getByText('Test Box')).toBeInTheDocument();
    expect(screen.queryByText('This is a test box description')).not.toBeInTheDocument();
  });
});

