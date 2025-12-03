import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getThread, updateThread } from '../services/threadService';
import { useAuth } from '../hooks/useAuth';

/**
 * EditThreadPage Component
 * Modern form to edit an existing thread
 */
const EditThreadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: thread, isLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => getThread(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (threadData) => updateThread(id, threadData),
    onSuccess: () => {
      navigate(`/box/${thread.box.slug}/thread/${id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if user owns the thread
    if (thread && user?.profile?.sub !== thread.userId) {
      alert('You can only edit your own threads');
      return;
    }

    const formData = new FormData(e.target);
    const threadData = {
      title: formData.get('title'),
      type: formData.get('type'),
      content: formData.get('content') || '',
      description: formData.get('description') || '',
    };

    updateMutation.mutate(threadData);
  };

  if (isLoading) {
    return (
      <div className="container-content">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container-content">
        <div className="text-center py-8 text-accent-primary">Thread not found</div>
      </div>
    );
  }

  if (user?.profile?.sub !== thread.userId) {
    return (
      <div className="container-content">
        <div className="text-center py-8 text-accent-primary">
          You don't have permission to edit this thread
        </div>
      </div>
    );
  }

  return (
    <div className="container-content">
      <div className="card p-8 max-w-2xl mx-auto">
        <h1 className="text-text-primary mb-8 text-2xl font-bold">Edit Thread</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-text-primary font-semibold">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={300}
              className="input-base"
              defaultValue={thread.title}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-text-primary font-semibold">
              Type *
            </label>
            <select id="type" name="type" required className="input-base" defaultValue={thread.type}>
              <option value="TEXT">Text</option>
              <option value="LINK">Link</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="POLL">Poll</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-text-primary font-semibold">
              Content/URL *
            </label>
            <input
              type="text"
              id="content"
              name="content"
              required
              className="input-base"
              defaultValue={thread.content || ''}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-text-primary font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              className="input-base min-h-[120px] resize-y"
              defaultValue={thread.description || ''}
            />
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditThreadPage;
