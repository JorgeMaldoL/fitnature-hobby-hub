import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editFlags, setEditFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const availableFlags = ['Question', 'Opinion', 'Event', 'Beginner Friendly', 'Advanced', 'Indoor', 'Outdoor'];

  const isAuthor = post && post.author_id === userId;

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data } = await supabase.from('Posts').select('*').eq('id', id).single();
    setPost(data);
    if (data) {
      setEditTitle(data.title || '');
      setEditContent(data.content || '');
      setEditImage(data.image || '');
      setEditFlags(data.flags || []);
    }
    setLoading(false);
  }

  async function handleUpvote() {
    const newCount = post.upvotes + 1;
    await supabase.from('Posts').update({ upvotes: newCount }).eq('id', id);
    setPost({ ...post, upvotes: newCount });
  }

  async function handleDelete() {
    if (!isAuthor) {
      alert('You can only delete your own posts.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this workout group?')) {
      const { error } = await supabase.from('Posts').delete().eq('id', id);
      if (!error) {
        navigate('/');
      } else {
        alert('Error deleting post: ' + error.message);
      }
    }
  }

  async function handleEdit() {
    if (!isAuthor) {
      alert('You can only edit your own posts.');
      return;
    }
    
    const { error } = await supabase.from('Posts').update({
      title: editTitle,
      content: editContent,
      image: editImage,
      flags: editFlags
    }).eq('id', id);

    if (!error) {
      setPost({ 
        ...post, 
        title: editTitle, 
        content: editContent, 
        image: editImage,
        flags: editFlags
      });
      setIsEditing(false);
    } else {
      alert('Error updating post: ' + error.message);
    }
  }

  const handleFlagToggle = (flag) => {
    setEditFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading workout group...</p>
        </div>
      </div>
    );
  }

  if (!post) return <div className="page-container">Workout group not found.</div>;

  return (
    <div className="post-detail">
      <div className="post-header-nav">
        <Link to="/" className="back-link">← Back to Groups</Link>
      </div>
      
      {isEditing ? (
        <div className="edit-form">
          <h2>Edit Workout Group</h2>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Flags</label>
            <div className="flag-selection">
              {availableFlags.map(flag => (
                <label key={flag} className="flag-option">
                  <input
                    type="checkbox"
                    checked={editFlags.includes(flag)}
                    onChange={() => handleFlagToggle(flag)}
                  />
                  <span>{flag}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="action-buttons">
            <button onClick={handleEdit} className="btn">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-detail-header">
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-meta">
              <span>Created: {new Date(post.created_at).toLocaleString()}</span>
              <span>Author: {post.author_id}</span>
              <span>{post.upvotes} interested</span>
            </div>
            {post.flags && post.flags.length > 0 && (
              <div className="post-flags">
                {post.flags.map(flag => (
                  <span key={flag} className="post-flag">{flag}</span>
                ))}
              </div>
            )}
          </div>

          {post.content && <div className="post-detail-content">{post.content}</div>}
          
          {post.image && <img src={post.image} alt="Workout location" className="post-image" />}
          
          <div className="action-buttons">
            <button onClick={handleUpvote} className="btn">
              I'm Interested! ({post.upvotes})
            </button>
            {isAuthor && (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
