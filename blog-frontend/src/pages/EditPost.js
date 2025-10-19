import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPost() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔁 Fetch post data by ID
  useEffect(() => {
    if (!id) {
      setError('No post ID provided.');
      return;
    }

    fetch(`http://localhost:3001/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found.');
        return res.json();
      })
      .then((data) => {
        setFormData({
          ...data,
          categories: Array.isArray(data.categories) ? data.categories.join(', ') : '',
          imageUrl: data.imageUrl || '',
          videoUrl: data.videoUrl || '',
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPost = {
      ...formData,
      categories: formData.categories
        .split(',')
        .map((cat) => cat.trim())
        .filter(Boolean),
    };

    fetch(`http://localhost:3001/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update post.');
        alert('Post updated successfully!');
        navigate('/admin');
      })
      .catch((err) => {
        console.error(err);
        alert('Update failed.');
      });
  };

  if (error) {
    return (
      <div className="container mt-5">
        <h2>Error</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!formData) return <div className="container mt-5">Loading post data...</div>;

  return (
    <div className="container mt-5">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Excerpt */}
        <div className="mb-3">
          <label>Excerpt</label>
          <input
            type="text"
            className="form-control"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label>Content</label>
          <textarea
            className="form-control"
            name="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label>Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* Publish Date */}
        <div className="mb-3">
          <label>Publish Date</label>
          <input
            type="date"
            className="form-control"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Categories */}
        <div className="mb-3">
          <label>Categories (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
          />
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="url"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Post"
                className="img-fluid rounded"
                style={{ maxHeight: '250px' }}
              />
            </div>
          )}
        </div>

        {/* Video URL */}
        <div className="mb-3">
          <label>Video URL (YouTube embed or direct link)</label>
          <input
            type="url"
            className="form-control"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/embed/..."
          />
          {formData.videoUrl && (
            <div className="mt-2 ratio ratio-16x9">
              <iframe
                src={formData.videoUrl}
                title="Post video"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <button className="btn btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}
