import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', message: '' });
  const [error, setError] = useState('');

  // Fetch post data on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/posts/${id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);

        const savedComments = localStorage.getItem(`comments-${id}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      } catch (err) {
        console.error(err);
        setError('Post not found or removed.');
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const { name, message } = commentForm;

    if (!name.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setCommentForm({ name: '', message: '' });
  };

  if (error) {
    return (
      <div className="container py-5">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return <div className="container py-5">Loading post...</div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '960px' }}>
      {/* Title */}
      <h1 className="fw-bold mb-3">{post.title}</h1>

      {/* Meta Info */}
      <p className="text-muted mb-3">
        By <strong>{post.author}</strong> |{' '}
        {dayjs(post.publishDate).format('MMMM D, YYYY')}
      </p>

      {/* Categories */}
      <div className="mb-4">
        {post.categories?.map((cat) => (
          <span key={cat} className="badge bg-secondary me-2">
            {cat}
          </span>
        ))}
      </div>

      {/* Image & Content Wrapper */}
      <div className="d-flex flex-column flex-lg-row gap-4 align-items-start mb-5">
        {/* Image */}
        {post.imageUrl && (
          <div
            className="w-100"
            style={{
              maxWidth: '360px',
              flexShrink: 0,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="img-fluid"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="flex-grow-1"
          style={{ fontSize: '1.1rem', lineHeight: '1.7' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Video Embed (optional) */}
      {/* {post.videoUrl && (
        <div className="mb-5">
          <div className="ratio ratio-16x9">
            <iframe
              src={post.videoUrl}
              title="Embedded Video"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        </div>
      )} */}

      {/* Share Section */}
      <div className="mb-5">
        <h5 className="mb-3">Share this post:</h5>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm btn-primary">Facebook</button>
          <button className="btn btn-sm btn-info text-white">Twitter</button>
          <button className="btn btn-sm btn-danger">Pinterest</button>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-5">
        <h4 className="mb-3">Leave a Comment</h4>
        <form onSubmit={handleCommentSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="commentName" className="form-label">
              Name
            </label>
            <input
              id="commentName"
              type="text"
              className="form-control"
              value={commentForm.name}
              onChange={(e) =>
                setCommentForm({ ...commentForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="commentMessage" className="form-label">
              Comment
            </label>
            <textarea
              id="commentMessage"
              className="form-control"
              rows="3"
              value={commentForm.message}
              onChange={(e) =>
                setCommentForm({ ...commentForm, message: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mb-5">
          <h5 className="mb-3">
            {comments.length} Comment{comments.length > 1 ? 's' : ''}
          </h5>
          <ul className="list-group">
            {comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                <strong>{comment.name}</strong>
                <p className="mb-0">{comment.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
