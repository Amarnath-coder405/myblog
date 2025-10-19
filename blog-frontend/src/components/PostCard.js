import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{post.excerpt}</p>
        <Link to={`/post/${post.id}`} className="btn btn-primary">Read More</Link>
      </div>
    </div>
  );
}
