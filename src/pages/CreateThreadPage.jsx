import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getBoxBySlug } from '../services/boxService';
import { createThread } from '../services/threadService';
import { useAuth } from '../hooks/useAuth';

/**
 * CreateThreadPage Component
 * Modern form to create a new thread in a box
 */
const CreateThreadPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: box, isLoading } = useQuery({
    queryKey: ['box', slug],
    queryFn: () => getBoxBySlug(slug),
    enabled: !!slug,
  });

  const createMutation = useMutation({
    mutationFn: (threadData) => createThread(slug, threadData),
    onSuccess: (data) => {
      navigate(`/box/${slug}/thread/${data.id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to create a thread');
      return;
    }

    const formData = new FormData(e.target);
    const threadData = {
      title: formData.get('title'),
      type: formData.get('type'),
      content: formData.get('content') || '',
      description: formData.get('description') || '',
    };

    createMutation.mutate(threadData);
  };

  if (isLoading) {
    return (
      <div className="container-content">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-content">
      <div className="card p-8 max-w-2xl mx-auto">
        <h1 className="text-text-primary mb-8 text-2xl font-bold">
          Create Thread in b/{box?.slug}
        </h1>
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
              placeholder="Enter thread title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-text-primary font-semibold">
              Type *
            </label>
            <select id="type" name="type" required className="input-base">
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
              placeholder="Enter content or URL depending on type"
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
              placeholder="Optional description"
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
              disabled={createMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadPage;
