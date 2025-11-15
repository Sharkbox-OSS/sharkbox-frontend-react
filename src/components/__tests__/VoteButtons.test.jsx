import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButtons from '../VoteButtons';

describe('VoteButtons', () => {
  it('renders vote buttons and score', () => {
    render(
      <VoteButtons
        score={42}
        userVote={null}
        onUpvote={() => {}}
        onDownvote={() => {}}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('calls onUpvote when upvote button is clicked', async () => {
    const user = userEvent.setup();
    const onUpvote = vi.fn();

    render(
      <VoteButtons
        score={10}
        userVote={null}
        onUpvote={onUpvote}
        onDownvote={() => {}}
      />
    );

    const upvoteButton = screen.getByLabelText('Upvote');
    await user.click(upvoteButton);

    expect(onUpvote).toHaveBeenCalledTimes(1);
  });

  it('calls onDownvote when downvote button is clicked', async () => {
    const user = userEvent.setup();
    const onDownvote = vi.fn();

    render(
      <VoteButtons
        score={10}
        userVote={null}
        onUpvote={() => {}}
        onDownvote={onDownvote}
      />
    );

    const downvoteButton = screen.getByLabelText('Downvote');
    await user.click(downvoteButton);

    expect(onDownvote).toHaveBeenCalledTimes(1);
  });

  it('applies accent style to upvote when userVote is true', () => {
    render(
      <VoteButtons
        score={10}
        userVote={true}
        onUpvote={() => {}}
        onDownvote={() => {}}
      />
    );

    const upvoteButton = screen.getByLabelText('Upvote');
    expect(upvoteButton).toHaveClass('text-accent-primary');
  });

  it('applies accent style to downvote when userVote is false', () => {
    render(
      <VoteButtons
        score={10}
        userVote={false}
        onUpvote={() => {}}
        onDownvote={() => {}}
      />
    );

    const downvoteButton = screen.getByLabelText('Downvote');
    expect(downvoteButton).toHaveClass('text-accent-secondary');
  });

  it('displays negative scores correctly', () => {
    render(
      <VoteButtons
        score={-5}
        userVote={null}
        onUpvote={() => {}}
        onDownvote={() => {}}
      />
    );

    expect(screen.getByText('-5')).toBeInTheDocument();
  });
});

