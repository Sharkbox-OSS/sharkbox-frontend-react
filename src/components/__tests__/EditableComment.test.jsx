import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableComment from '../EditableComment';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { profile: { sub: 'u1' } } }),
}));

describe('EditableComment link action', () => {
  const baseComment = {
    id: 123,
    userId: 'u2',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    content: 'Hello',
    upvotes: 1,
    downvotes: 0,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('copies permalink and shows Copied', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText },
      writable: false,
    });

    render(
      <EditableComment
        comment={baseComment}
        onVote={() => {}}
        onEdit={() => {}}
        onReply={() => {}}
        onToggleCollapse={() => {}}
        isCollapsed={false}
        level={0}
      />
    );

    const linkBtn = screen.getByRole('button', { name: /copy comment link/i });
    await user.click(linkBtn);

    expect(writeText).toHaveBeenCalled();
    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });

  it('shows OP badge when isOp is true', () => {
    render(
      <EditableComment
        comment={baseComment}
        onVote={() => {}}
        onEdit={() => {}}
        onReply={() => {}}
        onToggleCollapse={() => {}}
        isCollapsed={false}
        level={0}
        isOp={true}
      />
    );

    expect(screen.getByText('OP')).toBeInTheDocument();
  });

  it('does not show OP badge when isOp is false', () => {
    render(
      <EditableComment
        comment={baseComment}
        onVote={() => {}}
        onEdit={() => {}}
        onReply={() => {}}
        onToggleCollapse={() => {}}
        isCollapsed={false}
        level={0}
        isOp={false}
      />
    );

    expect(screen.queryByText('OP')).not.toBeInTheDocument();
  });
});


