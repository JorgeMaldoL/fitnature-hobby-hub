import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`}>
        <h2 className="post-title">{post.title}</h2>
        
        {post.flags && post.flags.length > 0 && (
          <div className="post-flags">
            {post.flags.map(flag => (
              <span key={flag} className="post-flag">{flag}</span>
            ))}
          </div>
        )}
        
        <div className="post-meta">
          <span>Created: {new Date(post.created_at).toLocaleString()}</span>
          <span>By: {post.author_id || 'Anonymous'}</span>
          <span>Upvotes: {post.upvotes}</span>
        </div>
        
        {post.content && (
          <p className="post-preview">
            {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
          </p>
        )}
        
        {post.image && (
          <img src={post.image} alt="Workout preview" className="post-card-image" />
        )}
      </Link>
    </div>
  );
}
