import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        return res.json();
      })
      .then(data => {
        // Ensure all IDs are strings
        const formattedPosts = data.map(post => ({
          ...post,
          id: post.id.toString(),
        }));
        setPosts(formattedPosts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
      }).then(() => {
        setPosts(prevPosts => prevPosts.filter(post => post.id.toString() !== id.toString()));
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-success" onClick={() => navigate('/admin/new')}>Add New Post</button>
      </div>
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.publishDate}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/admin/edit/${post.id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
