import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createBox } from '../services/boxService';
import { useAuth } from '../hooks/useAuth';

/**
 * CreateBoxPage Component
 * Modern form to create a new box (subreddit)
 */
const CreateBoxPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const createMutation = useMutation({
    mutationFn: (boxData) => createBox(boxData),
    onSuccess: (data) => {
      navigate(`/b/${data.slug}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to create a box');
      return;
    }

    const formData = new FormData(e.target);
    const boxData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      access: formData.get('access'),
    };

    createMutation.mutate(boxData);
  };

  return (
    <div className="container-content">
      <div className="card p-8 max-w-2xl mx-auto">
        <h1 className="text-text-primary mb-8 text-2xl font-bold">Create New Box</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-text-primary font-semibold">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              maxLength={100}
              className="input-base"
              placeholder="Enter box name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="text-text-primary font-semibold">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className="input-base"
              placeholder="lowercase-with-dashes"
              title="Lowercase letters, numbers, and hyphens only"
            />
            <small className="text-text-secondary text-xs">
              URL-friendly identifier (lowercase, no spaces)
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-text-primary font-semibold">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="6"
              className="input-base min-h-[120px] resize-y"
              placeholder="Describe what this box is about"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="access" className="text-text-primary font-semibold">
              Access Level *
            </label>
            <select id="access" name="access" required className="input-base">
              <option value="PUBLIC">Public - Anyone can view and post</option>
              <option value="PRIVATE">Private - Invitation only</option>
              <option value="UNLISTED">Unlisted - Anyone with link can view</option>
            </select>
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
              {createMutation.isPending ? 'Creating...' : 'Create Box'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoxPage;
