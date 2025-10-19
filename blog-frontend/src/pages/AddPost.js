import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPost() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishDate: '',
    categories: '',
    imageUrl: '',
    videoUrl: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(''); // clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.author || !formData.publishDate) {
      setError('Please fill all required fields.');
      return;
    }

    const newPost = {
      ...formData,
      id: Date.now(),
      categories: formData.categories
        .split(',')
        .map((cat) => cat.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error('Failed to create post');

      alert('✅ Post created successfully!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to create post. Please try again.');
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: '720px' }}>
      <h2 className="mb-4 text-center">📬 Add New Blog Post</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title *</label>
          <input type="text" name="title" id="title" className="form-control" onChange={handleChange} required />
        </div>

        {/* Excerpt */}
        <div className="mb-3">
          <label htmlFor="excerpt" className="form-label">Excerpt *</label>
          <input type="text" name="excerpt" id="excerpt" className="form-control" onChange={handleChange} required />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content *</label>
          <textarea name="content" id="content" className="form-control" rows="5" onChange={handleChange} required />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author *</label>
          <input type="text" name="author" id="author" className="form-control" onChange={handleChange} required />
        </div>

        {/* Publish Date */}
        <div className="mb-3">
          <label htmlFor="publishDate" className="form-label">Publish Date *</label>
          <input type="date" name="publishDate" id="publishDate" className="form-control" onChange={handleChange} required />
        </div>

        {/* Categories */}
        <div className="mb-3">
          <label htmlFor="categories" className="form-label">Categories (comma-separated)</label>
          <input type="text" name="categories" id="categories" className="form-control" onChange={handleChange} />
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            className="form-control"
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Image Preview */}
        {formData.imageUrl && (
          <div className="mb-3">
            <label className="form-label">Image Preview</label>
            <img
              src={formData.imageUrl}
              alt="Post"
              className="img-fluid rounded shadow-sm border"
              style={{ maxHeight: '300px' }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        )}

        {/* Video URL */}
        <div className="mb-3">
          <label htmlFor="videoUrl" className="form-label">Video Embed URL (YouTube iframe or direct MP4)</label>
          <input
            type="url"
            name="videoUrl"
            id="videoUrl"
            className="form-control"
            onChange={handleChange}
            placeholder="https://www.youtube.com/embed/VIDEO_ID or https://example.com/video.mp4"
          />
        </div>

        {/* Video Preview */}
        {formData.videoUrl && (
          <div className="mb-4">
            <label className="form-label">Video Preview</label>
            {/* If YouTube embed, show iframe, else if mp4 URL show video tag */}
            {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
              <div className="ratio ratio-16x9">
                <iframe
                  src={formData.videoUrl}
                  title="Video Preview"
                  allowFullScreen
                  frameBorder="0"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            ) : (
              <video
                src={formData.videoUrl}
                controls
                className="w-100 rounded shadow-sm border"
                style={{ maxHeight: '300px' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">🚀 Publish Post</button>
      </form>
    </div>
  );
}
